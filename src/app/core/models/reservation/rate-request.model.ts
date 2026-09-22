export interface RateRequest {
  name: string;
  description?: string;
  currency: string;
  categoryId: number;
  price: number;
  active: boolean;
}
