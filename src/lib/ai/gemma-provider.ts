import { AIProvider } from './provider';
import { Quest, QuestRequest, EvidenceRequest, EvidenceResult } from '../types/quest';

/**
 * GemmaAIProvider
 *
 * Architectural adapter for open-weight models like Google Gemma (via Ollama, vLLM, or custom inference endpoint).
 * Designed for seamless drop-in replacement when an inference endpoint is supplied in .env (AI_API_URL / AI_MODEL).
 */
export class GemmaAIProvider implements AIProvider {
  public name = 'Gemma Open-Weight AI Provider';
  public isDeterministic = false;

  private apiUrl?: string;
  private apiKey?: string;
  private modelName: string;

  constructor(apiUrl?: string, apiKey?: string, modelName: string = 'gemma-2-9b-it') {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async generateQuest(_input: QuestRequest): Promise<Quest> {
    if (!this.apiUrl) {
      throw new Error(
        'GemmaAIProvider Configuration Error: AI_API_URL is not configured. ' +
        'To use Gemma open-weight inference, set AI_PROVIDER=gemma, AI_API_URL, and AI_MODEL in .env. ' +
        'Otherwise, switch back to AI_PROVIDER=demo for out-of-the-box offline execution.'
      );
    }

    // Future inference call implementation hook:
    throw new Error(
      `GemmaAIProvider: Connecting to ${this.modelName} at ${this.apiUrl} is staged for open-weight integration. Please use Demo AI mode for the current evaluation build.`
    );
  }

  async evaluateEvidence(_input: EvidenceRequest): Promise<EvidenceResult> {
    if (!this.apiUrl) {
      throw new Error(
        'GemmaAIProvider Configuration Error: AI_API_URL is missing. Please configure your Gemma inference server or use Demo AI mode.'
      );
    }

    throw new Error(
      'GemmaAIProvider: Vision/multimodal evaluation endpoint is staged for open-weight integration.'
    );
  }
}
