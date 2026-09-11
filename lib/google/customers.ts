import { getSales } from "./sales";
import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import { CustomerSummary } from "./types";
import { getPaymentsByCustomerPhone } from "./payments";

export async function getCustomers(): Promise<CustomerSummary[]> {
    const sales = await getSales();
    const customers = new Map<string, CustomerSummary>();

    for (const sale of sales) {
        const existingCustomer = customers.get(sale.phone);

        if (!existingCustomer) {
            customers.set(sale.phone, {
                customer: sale.customer,
                phone: sale.phone,
                totalPurchases: sale.total,
                outstanding: sale.amountRemaining,
                lastPurchase: sale.date,
                salesCount: 1,
            });

            continue;
        }

        existingCustomer.totalPurchases += sale.total;
        existingCustomer.outstanding += sale.amountRemaining;
        existingCustomer.salesCount += 1;

        if (
            new Date(sale.date) >
            new Date(existingCustomer.lastPurchase)
        ) {
            existingCustomer.lastPurchase = sale.date;
        }
    }

    return Array.from(customers.values());
}

export async function deleteCustomerByPhone(
    phone: string
): Promise<{ success: true }> {

    // Get Sales rows
    const salesResponse =
        await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID!,
            range: `${SHEETS.SALES}!A:L`,
        });

    const salesRows =
        salesResponse.data.values ?? [];

    // Get Payments rows
    const paymentsResponse =
        await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID!,
            range: `${SHEETS.PAYMENTS}!A:H`,
        });

    const paymentRows =
        paymentsResponse.data.values ?? [];

    // Find matching Sales rows
    const salesToDelete = salesRows
        .map((row, index) => ({
            row,
            index,
        }))
        .filter(
            ({ row, index }) =>
                index > 0 && row[3] === phone
        );

    // Find matching Payment rows
    const paymentsToDelete = paymentRows
        .map((row, index) => ({
            row,
            index,
        }))
        .filter(
            ({ row, index }) =>
                index > 0 && row[3] === phone
        );

    if (
        salesToDelete.length === 0 &&
        paymentsToDelete.length === 0
    ) {
        throw new Error("Customer not found");
    }

    // Get Google Sheets tab IDs
    const spreadsheet =
        await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID!,
            fields: "sheets.properties",
        });

    const salesSheet =
        spreadsheet.data.sheets?.find(
            (sheet) =>
                sheet.properties?.title ===
                SHEETS.SALES
        );

    const paymentsSheet =
        spreadsheet.data.sheets?.find(
            (sheet) =>
                sheet.properties?.title ===
                SHEETS.PAYMENTS
        );

    const salesSheetId =
        salesSheet?.properties?.sheetId;

    const paymentsSheetId =
        paymentsSheet?.properties?.sheetId;

    if (salesSheetId === undefined) {
        throw new Error("Sales sheet not found");
    }

    if (paymentsSheetId === undefined) {
        throw new Error("Payments sheet not found");
    }

    // Delete Sales rows from bottom to top
    if (salesToDelete.length > 0) {
        const requests = salesToDelete
            .sort((a, b) => b.index - a.index)
            .map(({ index }) => ({
                deleteDimension: {
                    range: {
                        sheetId: salesSheetId,
                        dimension: "ROWS" as const,
                        startIndex: index,
                        endIndex: index + 1,
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
    }

    // Delete Payment rows from bottom to top
    if (paymentsToDelete.length > 0) {
        const requests = paymentsToDelete
            .sort((a, b) => b.index - a.index)
            .map(({ index }) => ({
                deleteDimension: {
                    range: {
                        sheetId: paymentsSheetId,
                        dimension: "ROWS" as const,
                        startIndex: index,
                        endIndex: index + 1,
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
    }

    return {
        success: true,
    };
}