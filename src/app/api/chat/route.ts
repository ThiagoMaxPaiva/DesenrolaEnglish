import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

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

// Fallback responses if no API key is provided
const fallbackResponses = [
  "Hey! Great to hear from you. Let's practice some English today! What topic interests you? We could talk about travel, movies, food, or anything you'd like.",
  "Nice try! That's a good start. Remember, in English we usually put the subject before the verb. Can you try rephrasing that?",
  "That's awesome! Your English is getting better. Let me ask you something: What did you do last weekend? Try to use past tense verbs in your answer.",
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Simulate a response if no key is set (Mock behavior)
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
        response = "Hey there! 👋 Great to see you! How are you feeling today? Try answering in a full English sentence!";
      }
      
      // Simulate slight network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({ text: response });
    }

    // Call Gemini with Streaming using AI SDK
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
