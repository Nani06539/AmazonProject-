import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a motivational quote generator. Create short, powerful, and creative motivational quotes that inspire people to take action, be positive, and achieve their goals. Keep quotes under 100 characters and make them impactful.'
          },
          {
            role: 'user',
            content: 'Generate a new motivational quote that is short, powerful, and creative. Make it inspiring and actionable.'
          }
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.choices[0]?.message?.content?.trim();

    if (!quote) {
      throw new Error('No quote generated');
    }

    return NextResponse.json({ 
      quote,
      success: true 
    });

  } catch (error) {
    console.error('Error generating quote:', error);
    
    // Fallback quotes if API fails
    const fallbackQuotes = [
      "The only way to do great work is to love what you do.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "Believe you can and you're halfway there.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Don't watch the clock; do what it does. Keep going.",
      "The only limit to our realization of tomorrow is our doubts of today.",
      "It always seems impossible until it's done.",
      "Your time is limited, don't waste it living someone else's life.",
      "The way to get started is to quit talking and begin doing.",
      "What you get by achieving your goals is not as important as what you become by achieving your goals."
    ];
    
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    
    return NextResponse.json({ 
      quote: randomQuote,
      success: false,
      fallback: true 
    });
  }
}

