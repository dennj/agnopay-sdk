'use client';

import React from 'react';
import type { IframeStyleConfig } from '../types';

// Hardcoded AgnoPay Wallet URL (immutable)
const AGNOPAY_WALLET_URL = 'https://agnowallet.vercel.app';

export interface AgnoPayCheckoutProps {
  orderId: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  title?: string;
  style?: IframeStyleConfig;
  hideHeader?: boolean;
}

/**
 * AgnoPay Checkout Component
 * Displays the wallet checkout page in an iframe
 *
 * @example
 * ```typescript
 * <AgnoPayCheckout
 *   orderId={order.uuid}
 *   onSuccess={() => router.push('/success')}
 *   style={{ primaryColor: '#10b981' }}
 * />
 * ```
 */
export function AgnoPayCheckout({
  orderId,
  onSuccess,
  onError,
  className,
  title = 'Complete Your Purchase',
  style,
  hideHeader = false,
}: AgnoPayCheckoutProps) {

  // Build iframe URL with style parameters
  const iframeUrl = React.useMemo(() => {
    const url = new URL(`${AGNOPAY_WALLET_URL}/orders/${orderId}`);

    if (style) {
      if (style.transparent !== undefined) {
        url.searchParams.set('transparent', String(style.transparent));
      }
      if (style.primaryColor) {
        url.searchParams.set('primaryColor', style.primaryColor);
      }
      if (style.backgroundColor) {
        url.searchParams.set('backgroundColor', style.backgroundColor);
      }
      if (style.textColor) {
        url.searchParams.set('textColor', style.textColor);
      }
      if (style.borderRadius) {
        url.searchParams.set('borderRadius', style.borderRadius);
      }
      if (style.fontFamily) {
        url.searchParams.set('fontFamily', style.fontFamily);
      }
    }

    return url.toString();
  }, [orderId, style]);

  // Listen for messages from the iframe (for payment status updates)
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the wallet URL
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

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [orderId, onSuccess, onError]);

  // Apply transparent background if configured
  const containerClassName = React.useMemo(() => {
    if (className) return className;
    return style?.transparent ? 'bg-transparent' : 'bg-gray-50';
  }, [className, style?.transparent]);

  return (
    <div className={containerClassName}>
      {!hideHeader && title && (
        <div
          className="p-4"
          style={{
            background: style?.primaryColor
              ? style.primaryColor
              : 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))',
          }}
        >
          <h1
            className="text-2xl font-bold text-center"
            style={{
              color: style?.textColor || 'white',
              fontFamily: style?.fontFamily,
            }}
          >
            {title}
          </h1>
        </div>
      )}
      <div className="relative w-full" style={{ height: hideHeader ? '100vh' : 'calc(100vh - 80px)' }}>
        <iframe
          src={iframeUrl}
          className="w-full h-full border-0"
          title="AgnoPay Checkout"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="payment"
        />
      </div>
    </div>
  );
}
