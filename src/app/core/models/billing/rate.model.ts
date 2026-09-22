export interface Rate {
  id: number;
  name: string;
  description: string;
  currency: string;
  categoryId: number;
  price: number;
  active: boolean;
}
