import Anthropic from '@anthropic-ai/sdk';
import { getForm } from '../../forms/registry';

export const runtime = 'nodejs';  // Edge-Runtime kompatibel ist nicht garantiert wegen dynamic imports

export async function POST(request) {
  try {
    const { text, formId } = await request.json();
    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'text required' }, { status: 400 });
    }
    if (!formId || typeof formId !== 'string') {
      return Response.json({ error: 'formId required' }, { status: 400 });
    }

    const form = getForm(formId);
    if (!form) {
      return Response.json({ error: `unknown formId: ${formId}` }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = form.getPrompt();

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: text }],
    });

    return Response.json(message);
  } catch (error) {
    console.error('Parse error:', error);
    return Response.json({ error: error.message || 'parse failed' }, { status: 500 });
  }
}
