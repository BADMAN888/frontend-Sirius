export enum DocumentType {
  PASSPORT = 'PASSPORT',
  ID_CARD = 'ID_CARD',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
  VISA = 'VISA',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  OTHER = 'OTHER'
}

export interface GuestDocument {
  id: number;
  documentType: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
}
