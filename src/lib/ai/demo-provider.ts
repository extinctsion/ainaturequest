import { AIProvider } from './provider';
import { Quest, QuestRequest, EvidenceRequest, EvidenceResult } from '../types/quest';
import { validateQuest, validateEvidenceResult } from './validation';

export const DEMO_QUEST_DATABASE: Quest[] = [
  {
    id: 'hidden-naturalist-30',
    title: 'The Hidden Naturalist',
    subtitle: 'Micro-Ecosystem Observation',
    description: 'Explore your surroundings and notice what you normally walk past. Train your senses to uncover subtle animal signs, diverse flora, and ambient wilderness acoustic signatures.',
    durationMinutes: 30,
    difficulty: 3,
    difficultyLabel: 'moderate',
    category: 'nature',
    totalXp: 250,
    phoneAwayMinutes: 28,
    safetyTip: 'Stay on marked public paths and avoid touching unfamiliar thorny or stinging flora.',
    objectives: [
      {
        id: 'hn-1',
        title: 'Leaf Detective',
        description: 'Find three visibly different leaf shapes (e.g. palmate, needle-like, serrated, or ovate).',
        evidenceType: 'photo',
        xp: 60,
        hint: 'Look both at tree canopies and low ground cover or shrubs.'
      },
      {
        id: 'hn-2',
        title: 'Animal Traces',
        description: 'Find evidence that an animal has been nearby (tracks, cracked acorn shells, feathers, or a burrow).',
        evidenceType: 'photo',
        xp: 70,
        hint: 'Inspect soft soil, tree bases, or the undersides of low branches.'
      },
      {
        id: 'hn-3',
        title: 'Wild Acoustics',
        description: 'Spend 60 seconds listening quietly to natural sounds. Record or describe the most distinct tone.',
        evidenceType: 'audio',
        xp: 55,
        hint: 'Close your eyes for one minute to sharpen your auditory focus.'
      },
      {
        id: 'hn-4',
        title: 'Hidden Discovery',
        description: "Find something natural you've never consciously noticed before in this location.",
        evidenceType: 'text',
        xp: 65,
        hint: 'Look closely at bark textures, lichen colonies, or stone crevices.'
      }
    ]
  },
  {
    id: 'five-minute-explorer-15',
    title: 'Five-Minute Explorer',
    subtitle: 'Rapid Outdoor Awakening',
    description: 'A quick reset to awaken your senses right outside your door. Step into the open air and discover subtle details right under your feet.',
    durationMinutes: 15,
    difficulty: 1,
    difficultyLabel: 'easy',
    category: 'mindfulness',
    totalXp: 120,
    phoneAwayMinutes: 13,
    safetyTip: 'Maintain spatial awareness while observing ground details near walkways.',
    objectives: [
      {
        id: 'fme-1',
        title: 'Vibrant Green',
        description: 'Find something vivid green that catches the daylight.',
        evidenceType: 'photo',
        xp: 30,
        hint: 'Moss, fresh grass shoots, or evergreen foliage.'
      },
      {
        id: 'fme-2',
        title: 'Kinetic Movement',
        description: 'Find something in nature that moves without being an animal (flowing water, swaying branches, drifting seed).',
        evidenceType: 'text',
        xp: 30,
        hint: 'Observe how wind or gravity interacts with foliage and water.'
      },
      {
        id: 'fme-3',
        title: 'Natural Pattern',
        description: 'Find a natural repeating pattern (veins on a leaf, concentric rings, spiral pinecones, or bark ribs).',
        evidenceType: 'photo',
        xp: 30,
        hint: 'Geometry in nature often follows fractal or radial symmetries.'
      },
      {
        id: 'fme-4',
        title: 'Overlooked Wonder',
        description: "Notice a natural feature you've walked past many times without looking.",
        evidenceType: 'text',
        xp: 30,
        hint: 'An old tree knot, a flowering weed in a path crack, or a weathered stone.'
      }
    ]
  },
  {
    id: 'urban-naturalist-45',
    title: 'Urban Naturalist',
    subtitle: 'Wildlife & Ecology in the Built Environment',
    description: 'Explore the fascinating boundary where nature thrives alongside human architecture. Discover resilient organisms and ecosystem interactions.',
    durationMinutes: 45,
    difficulty: 4,
    difficultyLabel: 'challenging',
    category: 'exploration',
    totalXp: 350,
    phoneAwayMinutes: 42,
    safetyTip: 'Watch for road crossings and cyclists when exploring city parks or green corridors.',
    objectives: [
      {
        id: 'un-1',
        title: 'Flora Diversity',
        description: 'Find and document two completely different plant species growing within 10 meters of each other.',
        evidenceType: 'photo',
        xp: 90,
        hint: 'Compare a flowering dicot with a hardy ornamental shrub or fern.'
      },
      {
        id: 'un-2',
        title: 'Insect Microhabitat',
        description: 'Find evidence of insect life (an ant highway, a silk web, galls on leaves, or pollinator visits).',
        evidenceType: 'photo',
        xp: 90,
        hint: 'Look on flowering blossoms, sunny rock faces, or fallen logs.'
      },
      {
        id: 'un-3',
        title: 'Soundscape Mapping',
        description: 'Isolate a purely natural sound amidst ambient urban background hum. Record or describe it.',
        evidenceType: 'audio',
        xp: 80,
        hint: 'Listen for high-pitched bird calls, wind whistling through conifers, or trickling drain water.'
      },
      {
        id: 'un-4',
        title: 'Symbiosis & Relationships',
        description: 'Find a clear relationship between two living things (lichen on tree bark, bee on flower, vine climbing a trunk).',
        evidenceType: 'text',
        xp: 90,
        hint: 'Look for mutualism, commensalism, or natural shelter usage.'
      }
    ]
  },
  {
    id: 'canopy-shadows-60',
    title: 'The Forest Senses Quest',
    subtitle: 'Deep Immersion & Sensory Mapping',
    description: 'An extended immersion journey. Step away from digital stimulation, synchronize with natural rhythms, and record subtle seasonal milestones.',
    durationMinutes: 60,
    difficulty: 5,
    difficultyLabel: 'challenging',
    category: 'wildlife',
    totalXp: 450,
    phoneAwayMinutes: 55,
    safetyTip: 'Pack water, wear suitable footwear, and respect wildlife by keeping quiet distance.',
    objectives: [
      {
        id: 'fsq-1',
        title: 'Avian Activity',
        description: 'Spot a bird or discover an active avian feeding ground / nesting zone.',
        evidenceType: 'photo',
        xp: 120,
        hint: 'Look into upper tree crowns or listen for territorial chirps.'
      },
      {
        id: 'fsq-2',
        title: 'Texture Spectrum',
        description: 'Find and compare three distinct botanical textures (velvet moss, rough bark, slick wet stone).',
        evidenceType: 'photo',
        xp: 110,
        hint: 'Gently feel the surface with your fingertips before photographing.'
      },
      {
        id: 'fsq-3',
        title: 'Acoustic Solitude',
        description: 'Capture 30-60 seconds of wilderness audio far from street noise.',
        evidenceType: 'audio',
        xp: 100,
        hint: 'Find a secluded grove or quiet park glade.'
      },
      {
        id: 'fsq-4',
        title: 'Seasonal Indicator',
        description: 'Document a clear indicator of the current season (new bud, fallen seedpod, autumn hue, or winter dormancy).',
        evidenceType: 'text',
        xp: 120,
        hint: 'Observe how trees and shrubs are adapting to current temperature and daylight.'
      }
    ]
  },
  {
    id: 'shutter-botanist-30',
    title: 'Macro Lens Explorer',
    subtitle: 'Visual Composition & Nature Patterns',
    description: 'Frame the natural world with an artistic eye. Focus on lighting, geometry, and micro-compositions in foliage.',
    durationMinutes: 30,
    difficulty: 3,
    difficultyLabel: 'moderate',
    category: 'photography',
    totalXp: 260,
    phoneAwayMinutes: 28,
    safetyTip: 'Ensure your footing is secure when leaning in for macro angles.',
    objectives: [
      {
        id: 'mle-1',
        title: 'Dappled Sunlight',
        description: 'Photograph natural light filtering through leaves or morning dew.',
        evidenceType: 'photo',
        xp: 65,
        hint: 'Position yourself with sunlight backlighting translucent foliage.'
      },
      {
        id: 'mle-2',
        title: 'Geometric Symmetry',
        description: 'Capture a plant or natural structure showing near-perfect radial or bilateral symmetry.',
        evidenceType: 'photo',
        xp: 70,
        hint: 'Succulents, fern fronds, or seed heads provide great geometry.'
      },
      {
        id: 'mle-3',
        title: 'Micro Habitat Portrait',
        description: 'Photograph a tiny world inside a patch of moss, bark knot, or puddle.',
        evidenceType: 'photo',
        xp: 65,
        hint: 'Get within inches of the subject to highlight the miniature scale.'
      },
      {
        id: 'mle-4',
        title: 'Field Notes Composition',
        description: 'Describe the prevailing weather and how it alters the colors of the landscape right now.',
        evidenceType: 'text',
        xp: 60,
        hint: 'Notice overcast diffusion vs high-contrast direct sunlight.'
      }
    ]
  },
  {
    id: 'mindful-strides-15',
    title: 'Grounding & Breath Walk',
    subtitle: 'Mindful Nature Presence',
    description: 'Slow your pace, engage all non-visual senses, and experience the calming power of natural presence.',
    durationMinutes: 15,
    difficulty: 1,
    difficultyLabel: 'easy',
    category: 'mindfulness',
    totalXp: 130,
    phoneAwayMinutes: 14,
    safetyTip: 'Walk at an easy, deliberate pace on even ground.',
    objectives: [
      {
        id: 'mbw-1',
        title: 'Scent of the Earth',
        description: 'Find and describe a distinct natural aroma (crushed pine needles, damp soil/petrichor, or blossom perfume).',
        evidenceType: 'text',
        xp: 40,
        hint: 'Kneel near damp mulch or rub a fallen needle gently between fingers.'
      },
      {
        id: 'mbw-2',
        title: 'Tactile Grounding',
        description: 'Touch the bark of a mature tree and describe its physical temperature, texture, and resilience.',
        evidenceType: 'text',
        xp: 45,
        hint: 'Compare shaded northern bark with sun-warmed southern bark.'
      },
      {
        id: 'mbw-3',
        title: 'The Sky Canopy',
        description: 'Look straight up into the sky/canopy and take a photo of where branches meet the sky.',
        evidenceType: 'photo',
        xp: 45,
        hint: 'Crown shyness between neighboring trees creates striking silhouettes.'
      }
    ]
  }
];

