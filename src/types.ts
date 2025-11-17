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
  uuid: string;
  status: string;
  payment_method?: 'pix' | 'boleto' | 'credit_card';
  pix?: {
    qr_code: string;
    qr_code_url: string;
    expires_at: string;
  };
  boleto?: {
    barcode: string;
    line: string;
    url: string;
    due_at: string;
  };
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
