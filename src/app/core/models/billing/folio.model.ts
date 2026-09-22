import { FolioStatus } from './folio-status.enum';
import { Accrual } from './accrual.model';
import { Payment } from './payment.model';

export interface Folio {
  id: number;
  reservationId: number;
  status: FolioStatus;
  totalAmount: number;
  paidAmount: number;
  accruals: Accrual[];
  payments: Payment[];
}
