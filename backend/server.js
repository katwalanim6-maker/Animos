import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 10000);
const origins = (process.env.ALLOWED_ORIGINS || '*').split(',').map((item) => item.trim()).filter(Boolean);

app.use(cors({ origin: origins.includes('*') ? true : origins }));
app.use(express.json({ limit: '1mb' }));

let knowledge = {};
let systemPrompt = '';
try {
  knowledge = JSON.parse(await fs.readFile(path.join(process.cwd(), 'knowledge.json'), 'utf8'));
  systemPrompt = await fs.readFile(path.join(process.cwd(), 'prompts', 'system.txt'), 'utf8');
} catch (error) {
  console.warn('Knowledge files could not be loaded:', error.message);
}

app.get('/', (_req, res) => {
  res.json({ status: 'online', name: 'Anim Core', version: '2.0.0' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

app.post('/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (message.length > 4000) {
    return res.status(413).json({ error: 'Message is too long.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'AI service is not configured on the server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `${systemPrompt}\n\nApplication knowledge:\n${JSON.stringify(knowledge)}\n\nUser message:\n${message}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const reply = response.text?.trim();
    if (!reply) {
      return res.status(502).json({ error: 'The AI returned an empty response.' });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Gemini request failed:', error);
    return res.status(502).json({ error: 'AI provider request failed.' });
  }
});

app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));

app.listen(PORT, () => {
  console.log(`Anim Core running on port ${PORT}`);
});
