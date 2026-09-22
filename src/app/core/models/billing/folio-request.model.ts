import { FolioStatus } from './folio-status.enum';

export interface FolioRequest {
  reservationId: number;
  status: FolioStatus;
}
