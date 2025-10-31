/**
 * AgnoPay SDK Configuration
 */

export interface AgnoPaySDKConfig {
  apiUrl?: string;
  walletUrl?: string;
}

// Default configuration
const DEFAULT_CONFIG: Required<AgnoPaySDKConfig> = {
  apiUrl: 'https://agnoapi.vercel.app',
  walletUrl: 'http://localhost:3000',
};

// Global configuration (can be overridden)
let globalConfig: Required<AgnoPaySDKConfig> = { ...DEFAULT_CONFIG };

/**
 * Configure global AgnoPay SDK settings
 * Call this once at the start of your application
 *
 * @example
 * ```typescript
 * import { configureAgnoPay } from '@agnopay/sdk';
 *
 * configureAgnoPay({
 *   apiUrl: 'https://api.agnopay.com',
 *   walletUrl: 'https://wallet.agnopay.com'
 * });
 * ```
 */
export function configureAgnoPay(config: AgnoPaySDKConfig): void {
  globalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };
}

/**
 * Get current global configuration
 */
export function getAgnoPayConfig(): Required<AgnoPaySDKConfig> {
  return { ...globalConfig };
}

/**
 * Reset configuration to defaults
 */
export function resetAgnoPayConfig(): void {
  globalConfig = { ...DEFAULT_CONFIG };
}
