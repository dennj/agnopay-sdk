/**
 * Browser-specific entry point for AgnoPay SDK
 *
 * This bundle is designed for vanilla JavaScript usage via <script> tags.
 * It exposes all non-React functionality as a global `AgnoPay` variable.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@agnopay/sdk/dist/browser.js"></script>
 * <script>
 *   const client = new AgnoPay.AgnoPaySDK({
 *     apiKey: 'ak_your_publishable_key'
 *   });
 *
 *   client.createOrder({
 *     line_items: [{
 *       code: 'ITEM-001',
 *       description: 'Product',
 *       amount: 9900,
 *       quantity: 1
 *     }]
 *   }).then(order => {
 *     console.log('Order created:', order.uuid);
 *   });
 * </script>
 * ```
 */

// Export core client (renamed for clarity)
export { AgnoPayClient as AgnoPaySDK } from './client';

// Export vanilla JS checkout widget
export { createCheckout } from './checkout-widget';
export type { CreateCheckoutOptions, CheckoutWidget } from './checkout-widget';

// Export all types
export type {
  AgnoPayConfig,
  LineItem,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoPayError,
  IframeStyleConfig,
} from './types';
