import { getRates } from "./rates";
import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import { saleMessage } from "@/lib/whatsapp/templates";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
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

  if (input.amountPaid > total) {
    throw new Error("Amount paid cannot exceed total.");
  }
  const amountRemaining = Math.max(
    total - input.amountPaid,
    0
  );

  const paymentStatus =
    amountRemaining === 0 ? "Paid" : "Credit";

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

    paymentStatus,

    amountPaid: input.amountPaid,
    amountRemaining,

    saleMessageSent: false,
    paymentMessageSent: false,
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!A:N`,
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
          sale.amountPaid,
          sale.amountRemaining,
          sale.paymentStatus,
          sale.saleMessageSent,
          sale.paymentMessageSent,
        ]
      ],
    },
  });

  const whatsappNumber = sale.phone.startsWith("91")
    ? sale.phone
    : `91${sale.phone}`;

    console.log("Sending WhatsApp to:", whatsappNumber);

try {
  const result = await sendWhatsAppMessage({
    to: whatsappNumber,
    message: saleMessage(sale),
  });

  console.log("WhatsApp send result:", result);
} catch (err) {
  console.error("WhatsApp send failed:", err);
}

return sale;

  return sale;
}

export async function getSales(): Promise<Sale[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!A:N`,
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

    amountPaid: Number(row[9]),
    amountRemaining: Number(row[10]),

    paymentStatus: row[11] as PaymentStatus,

    saleMessageSent: row[12] === "TRUE",
    paymentMessageSent: row[13] === "TRUE",
  }));
}

export async function getSaleById(
  saleId: string
): Promise<Sale | null> {
  const sales = await getSales();

  return sales.find((sale) => sale.id === saleId) ?? null;
}

export async function updateSalePayment(
  saleId: string,
  amountPaid: number,
  amountRemaining: number,
  paymentStatus: PaymentStatus
): Promise<{ success: true }> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!A:N`,
  });

  const rows = response.data.values ?? [];

  const rowIndex = rows.findIndex((row) => row[0] === saleId);

  if (rowIndex === -1) {
    throw new Error("Sale not found");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!J${rowIndex + 1}:L${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[amountPaid, amountRemaining, paymentStatus]],
    },
  });

  return {
    success: true,
  };
}

export async function updatePaymentStatus(
  saleId: string,
  paymentStatus: PaymentStatus
): Promise<{ success: true }> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!A:N`,
  });

  const rows = response.data.values ?? [];

  const rowIndex = rows.findIndex((row) => row[0] === saleId);

  if (rowIndex === -1) {
    throw new Error("Sale not found");
  }
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!L${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[paymentStatus]],
    },
  });
  return {
    success: true,
  };
}