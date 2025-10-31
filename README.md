# AgnoPay SDK

A TypeScript SDK for integrating AgnoPay payment processing into your application.

## Features

- 🔐 Client-side order creation with publishable keys
- 💳 2-step integration - no API routes required
- 🎨 Customizable checkout UI with full styling support
- 📦 TypeScript support with full type definitions
- ⚡ React hooks and components
- 🚀 Production-ready

## Installation

### npm / pnpm / yarn

```bash
npm install @agnopay/sdk
# or
pnpm add @agnopay/sdk
# or
yarn add @agnopay/sdk
```

### CDN (Vanilla JavaScript)

```html
<script src="https://unpkg.com/@agnopay/sdk@latest/dist/browser.global.js"></script>
```

## Quick Start (Vanilla JavaScript)

For vanilla JavaScript usage without any frameworks:

### Step 1: Include the Script

```html
<!DOCTYPE html>
<html>
<head>
  <title>AgnoPay Checkout</title>
</head>
<body>
  <button id="checkout-btn">Buy Now - $99.00</button>
  <div id="checkout-container"></div>

  <!-- Include AgnoPay SDK from CDN -->
  <script src="https://unpkg.com/@agnopay/sdk@latest/dist/browser.global.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

### Step 2: Create Orders (app.js)

```javascript
// SDK is available as window.AgnoPay
const client = new AgnoPay.AgnoPaySDK({
  apiKey: 'ak_your_publishable_key_here'
});

document.getElementById('checkout-btn').addEventListener('click', async () => {
  try {
    // Create order
    const order = await client.createOrder({
      line_items: [{
        code: 'ITEM-001',
        description: 'Premium Product',
        amount: 9900, // Amount in cents ($99.00)
        quantity: 1
      }]
    });

    console.log('Order created:', order.id);

    // Redirect to wallet checkout page
    window.location.href = `http://localhost:3000/order/${order.id}`;
  } catch (error) {
    console.error('Failed to create order:', error);
    alert('Checkout failed. Please try again.');
  }
});
```

That's it! 🎉 No build tools required!

## Quick Start (React/Next.js)

### Step 1: Set Your Publishable Key

Create a `.env.local` file:

```bash
NEXT_PUBLIC_AGNOPAY_KEY="ak_your_publishable_key_here"
```

### Step 2: Create Orders & Display Checkout

```typescript
'use client';

import { useAgnoPayCheckout } from '@agnopay/sdk';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const router = useRouter();
  const { createOrder, isLoading } = useAgnoPayCheckout({
    onSuccess: (order) => router.push(`/checkout/${order.id}`),
  });

  const handleCheckout = async () => {
    await createOrder({
      line_items: [{
        code: 'ITEM-001',
        description: 'Premium Product',
        amount: 9900, // Amount in cents
        quantity: 1
      }]
    });
  };

  return (
    <button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  );
}
```

### Step 3: Create Checkout Page

```typescript
'use client';

import { use } from 'react';
import { AgnoPayCheckout } from '@agnopay/sdk';
import { useRouter } from 'next/navigation';

