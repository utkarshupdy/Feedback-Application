import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const runtime = 'edge';

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions, use only english ,  formatted as a single string. Make question length shorter min 7 words and max 15 words words only . Each question should be separated by '||'...";

    // Generate a response using Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Instead of "suggestions", use "completion" or the expected field
    return NextResponse.json({ completion: text.split('||') });
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again later.' },
      { status: 500 }
    );
  }
}
