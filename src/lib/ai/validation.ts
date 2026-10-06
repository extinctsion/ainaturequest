import { Quest, QuestObjective, EvidenceResult, AdventureType, DifficultyLevel } from '../types/quest';

export class AIValidationError extends Error {
  constructor(message: string) {
    super(`AI Validation Error: ${message}`);
    this.name = 'AIValidationError';
  }
}

/**
 * Extracts and parses JSON from raw LLM text output.
 * Handles markdown code blocks, conversational preambles, and raw JSON strings.
 */
export function extractJsonFromModelOutput<T = unknown>(rawOutput: string): T {
  if (!rawOutput || typeof rawOutput !== 'string') {
    throw new AIValidationError('Empty or non-string response received from AI model');
  }

  const trimmed = rawOutput.trim();

  // 1. Try direct JSON parse first
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Continue to pattern extraction
  }

  // 2. Try markdown code block regex (```json ... ``` or ``` ... ```)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      // Continue to bracket matching
    }
  }

  // 3. Find outermost JSON object or array ({ ... } or [ ... ])
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // Failed to parse substring
    }
  }

  throw new AIValidationError(
    `Failed to extract valid JSON from model output: ${trimmed.slice(0, 120)}...`
  );
}

/**
 * Validates a Quest object returned from any AI Provider.
 * Normalizes missing IDs, difficulty bounds, and phone-away times.
 */
export function validateQuest(data: unknown, defaultMetadata?: Quest['aiMetadata']): Quest {
  if (!data || typeof data !== 'object') {
    throw new AIValidationError('Quest response must be an object');
  }

  const q = data as Partial<Quest>;

  const id = typeof q.id === 'string' && q.id.trim()
    ? q.id.trim()
    : `quest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  if (!q.title || typeof q.title !== 'string' || !q.title.trim()) {
    throw new AIValidationError('Quest must have a non-empty title');
  }
  if (!q.description || typeof q.description !== 'string' || !q.description.trim()) {
    throw new AIValidationError('Quest must have a non-empty description');
  }

  const durationMinutes = typeof q.durationMinutes === 'number' && q.durationMinutes > 0
    ? Math.round(q.durationMinutes)
    : 30;

  if (!Array.isArray(q.objectives) || q.objectives.length === 0) {
    throw new AIValidationError('Quest must have at least one objective');
  }

  // Validate each objective
  const validatedObjectives: QuestObjective[] = q.objectives.map((obj, index) => {
    if (!obj || typeof obj !== 'object') {
      throw new AIValidationError(`Objective at index ${index} is invalid`);
    }
    const o = obj as Partial<QuestObjective>;
    const objId = typeof o.id === 'string' && o.id.trim()
      ? o.id.trim()
      : `obj_${index + 1}_${Math.random().toString(36).substring(2, 6)}`;

    if (!o.title || typeof o.title !== 'string' || !o.title.trim()) {
      throw new AIValidationError(`Objective at index ${index} missing valid title`);
    }
    if (!o.description || typeof o.description !== 'string' || !o.description.trim()) {
      throw new AIValidationError(`Objective at index ${index} missing valid description`);
    }

    const rawEvidenceType = (o.evidenceType || 'any').toLowerCase().trim();
    const evidenceType = ['photo', 'audio', 'text', 'any'].includes(rawEvidenceType)
      ? (rawEvidenceType as QuestObjective['evidenceType'])
      : 'photo';

    return {
      id: objId,
      title: o.title.trim(),
      description: o.description.trim(),
      evidenceType,
      xp: typeof o.xp === 'number' && o.xp > 0 ? Math.round(o.xp) : 50,
      hint: typeof o.hint === 'string' && o.hint.trim() ? o.hint.trim() : undefined,
      promptGuidance: typeof o.promptGuidance === 'string' && o.promptGuidance.trim()
        ? o.promptGuidance.trim()
        : undefined,
    };
  });

  const totalXp = typeof q.totalXp === 'number' && q.totalXp > 0
    ? Math.round(q.totalXp)
    : validatedObjectives.reduce((sum, obj) => sum + obj.xp, 0);

  const rawDifficulty = typeof q.difficulty === 'number' ? q.difficulty : 3;
  const difficulty = Math.min(5, Math.max(1, Math.round(rawDifficulty)));

  let difficultyLabel: DifficultyLevel = 'moderate';
  if (difficulty <= 2) difficultyLabel = 'easy';
  else if (difficulty >= 4) difficultyLabel = 'challenging';

  const category = (typeof q.category === 'string' ? q.category.toLowerCase().trim() : 'nature') as AdventureType;

  const phoneAwayMinutes = typeof q.phoneAwayMinutes === 'number' && q.phoneAwayMinutes > 0
    ? Math.min(durationMinutes, Math.round(q.phoneAwayMinutes))
    : Math.max(5, durationMinutes - 3);

  return {
    id,
    title: q.title.trim(),
    subtitle: typeof q.subtitle === 'string' && q.subtitle.trim() ? q.subtitle.trim() : 'Field Naturalist Expedition',
    description: q.description.trim(),
    durationMinutes,
    difficulty,
    difficultyLabel: q.difficultyLabel || difficultyLabel,
    category,
    objectives: validatedObjectives,
    totalXp,
    phoneAwayMinutes,
    safetyTip: typeof q.safetyTip === 'string' && q.safetyTip.trim()
      ? q.safetyTip.trim()
      : 'Stay on safe/public paths, respect wildlife distance, and never touch or ingest unknown wild plants.',
    aiMetadata: q.aiMetadata || defaultMetadata,
  };
}

/**
 * Validates an EvidenceResult object returned from any AI Provider.
 * Calibrates confidence bounds and standardizes evaluation status.
 */
export function validateEvidenceResult(
  data: unknown,
  fallbackObjectiveId: string,
  modelName?: string
): EvidenceResult {
  if (!data || typeof data !== 'object') {
    throw new AIValidationError('Evidence result must be an object');
  }

  const res = data as Partial<EvidenceResult>;

  const completed = typeof res.completed === 'boolean' ? res.completed : true;

  // Clamp confidence between 0.0 and 1.0
  const rawConfidence = typeof res.confidence === 'number' ? res.confidence : 0.88;
  const confidence = Math.min(1, Math.max(0, parseFloat(rawConfidence.toFixed(2))));

  // Determine status (completed | incomplete | inconclusive)
  let status: 'completed' | 'incomplete' | 'inconclusive' = 'completed';
  if (res.status && ['completed', 'incomplete', 'inconclusive'].includes(res.status)) {
    status = res.status;
  } else if (!completed) {
    status = confidence < 0.4 ? 'inconclusive' : 'incomplete';
  }

  return {
    objectiveId: res.objectiveId || fallbackObjectiveId,
    completed: status === 'completed',
    confidence,
    status,
    feedback: typeof res.feedback === 'string' && res.feedback.trim()
      ? res.feedback.trim()
      : 'Observation successfully recorded and verified by AI Naturalist.',
    xpAwarded: typeof res.xpAwarded === 'number' && res.xpAwarded >= 0 ? Math.round(res.xpAwarded) : 50,
    naturalistInsight: typeof res.naturalistInsight === 'string' && res.naturalistInsight.trim()
      ? res.naturalistInsight.trim()
      : 'Great field observation technique!',
    model: modelName || res.model,
  };
}

