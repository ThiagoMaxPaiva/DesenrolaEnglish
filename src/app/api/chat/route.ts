import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import { weeklyPlan } from '@/lib/weeklyPlan';

// Prevent vercel serverless function from running too long (max 30s for hobby)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, dayId } = await req.json();

    // -- SECURITY PAYLOAD VALIDATION --
    // Prevent abuse by limiting the array size and character count
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    
    // Limit conversation context to last 20 messages to save tokens
    const recentMessages = messages.slice(-20);
    
    // Check if the last message isn't abnormally large (e.g. max 1000 characters)
    const lastMessage = recentMessages[recentMessages.length - 1];
    if (lastMessage && lastMessage.content.length > 1000) {
      return NextResponse.json({ error: 'Message too long. Max 1000 characters.' }, { status: 413 });
    }
    // ---------------------------------

    // Find the current day's context
    const currentDay = weeklyPlan.find((d) => d.id === dayId);

    const basePrompt = `You are "Coach D", the English tutor for Desenrola English.
You help Brazilian Portuguese speakers learn and practice English.
Your teaching style is:
- Friendly, encouraging, and patient
- You use casual, natural English (not overly formal)
- You gently correct mistakes and explain why
- You mix in Brazilian cultural references to keep things relatable
- Keep responses concise (2-3 sentences max)

Always respond in English unless the user is clearly struggling, then you can briefly explain in Portuguese before switching back to English.`;

    const roleplayPrompt = currentDay 
      ? `\n\n--- CURRENT MISSION ---\n${currentDay.roleplayContext}\n\nIMPORTANT: You must stay in character for this roleplay! Do not act like a tutor right now, act exactly as the character described in the mission.`
      : '';

    const SYSTEM_PROMPT = basePrompt + roleplayPrompt;

    if (!process.env.GEMINI_API_KEY) {
      let response = "Hey! Let's practice some English today!";
      if (currentDay) {
         response = `[Mock Mode] I am ready to start the "${currentDay.title}" roleplay! However, the GEMINI_API_KEY is not configured in .env.local, so I cannot generate real responses right now.`;
      }
      
      // Criar um mock stream que o Vercel AI SDK entenda
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const chunk = encoder.encode(`0:"${response}"\n`);
          controller.enqueue(chunk);
          controller.close();
        }
      });
      
      return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    // Call Gemini with Streaming using AI SDK
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: SYSTEM_PROMPT,
      messages: recentMessages,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
