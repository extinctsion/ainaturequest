import { NextRequest, NextResponse } from 'next/server';
import { GemmaAIProvider } from '@/lib/ai/gemma-provider';
import { AIHealthStatus } from '@/lib/types/quest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  return handleHealthCheck();
}

export async function POST(_req: NextRequest) {
  return handleHealthCheck();
}

async function handleHealthCheck() {
  const provider = (process.env.AI_PROVIDER || 'demo').toLowerCase().trim();
  const apiUrl = process.env.AI_API_URL || 'http://localhost:11434';
  const apiKey = process.env.AI_API_KEY;
  const modelName = process.env.AI_MODEL || 'gemma3:4b';

  if (provider === 'demo') {
    const status: AIHealthStatus = {
      ok: true,
      provider: 'demo',
      model: 'deterministic-nature-engine-v1',
      endpoint: 'local-browser',
      availableModels: ['deterministic-nature-engine-v1'],
      latencyMs: 1,
      isMultimodal: true,
      message: 'Demo AI is ready (deterministic offline mode, zero keys required).',
    };
    return NextResponse.json(status, { status: 200 });
  }

  const gemmaProvider = new GemmaAIProvider(apiUrl, apiKey, modelName);
  const health = await gemmaProvider.checkHealth();

  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
