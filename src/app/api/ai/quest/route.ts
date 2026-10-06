import { NextRequest, NextResponse } from 'next/server';
import { QuestRequest } from '@/lib/types/quest';
import { GemmaAIProvider } from '@/lib/ai/gemma-provider';
import { DemoAIProvider } from '@/lib/ai/demo-provider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuestRequest;

    // Validate basic input parameters
    const durationMinutes = Number(body.durationMinutes) || 30;
    const adventureType = body.adventureType || 'nature';
    const difficulty = body.difficulty || 'moderate';

    const providerType = (
      body.providerOverride ||
      process.env.AI_PROVIDER ||
      'demo'
    ).toLowerCase().trim();

    if (providerType === 'demo') {
      const demoProvider = new DemoAIProvider();
      const quest = await demoProvider.generateQuest({
        durationMinutes,
        adventureType,
        difficulty,
        userLevel: body.userLevel,
        environmentHint: body.environmentHint,
      });
      return NextResponse.json(quest, { status: 200 });
    }

    // Gemma Open-Weight Model Provider
    const apiUrl = process.env.AI_API_URL || 'http://localhost:11434';
    const apiKey = process.env.AI_API_KEY;
    const modelName = process.env.AI_MODEL || 'gemma3:4b';

    const gemmaProvider = new GemmaAIProvider(apiUrl, apiKey, modelName);
    const quest = await gemmaProvider.generateQuestDirect({
      durationMinutes,
      adventureType,
      difficulty,
      userLevel: body.userLevel,
      environmentHint: body.environmentHint,
    });

    return NextResponse.json(quest, { status: 200 });
  } catch (err: unknown) {
    console.error('[API /api/ai/quest] Error generating quest:', err);
    const message = err instanceof Error ? err.message : 'Unknown error during quest generation';

    const status = message.includes('not reachable') || message.includes('timed out')
      ? 503
      : message.includes('not found')
      ? 404
      : 500;

    return NextResponse.json(
      {
        error: message,
        provider: process.env.AI_PROVIDER || 'gemma',
      },
      { status }
    );
  }
}
