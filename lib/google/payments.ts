import { sheets } from "./sheets";
import { SHEETS } from "./constants";

import {
    CreateCustomerPaymentInput,
    CreatePaymentInput,
    Payment,
} from "./types";

import {
    sendWhatsAppMessage,
} from "@/lib/whatsapp/sendWhatsAppMessage";

import {
    getSaleById,
    getSales,
    updateSalePayment,
} from "./sales";

import {
    paymentReceivedMessage,
} from "@/lib/whatsapp/templates";

function generatePaymentId() {
    return crypto.randomUUID();
}

/* =========================================================
   SALE-SPECIFIC PAYMENT
   ========================================================= */

export async function createPayment(
    input: CreatePaymentInput
): Promise<Payment> {
    const sale = await getSaleById(input.saleId);

    if (!sale) {
        throw new Error("Sale not found");
    }

    if (input.amount <= 0) {
        throw new Error(
            "Payment amount must be greater than 0"
        );
    }

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

    const newAmountPaid =
        sale.amountPaid + payment.amount;

    const newRemaining = Math.max(
        sale.total - newAmountPaid,
        0
    );

    const newStatus =
        newRemaining === 0
            ? "Paid"
            : "Credit";

    /*
     * Store the payment first.
     */
    await sheets.spreadsheets.values.append({
        spreadsheetId:
            process.env.GOOGLE_SHEET_ID!,
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

    /*
     * Update the sale.
     */
    await updateSalePayment(
        payment.saleId,
        newAmountPaid,
        newRemaining,
        newStatus
    );

    /*
     * Send payment confirmation.
     */
    const whatsappNumber =
        payment.phone.startsWith("91")
            ? payment.phone
            : `91${payment.phone}`;

    try {
        await sendWhatsAppMessage({
            to: whatsappNumber,
            message: paymentReceivedMessage(
                payment,
                newRemaining
            ),
        });
    } catch (error) {
        console.error(
            "Payment WhatsApp failed:",
            error
        );
    }

    return payment;
}

/* =========================================================
   CUSTOMER-LEVEL PAYMENT
   ========================================================= */

export interface CustomerPaymentAllocation {
    saleId: string;
    saleDate: string;
    amount: number;
}

export interface CustomerPaymentResult {
    paymentId: string;
    customer: string;
    phone: string;
    totalAmount: number;
    allocatedAmount: number;
    unallocatedAmount: number;
    allocations: CustomerPaymentAllocation[];
}

/**
 * Creates a general customer payment.
 *
 * The payment is automatically allocated against
 * outstanding sales from oldest → newest.
 *
 * Example:
 *
 * Sale 1 due: ₹700
 * Sale 2 due: ₹800
 * Sale 3 due: ₹500
 *
 * Customer pays ₹1,200
 *
 * Sale 1 → ₹700
 * Sale 2 → ₹500
 * Sale 3 → ₹0
 *
 * If the customer pays more than the total outstanding,
 * the excess is stored as an unallocated payment.
 */
export async function createCustomerPayment(
    input: CreateCustomerPaymentInput
): Promise<CustomerPaymentResult> {
    const customer =
        input.customer.trim();

    const phone =
        input.phone.trim();

    if (!customer) {
        throw new Error(
            "Customer name is required"
        );
    }

    if (!phone) {
        throw new Error(
            "Customer phone is required"
        );
    }

    if (
        !Number.isFinite(input.amount) ||
        input.amount <= 0
    ) {
        throw new Error(
            "Payment amount must be greater than 0"
        );
    }

    const paymentId =
        generatePaymentId();

    const paymentDate =
        new Date().toISOString();

    /*
     * Find all outstanding sales for this customer.
     *
     * Oldest sale is processed first.
     */
    const sales = await getSales();

    const outstandingSales = sales
        .filter(
            (sale) =>
                sale.phone === phone &&
                sale.amountRemaining > 0
        )
        .sort(
            (a, b) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime()
        );

    let remainingPayment =
        input.amount;

    let allocatedAmount = 0;

    const allocations: CustomerPaymentAllocation[] =
        [];

    const paymentRows: (
        | string
        | number
    )[][] = [];

    /*
     * Build all allocations first.
     *
     * We do NOT update the sales yet.
     */
    for (const sale of outstandingSales) {
        if (remainingPayment <= 0) {
            break;
        }

        const allocationAmount =
            Math.min(
                remainingPayment,
                sale.amountRemaining
            );

        if (allocationAmount <= 0) {
            continue;
        }

        allocations.push({
            saleId: sale.id,
            saleDate: sale.date,
            amount: allocationAmount,
        });

        paymentRows.push([
            paymentId,
            sale.id,
            customer,
            phone,
            allocationAmount,
            input.paymentMode,
            paymentDate,
            input.note || "",
        ]);

        allocatedAmount +=
            allocationAmount;

        remainingPayment -=
            allocationAmount;
    }

    /*
     * Anything left after all outstanding sales
     * have been covered becomes an unallocated
     * customer balance.
     */
    const unallocatedAmount =
        remainingPayment;

    if (unallocatedAmount > 0) {
        paymentRows.push([
            paymentId,
            "",
            customer,
            phone,
            unallocatedAmount,
            input.paymentMode,
            paymentDate,
            input.note ||
                "Unallocated customer payment",
        ]);
    }

    /*
     * Record the entire customer payment first.
     *
     * All rows share the same payment ID.
     */
    await sheets.spreadsheets.values.append({
        spreadsheetId:
            process.env.GOOGLE_SHEET_ID!,
        range: `${SHEETS.PAYMENTS}!A:H`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: paymentRows,
        },
    });

    /*
     * Now update the affected sales.
     */
    for (const allocation of allocations) {
        const sale = sales.find(
            (item) =>
                item.id ===
                allocation.saleId
        );

        if (!sale) {
            throw new Error(
                `Sale not found: ${allocation.saleId}`
            );
        }

        const newAmountPaid =
            sale.amountPaid +
            allocation.amount;

        const newRemaining =
            Math.max(
                sale.total -
                    newAmountPaid,
                0
            );

        const newStatus =
            newRemaining === 0
                ? "Paid"
                : "Credit";

        await updateSalePayment(
            sale.id,
            newAmountPaid,
            newRemaining,
            newStatus
        );
    }

    return {
        paymentId,
        customer,
        phone,
        totalAmount: input.amount,
        allocatedAmount,
        unallocatedAmount,
        allocations,
    };
}

/* =========================================================
   GET PAYMENTS FOR A SALE
   ========================================================= */

export async function getPaymentsBySaleId(
    saleId: string
): Promise<Payment[]> {
    const response =
        await sheets.spreadsheets.values.get({
            spreadsheetId:
                process.env.GOOGLE_SHEET_ID!,
            range: `${SHEETS.PAYMENTS}!A:H`,
        });

    const rows =
        response.data.values ?? [];

    return rows
        .slice(1)
        .filter(
            (row) => row[1] === saleId
        )
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

/* =========================================================
   GET PAYMENTS FOR A CUSTOMER
   ========================================================= */

export async function getPaymentsByCustomerPhone(
    phone: string
): Promise<Payment[]> {
    const response =
        await sheets.spreadsheets.values.get({
            spreadsheetId:
                process.env.GOOGLE_SHEET_ID!,
            range: `${SHEETS.PAYMENTS}!A:H`,
        });

    const rows =
        response.data.values ?? [];

    return rows
        .slice(1)
        .filter(
            (row) => row[3] === phone
        )
        .map((row) => ({
            id: row[0],
            saleId: row[1] || "",
            customer: row[2],
            phone: row[3],
            amount: Number(row[4]),
            paymentMode: row[5],
            date: row[6],
            note: row[7],
        }));
}

/* =========================================================
   DELETE PAYMENTS FOR A SALE
   ========================================================= */

export async function deletePaymentsBySaleId(
    saleId: string
): Promise<{ success: true }> {
    const response =
        await sheets.spreadsheets.values.get({
            spreadsheetId:
                process.env.GOOGLE_SHEET_ID!,
            range: `${SHEETS.PAYMENTS}!A:H`,
        });

    const rows =
        response.data.values ?? [];

    const paymentRows = rows
        .map((row, index) => ({
            row,
            index,
        }))
        .filter(
            ({ row, index }) =>
                index > 0 &&
                row[1] === saleId
        );

    if (paymentRows.length === 0) {
        return {
            success: true,
        };
    }

    const spreadsheet =
        await sheets.spreadsheets.get({
            spreadsheetId:
                process.env.GOOGLE_SHEET_ID!,
            fields: "sheets.properties",
        });

    const paymentsSheet =
        spreadsheet.data.sheets?.find(
            (sheet) =>
                sheet.properties?.title ===
                SHEETS.PAYMENTS
        );

    const sheetId =
        paymentsSheet?.properties?.sheetId;

    if (sheetId === undefined) {
        throw new Error(
            "Payments sheet not found"
        );
    }

    /*
     * Delete from bottom to top so row
     * indexes don't shift.
     */
    const requests = paymentRows
        .sort(
            (a, b) =>
                b.index - a.index
        )
        .map(({ index }) => ({
            deleteDimension: {
                range: {
                    sheetId,
                    dimension:
                        "ROWS" as const,
                    startIndex: index,
                    endIndex:
                        index + 1,
                },
            },
        }));

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId:
            process.env.GOOGLE_SHEET_ID!,
        requestBody: {
            requests,
        },
    });

    return {
        success: true,
    };
}