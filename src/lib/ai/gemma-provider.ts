import { AIProvider } from './provider';
import {
  Quest,
  QuestRequest,
  EvidenceRequest,
  EvidenceResult,
  AIHealthStatus,
} from '../types/quest';
import { extractJsonFromModelOutput, validateQuest, validateEvidenceResult } from './validation';
import {
  GEMMA_QUEST_SYSTEM_PROMPT,
  buildQuestUserPrompt,
  GEMMA_EVIDENCE_SYSTEM_PROMPT,
  buildEvidenceUserPrompt,
} from './prompts';

export interface GemmaProviderConfig {
  apiUrl?: string;
  apiKey?: string;
  modelName?: string;
  timeoutMs?: number;
}

/**
 * GemmaAIProvider
 *
 * Full open-weight inference provider for Google Gemma 3 (via local Ollama or compatible HTTP inference endpoints).
 * When executed in the browser, routes through Next.js server-side API handlers (/api/ai/*) to protect secrets.
 * When executed server-side (in route handlers, tests, or Node scripts), communicates directly with the inference endpoint.
 */
export class GemmaAIProvider implements AIProvider {
  public name = 'Gemma 3 Open-Weight AI Provider';
  public isDeterministic = false;

  public apiUrl: string;
  public apiKey?: string;
  public modelName: string;
  public timeoutMs: number;

