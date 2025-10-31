'use client';

import React from 'react';
import { getAgnoPayConfig } from '../config';
import type { IframeStyleConfig } from '../types';

export interface AgnoPayCheckoutProps {
  orderId: string;
  walletUrl?: string; // Override default wallet URL
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
 *   orderId={order.id}
 *   walletUrl="https://wallet.agnopay.com" // Optional override
 *   onSuccess={() => router.push('/success')}
 *   style={{ primaryColor: '#10b981' }}
 * />
 * ```
 */
export function AgnoPayCheckout({
  orderId,
  walletUrl,
  onSuccess,
  onError,
  className,
  title = 'Complete Your Purchase',
  style,
  hideHeader = false,
}: AgnoPayCheckoutProps) {
  const config = getAgnoPayConfig();
  const effectiveWalletUrl = walletUrl || config.walletUrl;

  // Build iframe URL with style parameters
  const iframeUrl = React.useMemo(() => {
    const url = new URL(`${effectiveWalletUrl}/orders/${orderId}`);

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
  }, [effectiveWalletUrl, orderId, style]);

  // Listen for messages from the iframe (for payment status updates)
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the wallet URL
      if (!event.origin.startsWith(effectiveWalletUrl)) {
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
  }, [effectiveWalletUrl, orderId, onSuccess, onError]);

  // Apply transparent background if configured
  const containerClassName = React.useMemo(() => {
    if (className) return className;

    const baseClass = 'min-h-screen flex items-center justify-center p-4';
    const bgClass = style?.transparent ? 'bg-transparent' : 'bg-gray-50';

    return `${baseClass} ${bgClass}`;
  }, [className, style?.transparent]);

  const cardClassName = React.useMemo(() => {
    const baseClass = 'w-full max-w-4xl rounded-lg overflow-hidden';
    const bgClass = style?.transparent ? 'bg-transparent' : 'bg-white shadow-xl';

    return `${baseClass} ${bgClass}`;
  }, [style?.transparent]);

  return (
    <div className={containerClassName}>
      <div className={cardClassName}>
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
        <div className="relative w-full" style={{ height: hideHeader ? '100vh' : 'calc(100vh - 200px)' }}>
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title="AgnoPay Checkout"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="payment"
          />
        </div>
      </div>
    </div>
  );
}
