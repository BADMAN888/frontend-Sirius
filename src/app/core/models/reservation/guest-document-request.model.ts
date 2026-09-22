import { DocumentType } from './guest-document.model';

export interface GuestDocumentRequest {
  documentType: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
}
