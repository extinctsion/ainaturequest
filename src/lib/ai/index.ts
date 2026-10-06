import { AIProvider } from './provider';
import { DemoAIProvider } from './demo-provider';
import { GemmaAIProvider } from './gemma-provider';

let cachedProvider: AIProvider | null = null;
let currentProviderType: string = '';

/**
 * Factory function to retrieve the configured AI Provider instance.
 * Reads configuration from NEXT_PUBLIC_AI_PROVIDER, AI_PROVIDER, or runtime override.
 */
export function getAIProvider(overrideType?: string): AIProvider {
  const providerType = (
    overrideType ||
    process.env.NEXT_PUBLIC_AI_PROVIDER ||
    process.env.AI_PROVIDER ||
    'demo'
  ).toLowerCase().trim();

  if (cachedProvider && currentProviderType === providerType) {
    return cachedProvider;
  }

  currentProviderType = providerType;

  switch (providerType) {
    case 'demo':
    case 'local':
      cachedProvider = new DemoAIProvider();
      break;

    case 'gemma':
      cachedProvider = new GemmaAIProvider(
        process.env.AI_API_URL,
        process.env.AI_API_KEY,
        process.env.AI_MODEL || 'gemma-2-9b-it'
      );
      break;

    default:
      console.warn(`Unknown AI provider "${providerType}", falling back to DemoAIProvider.`);
      cachedProvider = new DemoAIProvider();
      break;
  }

  return cachedProvider;
}

export * from './provider';
export * from './demo-provider';
export * from './gemma-provider';
export * from './validation';
