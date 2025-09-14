import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageUrl, language } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (!language || !['english', 'french', 'arabic'].includes(language)) {
      return NextResponse.json(
        { error: 'Valid language is required (english, french, or arabic)' },
        { status: 400 }
      );
    }

    // Determine the target language for the response
    let targetLanguage = 'English';
    if (language === 'french') targetLanguage = 'French';
    if (language === 'arabic') targetLanguage = 'Arabic';

    const systemPrompt = `You are an expert image analyzer and fun facts generator. Analyze the provided image and generate 3 interesting, educational, and entertaining facts about what you see. The facts should be:

1. Accurate and informative
2. Engaging and surprising
3. Educational but fun
4. Appropriate for all ages
5. Focused on the main subjects in the image (animals, nature, people, objects, etc.)

Respond ONLY with the 3 facts, numbered 1-3, in ${targetLanguage}. Each fact should be 1-2 sentences long. Be specific about what you observe in the image.

If the image contains:
- Animals: Share facts about the species, behavior, habitat, or unique characteristics
- Nature/Landscapes: Share facts about geography, geology, weather, or natural phenomena
- People: Share facts about culture, history, activities, or human behavior
- Objects/Architecture: Share facts about design, history, technology, or cultural significance

Make the facts fascinating and make people want to learn more!`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this image and generate 3 fun facts about what you see, written in ${targetLanguage}.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const facts = data.choices[0]?.message?.content?.trim();

    if (!facts) {
      throw new Error('No facts generated');
    }

    return NextResponse.json({
      success: true,
      facts,
      language: targetLanguage,
      imageUrl
    });

  } catch (error) {
    console.error('Error generating facts:', error);
    
    // Fallback facts based on language
    const fallbackFacts = {
      english: [
        "1. This image contains elements that showcase the incredible diversity of our world.",
        "2. Every detail tells a story about the beauty and complexity of nature and human creativity.",
        "3. Images like this remind us of the wonder and mystery that surrounds us every day."
      ],
      french: [
        "1. Cette image contient des éléments qui montrent l'incroyable diversité de notre monde.",
        "2. Chaque détail raconte une histoire sur la beauté et la complexité de la nature et de la créativité humaine.",
        "3. Des images comme celle-ci nous rappellent l'émerveillement et le mystère qui nous entourent chaque jour."
      ],
      arabic: [
        "1. تحتوي هذه الصورة على عناصر تُظهر التنوع المذهل لعالمنا.",
        "2. كل تفصيل يحكي قصة عن جمال وتعقيد الطبيعة والإبداع البشري.",
        "3. صور مثل هذه تذكرنا بالعجب والغموض الذي يحيط بنا كل يوم."
      ]
    };

    const selectedLanguage = request.body ? JSON.parse(JSON.stringify(request.body)).language || 'english' : 'english';
    const fallback = fallbackFacts[selectedLanguage as keyof typeof fallbackFacts] || fallbackFacts.english;

    return NextResponse.json({
      success: false,
      facts: fallback.join('\n'),
      language: selectedLanguage === 'french' ? 'French' : selectedLanguage === 'arabic' ? 'Arabic' : 'English',
      fallback: true,
      error: 'Using fallback facts due to API error'
    });
  }
}

