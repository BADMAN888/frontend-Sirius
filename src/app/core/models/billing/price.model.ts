import { PriceStatus } from './price-status.enum';

export interface Price {
  id: number;
  rateId: number;
  rateName: string;
  roomCategoryId: number;
  roomCategoryName: string;
  amount: number;
  validFrom: string;
  validTo?: string;
  status: PriceStatus;
}
