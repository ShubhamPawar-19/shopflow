import { getRates } from "./rates";
import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import {
  CreateSaleInput,
  Sale,
  PaymentStatus,
} from "./types";

function generateSaleId() {
  return crypto.randomUUID();
}

export async function createSale(
  input: CreateSaleInput
): Promise<Sale> {
  const rates = await getRates();

  const total =
    input.jaggeryKg * rates.jaggery +
    input.teaKg * rates.teaPowder;

  const sale: Sale = {
    id: generateSaleId(),
    date: new Date().toISOString(),

    customer: input.customer,
    phone: input.phone,

    jaggeryKg: input.jaggeryKg,
    teaKg: input.teaKg,

    jaggeryRate: rates.jaggery,
    teaRate: rates.teaPowder,

    total,

    paymentStatus: input.paymentStatus,

    saleMessageSent: false,
    paymentMessageSent: false,
  };

  await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.GOOGLE_SHEET_ID!,
  range: `${SHEETS.SALES}!A:L`,
  valueInputOption: "USER_ENTERED",
  requestBody: {
    values: [
      [
        sale.id,
        sale.date,
        sale.customer,
        sale.phone,
        sale.jaggeryKg,
        sale.jaggeryRate,
        sale.teaKg,
        sale.teaRate,
        sale.total,
        sale.paymentStatus,
        sale.saleMessageSent,
        sale.paymentMessageSent,
      ],
    ],
  },
});

  return sale;
}

export async function getSales(): Promise<Sale[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!A:L`,
  });

  const rows = response.data.values ?? [];

  return rows.slice(1).map((row) => ({
    id: row[0],
    date: row[1],

    customer: row[2],
    phone: row[3],

    jaggeryKg: Number(row[4]),
    jaggeryRate: Number(row[5]),

    teaKg: Number(row[6]),
    teaRate: Number(row[7]),

    total: Number(row[8]),

    paymentStatus: row[9] as "Paid" | "Credit",

    saleMessageSent: row[10] === "TRUE",
    paymentMessageSent: row[11] === "TRUE",
  }));
}

export async function updatePaymentStatus(
  saleId: string,
  paymentStatus: PaymentStatus
): Promise<{ success: true }> {
  const response = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.GOOGLE_SHEET_ID!,
  range: `${SHEETS.SALES}!A:L`,
});

const rows = response.data.values ?? [];

const rowIndex = rows.findIndex((row) => row[0] === saleId);

if (rowIndex === -1) {
  throw new Error("Sale not found");
}
await sheets.spreadsheets.values.update({
  spreadsheetId: process.env.GOOGLE_SHEET_ID!,
  range: `${SHEETS.SALES}!J${rowIndex + 1}`,
  valueInputOption: "USER_ENTERED",
  requestBody: {
    values: [[paymentStatus]],
  },
});
return {
  success: true,
};
}