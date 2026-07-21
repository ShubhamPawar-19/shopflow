import { NextResponse } from "next/server";
import {
    createPayment,
    getPaymentsBySaleId,
} from "@/lib/google/payments";

import {
    getSaleById,
    updateSalePayment,
} from "@/lib/google/sales";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const payment = await createPayment(body);

        const sale = await getSaleById(payment.saleId);

        if (!sale) {
            throw new Error("Sale not found");
        }

        if (payment.amount > sale.amountRemaining) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Payment amount exceeds remaining balance",
                },
                {
                    status: 400,
                }
            );
        }

        const updatedAmountPaid = sale.amountPaid + payment.amount;

        const updatedAmountRemaining = Math.max(
            sale.total - updatedAmountPaid,
            0
        );

        const updatedPaymentStatus =
            updatedAmountRemaining === 0 ? "Paid" : "Credit";

        await updateSalePayment(
            sale.id,
            updatedAmountPaid,
            updatedAmountRemaining,
            updatedPaymentStatus
        );
        return NextResponse.json({
            success: true,
            data: payment,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to create payment",
            },
            {
                status: 500,
            }
        );
    }
}
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const saleId = searchParams.get("saleId");

        if (!saleId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "saleId is required",
                },
                {
                    status: 400,
                }
            );
        }

        const payments = await getPaymentsBySaleId(saleId);

        return NextResponse.json({
            success: true,
            data: payments,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch payments",
            },
            {
                status: 500,
            }
        );
    }
}