import { NextResponse } from 'next/server';
import { storageUtils, firestoreUtils } from '@/lib/firebase-utils';

export async function POST(request: Request) {
  try {
    const { prompt, userId } = await request.json();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt.trim(),
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Download the image from OpenAI
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBlob = await imageResponse.blob();

    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `ai-generated-${timestamp}.png`;
    const filePath = `users/${userId}/library/${fileName}`;

    // Create a File object from the blob
    const imageFile = new File([imageBlob], fileName, { type: 'image/png' });

    // Upload to Firebase Storage
    const downloadURL = await storageUtils.uploadFile(imageFile, filePath);

    // Save as library item in Firestore
    const libraryItem = {
      clerkUserId: userId,
      title: `AI Generated Image: ${prompt.trim().substring(0, 50)}${prompt.trim().length > 50 ? '...' : ''}`,
      description: `Generated using AI with prompt: "${prompt.trim()}"`,
      type: 'other',
      fileUrl: downloadURL,
      fileName: fileName,
      author: 'AI (DALL-E 3)',
      tags: ['ai-generated', 'image', 'dall-e'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const itemId = await firestoreUtils.add('library', libraryItem);

    return NextResponse.json({ 
      success: true,
      imageUrl: downloadURL,
      prompt: prompt.trim(),
      itemId,
      libraryItem: {
        id: itemId,
        ...libraryItem
      }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image',
      success: false 
    }, { status: 500 });
  }
}
