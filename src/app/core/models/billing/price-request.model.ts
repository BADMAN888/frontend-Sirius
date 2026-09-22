import { PriceStatus } from './price-status.enum';

export interface PriceRequest {
  rateId: number;
  roomCategoryId: number;
  amount: number;
  validFrom: string;
  validTo?: string;
  status: PriceStatus;
}
