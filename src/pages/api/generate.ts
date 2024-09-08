import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("no API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getResponse = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating content:', error.message);
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ message: 'Invalid request, prompt is required.' });
  }

  try {
    const responseText = await getResponse(prompt);
    return res.status(200).json({ response: responseText });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Failed to generate content', error: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}