export class DemoAIProvider implements AIProvider {
  public name = 'Demo AI (Deterministic Open-Source Mode)';
  public isDeterministic = true;

  async generateQuest(input: QuestRequest): Promise<Quest> {
    // Simulate brief processing delay for realistic UX feeling
    await new Promise((resolve) => setTimeout(resolve, 800));

    const targetMinutes = input.durationMinutes || 30;
    const targetCategory = (input.adventureType || 'nature').toLowerCase();
    const targetDifficulty = (input.difficulty || 'moderate').toLowerCase();

    // Deterministic selection algorithm
    // 1. Direct category + duration match
    let match = DEMO_QUEST_DATABASE.find(
      (q) =>
        q.category === targetCategory &&
        Math.abs(q.durationMinutes - targetMinutes) <= 15
    );

    // 2. Duration and difficulty match
    if (!match) {
      match = DEMO_QUEST_DATABASE.find(
        (q) =>
          Math.abs(q.durationMinutes - targetMinutes) <= 15 &&
          q.difficultyLabel === targetDifficulty
      );
    }

    // 3. Fallback to closest duration
    if (!match) {
      match = [...DEMO_QUEST_DATABASE].sort(
        (a, b) =>
          Math.abs(a.durationMinutes - targetMinutes) -
          Math.abs(b.durationMinutes - targetMinutes)
      )[0];
    }

    const selectedQuest = match || DEMO_QUEST_DATABASE[0];

    // Clone quest and adjust slightly if user asked for specific time
    const adjustedQuest: Quest = {
      ...selectedQuest,
      durationMinutes: targetMinutes,
      phoneAwayMinutes: Math.max(5, targetMinutes - 2),
    };

    return validateQuest(adjustedQuest);
  }

