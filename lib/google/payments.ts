import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import { CreatePaymentInput, Payment } from "./types";

function generatePaymentId() {
  return crypto.randomUUID();
}

export async function createPayment(
  input: CreatePaymentInput
): Promise<Payment> {
  const payment: Payment = {
    id: generatePaymentId(),
    saleId: input.saleId,
    customer: input.customer,
    phone: input.phone,
    amount: input.amount,
    paymentMode: input.paymentMode,
    date: new Date().toISOString(),
    note: input.note || "",
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.PAYMENTS}!A:H`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          payment.id,
          payment.saleId,
          payment.customer,
          payment.phone,
          payment.amount,
          payment.paymentMode,
          payment.date,
          payment.note,
        ],
      ],
    },
  });

  return payment;
}

export async function getPaymentsBySaleId(
  saleId: string
): Promise<Payment[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.PAYMENTS}!A:H`,
  });

  const rows = response.data.values ?? [];

  return rows
    .slice(1)
    .filter((row) => row[1] === saleId)
    .map((row) => ({
      id: row[0],
      saleId: row[1],
      customer: row[2],
      phone: row[3],
      amount: Number(row[4]),
      paymentMode: row[5],
      date: row[6],
      note: row[7],
    }));
}

export async function getPaymentsByCustomerPhone(
  phone: string
): Promise<Payment[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.PAYMENTS}!A:H`,
  });

  const rows = response.data.values ?? [];

  return rows
    .slice(1)
    .filter((row) => row[3] === phone)
    .map((row) => ({
      id: row[0],
      saleId: row[1],
      customer: row[2],
      phone: row[3],
      amount: Number(row[4]),
      paymentMode: row[5],
      date: row[6],
      note: row[7],
    }));
}