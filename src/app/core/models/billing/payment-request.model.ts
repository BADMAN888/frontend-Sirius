import { PaymentMethod } from './payment-method.enum';

export interface PaymentRequest {
  folioId: number;
  method: PaymentMethod;
  amount: number;
  description?: string;
}
