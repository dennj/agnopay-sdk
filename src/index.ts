/**
 * AgnoPay SDK
 *
 * A TypeScript SDK for integrating AgnoPay payment processing into your application.
 * No API routes required - works entirely client-side with publishable keys (like Stripe).
 *
 * @example Basic Usage (No API Routes Needed!)
 * ```tsx
 * // 1. Set env: NEXT_PUBLIC_AGNOPAY_KEY="ak_your_key"
 *
 * // 2. Use the hook
 * import { useAgnoPayCheckout, AgnoPayCheckout } from '@/lib/agnopay-sdk';
 *
 * const { createOrder, isLoading } = useAgnoPayCheckout({
 *   onSuccess: (order) => router.push(`/checkout/${order.id}`)
 * });
 *
 * // 3. Create order (calls AgnoPay API directly)
 * await createOrder({
 *   line_items: [{ code: 'ITEM-001', description: 'Product', amount: 9900, quantity: 1 }]
 * });
 *
 * // 4. Display checkout with custom styling
 * <AgnoPayCheckout orderId={order.id} style={{ primaryColor: '#10b981' }} />
 * ```
 *
 * @example Advanced: Server-side (Optional)
 * ```ts
 * // Only if you need server-side order creation
 * import { createOrderRouteHandler } from '@/lib/agnopay-sdk/server';
 * export const POST = createOrderRouteHandler(process.env.AGNOPAY_SECRET_KEY || '');
 * ```
 */

// Core SDK
export { AgnoPayClient as AgnoPaySDK } from './client';

// Components
export { AgnoPayCheckout } from './components/AgnoPayCheckout';

// Client-side hooks
export { useAgnoPayCheckout } from './client-hooks';
export type { UseAgnoPayCheckoutOptions, UseAgnoPayCheckoutReturn } from './client-hooks';

// Types
export type {
  AgnoPayConfig,
  LineItem,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoPayError,
  IframeStyleConfig,
} from './types';
export type { AgnoPayCheckoutProps } from './components/AgnoPayCheckout';
