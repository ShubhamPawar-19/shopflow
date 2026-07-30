import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import { CreatePaymentInput, Payment } from "./types";
import { sendWhatsAppMessage } from "@/lib/whatsapp/sendWhatsAppMessage";
import { getSaleById, updateSalePayment } from "./sales";
import { paymentReceivedMessage } from "@/lib/whatsapp/templates";

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

    const sale = await getSaleById(payment.saleId);

    if (!sale) {
        throw new Error("Sale not found");
    }

    const newAmountPaid =
        sale.amountPaid + payment.amount;

    const newRemaining =
        Math.max(sale.total - newAmountPaid, 0);

    const newStatus =
        newRemaining === 0
            ? "Paid"
            : "Credit";

    await updateSalePayment(
        payment.saleId,
        newAmountPaid,
        newRemaining,
        newStatus
    );

    const whatsappNumber = payment.phone.startsWith("91")
        ? payment.phone
        : `91${payment.phone}`;

    try {
        await sendWhatsAppMessage({
            to: whatsappNumber,
            message: paymentReceivedMessage(payment, newRemaining),
        });
    } catch (error) {
        console.error("Payment WhatsApp failed:", error);
    }

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