import { NextResponse } from "next/server";
import { deleteCustomerByPhone } from "@/lib/google/customers";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ phone: string }> }
) {
    try {
        const { phone } = await params;

        if (!phone) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Customer phone is required",
                },
                { status: 400 }
            );
        }

        await deleteCustomerByPhone(
            decodeURIComponent(phone)
        );

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Delete customer error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete customer",
            },
            { status: 500 }
        );
    }
}