export default function CheckoutPage({
  params
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = use(params);
  const router = useRouter();

  return (
    <AgnoPayCheckout
      orderId={orderId}
      onSuccess={() => router.push('/success')}
    />
  );
}
```

That's it! 🎉

## API Reference

### useAgnoPayCheckout

React hook for creating orders from the client.

```typescript
const { createOrder, isLoading, error, order } = useAgnoPayCheckout(options);
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `publishableKey` | `string?` | Public API key (auto-loads from `NEXT_PUBLIC_AGNOPAY_KEY`) |
| `onSuccess` | `(order) => void` | Called when order is successfully created |
| `onError` | `(error) => void` | Called when order creation fails |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `createOrder` | `(request) => Promise<Order \| null>` | Function to create a new order |
| `isLoading` | `boolean` | Loading state |
| `error` | `AgnoPayError \| null` | Error object if creation failed |
| `order` | `Order \| null` | Created order object |

#### Order Request

```typescript
interface CreateOrderRequest {
  line_items: LineItem[];
}

interface LineItem {
  code: string;        // Product code
  description: string; // Product description
  amount: number;      // Amount in cents (e.g., 9900 = $99.00)
  quantity: number;    // Quantity
}
```

### AgnoPayCheckout

Component that displays the checkout interface in an iframe.

```typescript
<AgnoPayCheckout
  orderId={order.id}
  onSuccess={(orderId) => router.push('/success')}
  style={{ primaryColor: '#10b981' }}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orderId` | `string` | - | **Required.** The order ID |
| `onSuccess` | `(orderId) => void` | - | Called when payment succeeds |
| `onError` | `(error) => void` | - | Called when payment fails |
| `title` | `string` | `"Complete Your Purchase"` | Checkout header title |
| `hideHeader` | `boolean` | `false` | Hide the header |
| `className` | `string` | - | Custom CSS class |
| `style` | `IframeStyleConfig` | - | Custom styling |

#### Styling

Customize the checkout appearance:

```typescript
interface IframeStyleConfig {
  transparent?: boolean;      // Transparent background
  primaryColor?: string;      // Primary color or gradient
  backgroundColor?: string;   // Background color
  textColor?: string;         // Text color
  borderRadius?: string;      // Border radius (e.g., "0.5rem")
  fontFamily?: string;        // Font family
}
```

## Examples

### Basic Usage

```typescript
const { createOrder, isLoading } = useAgnoPayCheckout({
  onSuccess: (order) => console.log('Order created:', order.id),
  onError: (error) => alert(error.message),
});

await createOrder({
  line_items: [{
    code: 'PROD-001',
    description: 'My Product',
    amount: 5000,
    quantity: 1
  }]
});
```

### Custom Styled Checkout

```typescript
<AgnoPayCheckout
  orderId={order.id}
  title="Secure Payment"
  style={{
    primaryColor: '#10b981',
    textColor: '#ffffff',
    borderRadius: '1rem',
    fontFamily: 'Inter, sans-serif',
  }}
  onSuccess={() => router.push('/thank-you')}
/>
```

### Gradient Header

```typescript
<AgnoPayCheckout
  orderId={order.id}
  style={{
    primaryColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
  }}
/>
```

### Transparent Overlay

```typescript
<AgnoPayCheckout
  orderId={order.id}
  hideHeader={true}
  style={{ transparent: true }}
  className="fixed inset-0 z-50"
/>
```

## TypeScript Types

All types are exported from the SDK:

```typescript
import type {
  AgnoPayConfig,
  LineItem,
  CreateOrderRequest,
  CreateOrderResponse,
  AgnoPayError,
  IframeStyleConfig,
  AgnoPayCheckoutProps,
  UseAgnoPayCheckoutOptions,
  UseAgnoPayCheckoutReturn,
} from '@/lib/agnopay-sdk';
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_AGNOPAY_KEY="ak_your_publishable_key"
```

**Security Note:** Publishable keys are safe to expose in client-side code. They can only create orders and cannot access sensitive operations.

## Error Handling

```typescript
const { createOrder, error } = useAgnoPayCheckout({
  onError: (error) => {
    console.error('Order creation failed:', error.message);
    // Handle error appropriately
  }
});

if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Complete Example

```typescript
'use client';

import { useAgnoPayCheckout, AgnoPayCheckout } from '@/lib/agnopay-sdk';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductPage() {
  const router = useRouter();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  const { createOrder, isLoading, error } = useAgnoPayCheckout({
    onSuccess: (order) => setCheckoutId(order.id),
    onError: (error) => alert(error.message),
  });

  const handlePurchase = async () => {
    await createOrder({
      line_items: [{
        code: 'PREMIUM-001',
        description: 'Premium Package',
        amount: 9900,
        quantity: 1
      }]
    });
  };

  if (checkoutId) {
    return (
      <AgnoPayCheckout
        orderId={checkoutId}
        onSuccess={() => router.push('/success')}
        style={{ primaryColor: '#10b981' }}
      />
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Premium Package</h1>
      <p className="text-xl mb-6">$99.00</p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error.message}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Buy Now'}
      </button>
    </div>
  );
}
```

## Support

For issues or questions, please refer to the main AgnoPay documentation.

## License

MIT
