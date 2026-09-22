import { Gender } from './gender.enum';
import { GuestDocument } from './guest-document.model';

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  address: string;
  guestDocument: GuestDocument;
}
