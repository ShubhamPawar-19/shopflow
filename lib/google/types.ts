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

  amountPaid: number;

  paymentStatus: PaymentStatus;
}

export interface Sale extends CreateSaleInput {
  id: string;
  date: string;

  jaggeryRate: number;
  teaRate: number;

  total: number;

  amountRemaining: number;

  saleMessageSent: boolean;
  paymentMessageSent: boolean;
}

export interface CustomerSummary {
  customer: string;
  phone: string;

  totalPurchases: number;

  outstanding: number;

  lastPurchase: string;

  salesCount: number;
}


export type PaymentMode = "CASH" | "UPI" | "BANK";

export interface Payment {
  id: string;
  saleId: string;
  customer: string;
  phone: string;
  amount: number;
  paymentMode: PaymentMode;
  date: string;
  note?: string;
}

export interface CreatePaymentInput {
  saleId: string;
  customer: string;
  phone: string;
  amount: number;
  paymentMode: PaymentMode;
  note?: string;
}