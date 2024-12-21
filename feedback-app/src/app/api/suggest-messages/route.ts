import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    // Check if the API key exists
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not set in the environment variables');
    }

    // Initialize GoogleGenerativeAI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt =
      "Create a list of three open-ended and engaging questions, use only english ,  formatted as a single string. Make question length shorter min 7 words and max 15 words words only . Each question should be separated by '||'...";

    // Generate a response using the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the response as JSON
    return NextResponse.json({ completion: text.split('||') });
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again later.' },
      { status: 500 }
    );
  }
}