  async evaluateEvidence(input: EvidenceRequest): Promise<EvidenceResult> {
    // Simulate brief AI inference analysis
    await new Promise((resolve) => setTimeout(resolve, 900));

    const { objective, evidence } = input;
    const textData = (evidence.data || '').toLowerCase();
    const noteText = (evidence.note || '').toLowerCase();
    const combinedText = `${textData} ${noteText}`;

    // Deterministic, rich naturalist evaluations based on objective context
    let feedback = '';
    let confidence = 0.91;
    let insight = '';
    let completed = true;

    if (objective.evidenceType === 'photo') {
      if (objective.title.toLowerCase().includes('leaf') || objective.description.toLowerCase().includes('leaf')) {
        feedback = '✓ Evidence verified. The submitted photo shows clear structural leaf diversity with distinct venation and margin geometry.';
        confidence = 0.94;
        insight = 'Botany note: Leaf morphology differences reflect adaptation to light exposure, transpiration rates, and wind resistance.';
      } else if (objective.title.toLowerCase().includes('animal') || objective.description.toLowerCase().includes('animal')) {
        feedback = '✓ Evidence verified. Your observation captures genuine physical traces of animal presence and activity.';
        confidence = 0.88;
        insight = 'Tracking note: Animal foraging trails and markings provide valuable indicators of local micro-habitat health.';
      } else if (objective.title.toLowerCase().includes('pattern') || objective.description.toLowerCase().includes('pattern')) {
        feedback = '✓ Evidence verified. Strong natural geometric repetition detected in organic structures.';
        confidence = 0.92;
        insight = 'Naturalist note: Biological patterns like Fibonacci spirals optimize spatial packing for sunlight and seed dispersal.';
      } else if (objective.title.toLowerCase().includes('green')) {
        feedback = '✓ Evidence verified. High chlorophyll vibrance observed in natural plant specimen.';
        confidence = 0.96;
        insight = 'Chlorophyll absorption peaks in blue and red wavelengths, reflecting the lush green spectrum you observed.';
      } else {
        feedback = '✓ Evidence verified. High-clarity visual documentation captured matching quest criteria.';
        confidence = 0.90;
        insight = 'Visual documentation creates high-fidelity records for your personal nature log.';
      }
    } else if (objective.evidenceType === 'audio') {
      feedback = '✓ Acoustic recording received. Distinct ambient sound frequencies isolated from background disturbance.';
      confidence = 0.89;
      insight = 'Acoustic ecology note: Natural bio-phony (bird calls, wind) has measurable restorative effects on human attention.';
    } else {
      // Text observation
      if (combinedText.length > 5) {
        feedback = `✓ Observation logged. "${evidence.data.slice(0, 45)}..." recorded with thoughtful field perception.`;
        confidence = 0.93;
        insight = 'Mindful observation trains attentional acuity and deepens environmental connectedness.';
      } else {
        feedback = '✓ Concise observation recorded in your field journal.';
        confidence = 0.85;
        insight = 'Even brief natural reflections reinforce sensory awareness.';
      }
    }

    const result: EvidenceResult = {
      objectiveId: objective.id,
      completed,
      confidence,
      feedback,
      xpAwarded: objective.xp || 50,
      naturalistInsight: insight,
    };

    return validateEvidenceResult(result, objective.id);
  }
}
