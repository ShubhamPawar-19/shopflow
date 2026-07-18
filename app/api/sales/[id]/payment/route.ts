import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus } from "@/lib/google/sales";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { paymentStatus } = await request.json();
    const { id } = await params;

    await updatePaymentStatus(id, paymentStatus);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update payment",
      },
      {
        status: 500,
      }
    );
  }
}