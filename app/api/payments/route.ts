import { NextResponse } from "next/server";

import {
    createCustomerPayment,
    createPayment,
    getPaymentsBySaleId,
} from "@/lib/google/payments";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (
            !body.customer ||
            !body.phone ||
            !body.amount ||
            Number(body.amount) <= 0 ||
            !body.paymentMode
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Customer, phone, amount and payment mode are required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Existing sale-specific payment flow.
         */
        if (body.saleId) {
            const payment = await createPayment({
                saleId: body.saleId,
                customer: body.customer,
                phone: body.phone,
                amount: Number(body.amount),
                paymentMode: body.paymentMode,
                note: body.note,
            });

            return NextResponse.json({
                success: true,
                data: payment,
            });
        }

        /*
         * New customer-level payment flow.
         *
         * The backend automatically allocates the
         * payment from oldest outstanding sale
         * to newest.
         */
        const payment =
            await createCustomerPayment({
                customer: body.customer,
                phone: body.phone,
                amount: Number(body.amount),
                paymentMode: body.paymentMode,
                note: body.note,
            });

        return NextResponse.json({
            success: true,
            data: payment,
        });
    } catch (error) {
        console.error(
            "Create payment error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create payment",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const saleId =
            searchParams.get("saleId");

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

        const payments =
            await getPaymentsBySaleId(saleId);

        return NextResponse.json({
            success: true,
            data: payments,
        });
    } catch (error) {
        console.error(
            "Fetch payments error:",
            error
        );

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