/**
 * AgnoPay SDK Types
 */

export interface AgnoPayConfig {
  apiKey: string;
}

export interface LineItem {
  code: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface CreateOrderRequest {
  line_items: LineItem[];
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  // Add other fields returned by the API
}

export interface AgnoPayError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Iframe styling configuration
 */
export interface IframeStyleConfig {
  transparent?: boolean;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}
