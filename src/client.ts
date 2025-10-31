/**
 * AgnoPay SDK API Client
 */

import type {
  AgnoPayConfig,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoPayError,
} from './types';

// Hardcoded AgnoPay API URL
const AGNOPAY_API_URL = 'https://agnoapi.vercel.app';

export class AgnoPayClient {
  private config: AgnoPayConfig;

  constructor(config: AgnoPayConfig) {
    this.config = config;
  }

  /**
   * Create a new order
   */
  async createOrder(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    try {
      const response = await fetch(`${AGNOPAY_API_URL}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: AgnoPayError = {
          message: data.error?.message || 'Failed to create order',
          code: data.error?.code,
          details: data.error,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if ((error as AgnoPayError).message) {
        throw error;
      }
      throw {
        message: 'Network error while creating order',
        details: error,
      } as AgnoPayError;
    }
  }
}
