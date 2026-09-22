import { Gender } from './gender.enum';
import { GuestDocumentRequest } from './guest-document-request.model';

export interface ProfileRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber?: string;
  email?: string;
  gender?: Gender;
  address?: string;
  guestDocument?: GuestDocumentRequest;
}
