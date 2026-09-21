import { NextRequest, NextResponse } from 'next/server';

/**
 * Chat API route - Gemini API boilerplate.
 *
 * To connect to Gemini:
 * 1. Set GEMINI_API_KEY in your .env.local
 * 2. Uncomment the Gemini integration code below
 *
 * For now, this returns intelligent fallback responses.
 */

const SYSTEM_PROMPT = `You are "Coach D", the English tutor for Desenrola English.
You help Brazilian Portuguese speakers learn and practice English.
Your teaching style is:
- Friendly, encouraging, and patient
- You use casual, natural English (not overly formal)
- You gently correct mistakes and explain why
- You mix in Brazilian cultural references to keep things relatable
- You challenge the student to think and respond in English
- Keep responses concise (2-3 sentences max unless explaining something)
- Occasionally use Portuguese to clarify complex concepts

Always respond in English unless the user is clearly struggling, then you can briefly explain in Portuguese before switching back to English.`;

const fallbackResponses = [
  "Hey! Great to hear from you. Let's practice some English today! What topic interests you? We could talk about travel, movies, food, or anything you'd like.",
  "Nice try! That's a good start. Remember, in English we usually put the subject before the verb. Can you try rephrasing that?",
  "That's awesome! Your English is getting better. Let me ask you something: What did you do last weekend? Try to use past tense verbs in your answer.",
  "I love your enthusiasm! Here's a quick challenge: Can you describe your favorite Brazilian food using at least 3 adjectives? For example: 'Feijoada is a hearty, flavorful, and traditional dish.'",
  "Great question! In everyday English, we'd say it more casually. Instead of a formal phrase, try something like 'What's up?' or 'How's it going?' — much more natural!",
  "You're doing really well! Let's try something harder. Imagine you're at a job interview in English. How would you introduce yourself and talk about your experience?",
  "Perfect! That sentence was spot on. Your grammar is improving! Now, let's work on your vocabulary. Do you know any English idioms? For example, 'break a leg' means 'good luck'!",
  "Interesting point! Let me share a common expression: 'To be on the same page' means everyone agrees or understands. Can you use it in a sentence?",
];

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    // ─── Gemini API Integration (uncomment when ready) ───
    // const apiKey = process.env.GEMINI_API_KEY;
    // if (apiKey) {
    //   const response = await fetch(
    //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    //     {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    //         contents: messages.map((m: { role: string; content: string }) => ({
    //           role: m.role === 'assistant' ? 'model' : 'user',
    //           parts: [{ text: m.content }],
    //         })),
    //       }),
    //     }
    //   );
    //
    //   if (response.ok) {
    //     const data = await response.json();
    //     const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    //     return NextResponse.json({ message: text });
    //   }
    // }

    // ─── Fallback: Smart random response ───
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    let response: string;

    if (messages.length <= 1) {
      response = fallbackResponses[0];
    } else if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
      response = "Hey there! 👋 Great to see you! How are you feeling today? Try answering in a full English sentence!";
    } else if (lastMessage.includes('help') || lastMessage.includes('ajuda')) {
      response = "No worries, I'm here to help! Just speak naturally in English — don't be afraid to make mistakes. That's how we learn! What would you like to practice?";
    } else if (lastMessage.length < 10) {
      response = "Good start! But try to give me a longer answer — at least a full sentence. For example, instead of just 'good', try 'I'm doing good, thanks for asking!'";
    } else {
      response = fallbackResponses[Math.floor(Math.random() * (fallbackResponses.length - 1)) + 1];
    }

    // Simulate a slight delay like a real API
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
