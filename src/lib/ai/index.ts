import { AIProvider } from './provider';
import { DemoAIProvider } from './demo-provider';
import { GemmaAIProvider } from './gemma-provider';
import { getSettings } from '../storage/settings';

let cachedProvider: AIProvider | null = null;
let currentProviderType: string = '';

/**
 * Returns the currently active provider type ('demo' | 'gemma' | 'custom').
 * Prioritizes runtime override, then browser localStorage settings, then environment variables.
 */
export function getActiveAIProviderType(overrideType?: string): 'demo' | 'gemma' | 'custom' {
  if (overrideType && overrideType.trim()) {
    return overrideType.toLowerCase().trim() as 'demo' | 'gemma' | 'custom';
  }

  if (typeof window !== 'undefined') {
    try {
      const settings = getSettings();
      if (settings?.aiProvider) {
        return settings.aiProvider;
      }
    } catch {
      // Fall through to env
    }
  }

  const envType = (
    process.env.NEXT_PUBLIC_AI_PROVIDER ||
    process.env.AI_PROVIDER ||
    'demo'
  ).toLowerCase().trim();

  return (envType === 'gemma' ? 'gemma' : 'demo') as 'demo' | 'gemma' | 'custom';
}

/**
 * Returns metadata about the currently active AI provider for transparent UI display.
 */
export function getActiveProviderInfo(overrideType?: string): {
  type: 'demo' | 'gemma' | 'custom';
  name: string;
  model: string;
  isDeterministic: boolean;
  isGemma: boolean;
} {
  const type = getActiveAIProviderType(overrideType);
  if (type === 'gemma') {
    const model = process.env.NEXT_PUBLIC_AI_MODEL || process.env.AI_MODEL || 'gemma3:4b';
    return {
      type: 'gemma',
      name: 'Google Gemma 3 (Open-Weight)',
      model: model,
      isDeterministic: false,
      isGemma: true,
    };
  }

  return {
    type: 'demo',
    name: 'Demo AI (Deterministic)',
    model: 'deterministic-nature-engine-v1',
    isDeterministic: true,
    isGemma: false,
  };
}

/**
 * Factory function to retrieve the configured AI Provider instance.
 */
export function getAIProvider(overrideType?: string): AIProvider {
  const providerType = getActiveAIProviderType(overrideType);

  if (cachedProvider && currentProviderType === providerType) {
    return cachedProvider;
  }

  currentProviderType = providerType;

  switch (providerType) {
    case 'demo':
      cachedProvider = new DemoAIProvider();
      break;

    case 'gemma':
      cachedProvider = new GemmaAIProvider(
        process.env.AI_API_URL,
        process.env.AI_API_KEY,
        process.env.AI_MODEL || 'gemma3:4b'
      );
      break;

    default:
      console.warn(`Unknown AI provider "${providerType}", using DemoAIProvider.`);
      cachedProvider = new DemoAIProvider();
      break;
  }

  return cachedProvider;
}

export * from './provider';
export * from './demo-provider';
export * from './gemma-provider';
export * from './validation';
export * from './prompts';