  constructor(
    apiUrl?: string,
    apiKey?: string,
    modelName?: string,
    timeoutMs: number = 45000
  ) {
    this.apiUrl = (
      apiUrl ||
      (typeof process !== 'undefined' ? process.env?.AI_API_URL : '') ||
      'http://localhost:11434'
    ).replace(/\/+$/, '');

    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env?.AI_API_KEY : undefined);
    this.modelName = modelName || (typeof process !== 'undefined' ? process.env?.AI_MODEL : '') || 'gemma3:4b';
    this.timeoutMs = timeoutMs;
  }

  /**
   * Generates a structured Quest using Gemma.
   */
  async generateQuest(input: QuestRequest): Promise<Quest> {
    // 1. Browser client environment -> Route through Next.js server API
    if (typeof window !== 'undefined') {
      return this.generateQuestViaApi(input);
    }

    // 2. Server-side environment -> Direct Ollama / Gemma endpoint call
    return this.generateQuestDirect(input);
  }

  /**
   * Evaluates outdoor evidence using Gemma (multimodal vision + text + acoustics).
   */
  async evaluateEvidence(input: EvidenceRequest): Promise<EvidenceResult> {
    // 1. Browser client environment -> Route through Next.js server API
    if (typeof window !== 'undefined') {
      return this.evaluateEvidenceViaApi(input);
    }

    // 2. Server-side environment -> Direct Ollama / Gemma endpoint call
    return this.evaluateEvidenceDirect(input);
  }

  /**
   * Server-side: Direct Ollama chat completion for quest generation
   */
  async generateQuestDirect(input: QuestRequest): Promise<Quest> {
    const userPrompt = buildQuestUserPrompt(input);

    const rawResponse = await this.callOllamaChat({
      messages: [
        { role: 'system', content: GEMMA_QUEST_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      format: 'json',
    });

    const parsed = extractJsonFromModelOutput<unknown>(rawResponse);
    return validateQuest(parsed, {
      provider: 'gemma',
      model: this.modelName,
      generatedAt: Date.now(),
    });
  }

  /**
   * Server-side: Direct Ollama chat completion for evidence evaluation
   */
  async evaluateEvidenceDirect(input: EvidenceRequest): Promise<EvidenceResult> {
    const { questId: _questId, objective, evidence } = input;
    const isImage = evidence.type === 'photo' || (typeof evidence.data === 'string' && evidence.data.startsWith('data:image'));

    const userNote = [
      evidence.note,
      evidence.type === 'text' ? evidence.data : undefined,
      evidence.type === 'audio' ? `[Acoustic observation recorded] ${evidence.note || evidence.data || ''}` : undefined,
    ]
      .filter(Boolean)
      .join(' | ');

    const images: string[] = [];
    if (isImage && evidence.data && evidence.data.startsWith('data:image')) {
      const base64Data = evidence.data.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
      if (base64Data.trim()) {
        images.push(base64Data.trim());
      }
    }

    const userPrompt = buildEvidenceUserPrompt(
      'Nature Expedition',
      objective.title,
      objective.description,
      objective.evidenceType,
      userNote,
      images.length > 0
    );

    const rawResponse = await this.callOllamaChat({
      messages: [
        { role: 'system', content: GEMMA_EVIDENCE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: userPrompt,
          images: images.length > 0 ? images : undefined,
        },
      ],
      temperature: 0.2,
      format: 'json',
    });

    const parsed = extractJsonFromModelOutput<unknown>(rawResponse);
    return validateEvidenceResult(parsed, objective.id, this.modelName);
  }

  /**
   * Health and connectivity check for Gemma / Ollama endpoint.
   */
  async checkHealth(): Promise<AIHealthStatus> {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const res = await fetch(`${this.apiUrl}/api/tags`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        return {
          ok: false,
          provider: 'gemma',
          model: this.modelName,
          endpoint: this.apiUrl,
          latencyMs,
          message: `Ollama endpoint returned HTTP ${res.status}: ${res.statusText}`,
        };
      }

      const data = await res.json() as { models?: Array<{ name?: string; model?: string }> };
      const availableModels = (data.models || []).map((m) => m.name || m.model || '').filter(Boolean);

      const targetModelLower = this.modelName.toLowerCase();
      const isModelInstalled = availableModels.some(
        (m) => m.toLowerCase() === targetModelLower || m.toLowerCase().startsWith(`${targetModelLower}:`)
      );

      if (!isModelInstalled) {
        return {
          ok: false,
          provider: 'gemma',
          model: this.modelName,
          endpoint: this.apiUrl,
          availableModels,
          latencyMs,
          message: `Gemma model "${this.modelName}" not found in Ollama. Run: ollama pull ${this.modelName}`,
        };
      }

      return {
        ok: true,
        provider: 'gemma',
        model: this.modelName,
        endpoint: this.apiUrl,
        availableModels,
        latencyMs,
        isMultimodal: this.modelName.toLowerCase().includes('gemma3') || this.modelName.toLowerCase().includes('vision'),
        message: `Successfully connected to Gemma (${this.modelName}) in ${latencyMs}ms.`,
      };
    } catch (err: unknown) {
      const latencyMs = Date.now() - startTime;
      const errorMsg = err instanceof Error ? err.message : String(err);

      if (errorMsg.includes('abort') || errorMsg.includes('timeout')) {
        return {
          ok: false,
          provider: 'gemma',
          model: this.modelName,
          endpoint: this.apiUrl,
          latencyMs,
          message: `Gemma endpoint at ${this.apiUrl} timed out. Ensure Ollama is running.`,
        };
      }

      return {
        ok: false,
        provider: 'gemma',
        model: this.modelName,
        endpoint: this.apiUrl,
        latencyMs,
        message: `Gemma isn't reachable at ${this.apiUrl}. Make sure Ollama is running (ollama serve) and "${this.modelName}" is installed.`,
      };
    }
  }

  /**
   * Transport helper to execute chat completion against Ollama /api/chat
   */
  private async callOllamaChat(params: {
    messages: Array<{ role: string; content: string; images?: string[] }>;
    temperature?: number;
    format?: 'json';
  }): Promise<string> {
    const endpoint = `${this.apiUrl}/api/chat`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.modelName,
          messages: params.messages,
          stream: false,
          format: params.format || 'json',
          options: {
            temperature: params.temperature ?? 0.4,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errDetails = '';
        try {
          const errJson = await response.json() as { error?: string };
          errDetails = errJson.error || '';
        } catch {
          errDetails = await response.text();
        }

        if (response.status === 404 || errDetails.includes('not found')) {
          throw new Error(
            `Gemma model not found: "${this.modelName}". Please run:\n  ollama pull ${this.modelName}`
          );
        }

        throw new Error(
          `Gemma inference failed (HTTP ${response.status}): ${errDetails || response.statusText}`
        );
      }

      const data = await response.json() as {
        message?: { content?: string };
        response?: string;
      };

      const content = data.message?.content || data.response;
      if (!content || typeof content !== 'string') {
        throw new Error('Gemma returned an empty response. Please try again.');
      }

      return content;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error) {
        if (err.name === 'AbortError' || err.message.includes('aborted')) {
          throw new Error(
            `Gemma took too long to respond (> ${Math.round(this.timeoutMs / 1000)}s). Ensure Ollama is running or switch to Demo AI.`
          );
        }
        if (err.message.includes('fetch failed') || err.message.includes('ECONNREFUSED')) {
          throw new Error(
            `Gemma isn't reachable at ${this.apiUrl}. Make sure Ollama is running (ollama serve) and ${this.modelName} is installed.`
          );
        }
        throw err;
      }
      throw new Error(`Unexpected error communicating with Gemma: ${String(err)}`);
    }
  }

  /**
   * Browser transport: calls /api/ai/quest
   */
  private async generateQuestViaApi(input: QuestRequest): Promise<Quest> {
    const res = await fetch('/api/ai/quest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(
        errData.error || `Failed to generate quest with Gemma (HTTP ${res.status})`
      );
    }

    const questData = await res.json();
    return validateQuest(questData);
  }

  /**
   * Browser transport: calls /api/ai/evidence
   */
  private async evaluateEvidenceViaApi(input: EvidenceRequest): Promise<EvidenceResult> {
    const res = await fetch('/api/ai/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(
        errData.error || `Failed to evaluate evidence with Gemma (HTTP ${res.status})`
      );
    }

    const resultData = await res.json();
    return validateEvidenceResult(resultData, input.objective.id, this.modelName);
  }
}
