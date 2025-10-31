/**
 * AgnoPay SDK Client-side Hooks
 * React hooks for client-side order creation
 */

'use client';

import { useState } from 'react';
import { getAgnoPayConfig } from './config';
import type { CreateOrderRequest, CreateOrderResponse, AgnoPayError } from './types';

export interface UseAgnoPayCheckoutOptions {
  publishableKey?: string; // Public API key (safe to expose)
  apiUrl?: string; // Override default API URL
  onSuccess?: (order: CreateOrderResponse) => void;
  onError?: (error: AgnoPayError) => void;
}

export interface UseAgnoPayCheckoutReturn {
  createOrder: (request: CreateOrderRequest) => Promise<CreateOrderResponse | null>;
  isLoading: boolean;
  error: AgnoPayError | null;
  order: CreateOrderResponse | null;
}

/**
 * React hook for creating orders directly from the client
 * Uses publishable key (safe to expose in client-side code)
 *
 * @example
 * ```typescript
 * const { createOrder, isLoading } = useAgnoPayCheckout({
 *   publishableKey: 'ak_...',
 *   apiUrl: 'https://api.agnopay.com', // Optional override
 *   onSuccess: (order) => console.log('Created:', order.id)
 * });
 * ```
 */
export function useAgnoPayCheckout(
  options: UseAgnoPayCheckoutOptions = {}
): UseAgnoPayCheckoutReturn {
  const config = getAgnoPayConfig();
  const {
    publishableKey = process.env.NEXT_PUBLIC_AGNOPAY_KEY,
    apiUrl = config.apiUrl,
    onSuccess,
    onError
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AgnoPayError | null>(null);
  const [order, setOrder] = useState<CreateOrderResponse | null>(null);

  const createOrder = async (
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse | null> => {
    if (!publishableKey) {
      const err: AgnoPayError = {
        message: 'AgnoPay publishable key is required. Set NEXT_PUBLIC_AGNOPAY_KEY or pass publishableKey option.',
        code: 'MISSING_KEY',
      };
      setError(err);
      onError?.(err);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publishableKey}`,
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        const err: AgnoPayError = {
          message: data.error?.message || 'Failed to create order',
          code: data.error?.code,
          details: data.error,
        };
        setError(err);
        onError?.(err);
        return null;
      }

      setOrder(data);
      onSuccess?.(data);
      return data;
    } catch (err) {
      const error: AgnoPayError = {
        message: 'Network error while creating order',
        details: err,
      };
      setError(error);
      onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    isLoading,
    error,
    order,
  };
}
