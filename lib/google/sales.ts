import { getRates } from "./rates";
import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import {
  CreateSaleInput,
  Sale,
  PaymentStatus,
} from "./types";
import {
  saleMessage,
  qrCaptionMessage,
} from "@/lib/whatsapp/templates";

import {
  sendWhatsAppMessage,
} from "@/lib/whatsapp/sendWhatsAppMessage";
import { sendWhatsAppImage } from "../whatsapp/send-whatsapp-image";
function generateSaleId() {
  return crypto.randomUUID();
}

export async function createSale(
  input: CreateSaleInput
): Promise<Sale> {
  const rates = await getRates();

  const total = input.quantity * rates.pouch;

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

    quantity: input.quantity,
    pouchRate: rates.pouch,

    total,

    paymentStatus,

    amountPaid: input.amountPaid,
    amountRemaining,

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
          sale.quantity,
          sale.pouchRate,
          sale.total,
          sale.amountPaid,
          sale.amountRemaining,
          sale.paymentStatus,
          sale.saleMessageSent,
          sale.paymentMessageSent,
        ],
      ],
    },
  });

  const whatsappNumber = sale.phone.startsWith("91")
    ? sale.phone
    : `91${sale.phone}`;

  console.log("Sending WhatsApp to:", whatsappNumber);

  try {
    // Send sale receipt first
    const receiptResult = await sendWhatsAppMessage({
      to: whatsappNumber,
      message: saleMessage(sale),
    });

    console.log("Receipt sent:", receiptResult);

    // Send QR only if payment is pending
    if (sale.amountRemaining > 0) {
      const qrResult = await sendWhatsAppImage({
        to: whatsappNumber,
        imageUrl: process.env.UPI_QR_IMAGE_URL!,
        caption: qrCaptionMessage(sale.amountRemaining),
      });

      console.log("QR sent:", qrResult);
    }
  } catch (err) {
    console.error("WhatsApp send failed:", err);
  }
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

    quantity: Number(row[4]),
    pouchRate: Number(row[5]),

    total: Number(row[6]),

    amountPaid: Number(row[7]),
    amountRemaining: Number(row[8]),

    paymentStatus: row[9] as PaymentStatus,

    saleMessageSent: row[10] === "TRUE",
    paymentMessageSent: row[11] === "TRUE",
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
    range: `${SHEETS.SALES}!A:L`,
  });

  const rows = response.data.values ?? [];

  const rowIndex = rows.findIndex((row) => row[0] === saleId);

  if (rowIndex === -1) {
    throw new Error("Sale not found");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.SALES}!H${rowIndex + 1}:J${rowIndex + 1}`,
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