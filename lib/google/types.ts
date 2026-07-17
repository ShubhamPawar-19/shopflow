export interface ProductRates {
  jaggery: number;
  teaPowder: number;
}

export type PaymentStatus = "Paid" | "Credit";

export interface CreateSaleInput {
  customer: string;
  phone: string;

  jaggeryKg: number;
  teaKg: number;

  paymentStatus: PaymentStatus;
}

export interface Sale extends CreateSaleInput {
  id: string;
  date: string;

  jaggeryRate: number;
  teaRate: number;

  total: number;

  saleMessageSent: boolean;
  paymentMessageSent: boolean;
}
