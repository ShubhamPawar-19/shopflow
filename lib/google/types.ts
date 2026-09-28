export interface ProductRates {
    pouch: number;
}

export type PaymentStatus = "Paid" | "Credit";

export interface CreateSaleInput {
    customer: string;
    phone: string;
    quantity: number;
    amountPaid: number;
    paymentStatus: PaymentStatus;
}

export interface UpdateSaleInput {
    date: string;
    customer: string;
    phone: string;
    quantity: number;
    amountPaid: number;
}

export interface Sale extends CreateSaleInput {
    id: string;
    date: string;
    pouchRate: number;
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

    /**
     * Sale this payment was allocated to.
     * Empty when part of the payment remains unallocated.
     */
    saleId: string;

    customer: string;
    phone: string;
    amount: number;
    paymentMode: PaymentMode;
    date: string;
    note?: string;
}

/**
 * Existing payment flow:
 * Payment is added directly to a specific sale.
 */
export interface CreatePaymentInput {
    saleId: string;
    customer: string;
    phone: string;
    amount: number;
    paymentMode: PaymentMode;
    note?: string;
}

/**
 * New payment flow:
 * Customer makes a general payment without selecting a sale.
 *
 * The backend will automatically allocate the amount
 * from the oldest outstanding sale to the newest.
 */
export interface CreateCustomerPaymentInput {
    customer: string;
    phone: string;
    amount: number;
    paymentMode: PaymentMode;
    note?: string;
}