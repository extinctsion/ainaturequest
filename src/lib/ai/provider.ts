import { Quest, QuestRequest, EvidenceRequest, EvidenceResult } from '../types/quest';

/**
 * AIProvider interface
 * Decouples the application logic from specific AI backends.
 * Allows easy swapping between deterministic DemoAIProvider and future
 * open-weight model providers (such as Gemma, Ollama, or custom endpoints).
 */
export interface AIProvider {
  name: string;
  isDeterministic: boolean;
  generateQuest(input: QuestRequest): Promise<Quest>;
  evaluateEvidence(input: EvidenceRequest): Promise<EvidenceResult>;
}
