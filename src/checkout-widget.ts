/**
 * Vanilla JavaScript Checkout Widget
 * Creates an iframe-based checkout experience without React
 */

import type { IframeStyleConfig } from './types';

// Hardcoded AgnoPay Wallet URL (immutable)
const AGNOPAY_WALLET_URL = 'http://localhost:3000';

export interface CreateCheckoutOptions {
  /** Order ID to display checkout for */
  orderId: string;
  /** CSS selector or DOM element to render checkout into */
  container: string | HTMLElement;
  /** Optional title for checkout header (default: "Complete Your Purchase") */
  title?: string;
  /** Hide the checkout header */
  hideHeader?: boolean;
  /** Custom styling for the checkout */
  style?: IframeStyleConfig;
  /** Called when payment succeeds */
  onSuccess?: (orderId: string) => void;
  /** Called when payment fails */
  onError?: (error: Error) => void;
}

export interface CheckoutWidget {
  /** Remove the checkout widget from the DOM */
  destroy: () => void;
}

/**
 * Creates a vanilla JS checkout widget
 *
 * @example
 * ```javascript
 * import { createCheckout } from '@agnopay/sdk';
 *
 * const widget = createCheckout({
 *   orderId: 'order_123',
 *   container: '#checkout-container',
 *   style: {
 *     primaryColor: '#dc2626',
 *     textColor: '#ffffff'
 *   },
 *   onSuccess: (orderId) => {
 *     console.log('Payment successful!', orderId);
 *     window.location.href = '/success';
 *   },
 *   onError: (error) => {
 *     console.error('Payment failed:', error);
 *     alert('Payment failed: ' + error.message);
 *   }
 * });
 *
 * // Later, to remove the widget:
 * widget.destroy();
 * ```
 *
 * @example Browser CDN usage
 * ```html
 * <script src="https://unpkg.com/@agnopay/sdk/dist/browser.global.js"></script>
 * <script>
 *   const widget = AgnoPay.createCheckout({
 *     orderId: 'order_123',
 *     container: '#checkout-container',
 *     onSuccess: (orderId) => alert('Success!')
 *   });
 * </script>
 * ```
 */
export function createCheckout(options: CreateCheckoutOptions): CheckoutWidget {
  const {
    orderId,
    container,
    title = 'Complete Your Purchase',
    hideHeader = false,
    style,
    onSuccess,
    onError,
  } = options;

  // Get container element
  let containerEl: HTMLElement | null;
  if (typeof container === 'string') {
    containerEl = document.querySelector(container);
    if (!containerEl) {
      throw new Error(`Container element not found: ${container}`);
    }
  } else {
    containerEl = container;
  }

  // Build iframe URL with style parameters
  const iframeUrl = new URL(`${AGNOPAY_WALLET_URL}/orders/${orderId}`);

  if (style) {
    if (style.transparent !== undefined) {
      iframeUrl.searchParams.set('transparent', String(style.transparent));
    }
    if (style.primaryColor) {
      iframeUrl.searchParams.set('primaryColor', style.primaryColor);
    }
    if (style.backgroundColor) {
      iframeUrl.searchParams.set('backgroundColor', style.backgroundColor);
    }
    if (style.textColor) {
      iframeUrl.searchParams.set('textColor', style.textColor);
    }
    if (style.borderRadius) {
      iframeUrl.searchParams.set('borderRadius', style.borderRadius);
    }
    if (style.fontFamily) {
      iframeUrl.searchParams.set('fontFamily', style.fontFamily);
    }
  }

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.style.minHeight = '100vh';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.padding = '1rem';
  wrapper.style.backgroundColor = style?.transparent ? 'transparent' : '#f9fafb';

  // Create card
  const card = document.createElement('div');
  card.style.width = '100%';
  card.style.maxWidth = '1024px';
  card.style.borderRadius = '0.5rem';
  card.style.backgroundColor = style?.transparent ? 'transparent' : 'white';
  card.style.boxShadow = style?.transparent ? 'none' : '0 20px 25px -5px rgba(0,0,0,0.1)';
  card.style.overflow = 'hidden';

  // Create header (if not hidden)
  if (!hideHeader && title) {
    const header = document.createElement('div');
    header.style.padding = '1rem';
    header.style.background = style?.primaryColor || 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))';

    const titleEl = document.createElement('h1');
    titleEl.textContent = title;
    titleEl.style.fontSize = '1.5rem';
    titleEl.style.fontWeight = 'bold';
    titleEl.style.textAlign = 'center';
    titleEl.style.color = style?.textColor || 'white';
    titleEl.style.fontFamily = style?.fontFamily || 'system-ui, -apple-system, sans-serif';
    titleEl.style.margin = '0';

    header.appendChild(titleEl);
    card.appendChild(header);
  }

  // Create iframe container
  const iframeContainer = document.createElement('div');
  iframeContainer.style.position = 'relative';
  iframeContainer.style.width = '100%';
  iframeContainer.style.height = hideHeader ? '100vh' : 'calc(100vh - 200px)';
  iframeContainer.style.minHeight = '500px';

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl.toString();
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';
  iframe.title = 'AgnoPay Checkout';
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox');
  iframe.setAttribute('allow', 'payment');

  iframeContainer.appendChild(iframe);
  card.appendChild(iframeContainer);
  wrapper.appendChild(card);

  // Message handler for payment events
  const handleMessage = (event: MessageEvent) => {
    // Security check: verify origin
    if (!event.origin.startsWith(AGNOPAY_WALLET_URL)) {
      return;
    }

    try {
      const data = event.data;

      if (data.type === 'agnopay:payment:success') {
        onSuccess?.(orderId);
      } else if (data.type === 'agnopay:payment:error') {
        onError?.(new Error(data.error || 'Payment failed'));
      }
    } catch (error) {
      console.error('Error handling message from iframe:', error);
    }
  };

  // Add message listener
  window.addEventListener('message', handleMessage);

  // Append to container
  containerEl.appendChild(wrapper);

  // Return widget instance with destroy method
  return {
    destroy: () => {
      window.removeEventListener('message', handleMessage);
      containerEl?.removeChild(wrapper);
    },
  };
}
