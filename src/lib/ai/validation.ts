import { Quest, QuestObjective, EvidenceResult } from '../types/quest';

export class AIValidationError extends Error {
  constructor(message: string) {
    super(`AI Validation Error: ${message}`);
    this.name = 'AIValidationError';
  }
}

/**
 * Validates a Quest object returned from any AI Provider
 */
export function validateQuest(data: unknown): Quest {
  if (!data || typeof data !== 'object') {
    throw new AIValidationError('Quest response must be an object');
  }

  const q = data as Partial<Quest>;

  if (!q.id || typeof q.id !== 'string') {
    throw new AIValidationError('Quest must have a valid string id');
  }
  if (!q.title || typeof q.title !== 'string') {
    throw new AIValidationError('Quest must have a valid title');
  }
  if (!q.description || typeof q.description !== 'string') {
    throw new AIValidationError('Quest must have a valid description');
  }
  if (typeof q.durationMinutes !== 'number' || q.durationMinutes <= 0) {
    throw new AIValidationError('Quest durationMinutes must be a positive number');
  }
  if (!Array.isArray(q.objectives) || q.objectives.length === 0) {
    throw new AIValidationError('Quest must have at least one objective');
  }

  // Validate each objective
  const validatedObjectives: QuestObjective[] = q.objectives.map((obj, index) => {
    if (!obj || typeof obj !== 'object') {
      throw new AIValidationError(`Objective at index ${index} is invalid`);
    }
    const o = obj as Partial<QuestObjective>;
    if (!o.id || typeof o.id !== 'string') {
      throw new AIValidationError(`Objective at index ${index} missing valid id`);
    }
    if (!o.title || typeof o.title !== 'string') {
      throw new AIValidationError(`Objective at index ${index} missing valid title`);
    }
    if (!o.description || typeof o.description !== 'string') {
      throw new AIValidationError(`Objective at index ${index} missing valid description`);
    }
    const evidenceType = o.evidenceType || 'any';
    if (!['photo', 'audio', 'text', 'any'].includes(evidenceType)) {
      throw new AIValidationError(`Objective "${o.title}" has unsupported evidence type: ${evidenceType}`);
    }

    return {
      id: o.id,
      title: o.title,
      description: o.description,
      evidenceType: evidenceType as QuestObjective['evidenceType'],
      xp: typeof o.xp === 'number' && o.xp > 0 ? o.xp : 50,
      hint: o.hint || undefined,
      promptGuidance: o.promptGuidance || undefined,
    };
  });

  const totalXp = q.totalXp && typeof q.totalXp === 'number'
    ? q.totalXp
    : validatedObjectives.reduce((sum, obj) => sum + obj.xp, 0);

  return {
    id: q.id,
    title: q.title,
    subtitle: q.subtitle || 'Outdoor Naturalist Mission',
    description: q.description,
    durationMinutes: q.durationMinutes,
    difficulty: typeof q.difficulty === 'number' ? Math.min(5, Math.max(1, q.difficulty)) : 3,
    difficultyLabel: q.difficultyLabel || 'moderate',
    category: q.category || 'nature',
    objectives: validatedObjectives,
    totalXp,
    phoneAwayMinutes: typeof q.phoneAwayMinutes === 'number' ? q.phoneAwayMinutes : Math.max(5, q.durationMinutes - 2),
    safetyTip: q.safetyTip || 'Stay on safe paths, respect wildlife, and do not ingest wild plants.',
  };
}

/**
 * Validates an EvidenceResult object returned from any AI Provider
 */
export function validateEvidenceResult(data: unknown, fallbackObjectiveId: string): EvidenceResult {
  if (!data || typeof data !== 'object') {
    throw new AIValidationError('Evidence result must be an object');
  }

  const res = data as Partial<EvidenceResult>;

  return {
    objectiveId: res.objectiveId || fallbackObjectiveId,
    completed: typeof res.completed === 'boolean' ? res.completed : true,
    confidence: typeof res.confidence === 'number' ? Math.min(1, Math.max(0, res.confidence)) : 0.90,
    feedback: res.feedback || 'Observation confirmed and logged to your field log.',
    xpAwarded: typeof res.xpAwarded === 'number' ? res.xpAwarded : 50,
    naturalistInsight: res.naturalistInsight || 'Great field observation technique!',
  };
}
