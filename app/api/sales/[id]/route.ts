import { NextRequest, NextResponse } from "next/server";

import {
  deleteSale,
  updatePaymentStatus,
} from "@/lib/google/sales";

import {
  deletePaymentsBySaleId,
} from "@/lib/google/payments";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { paymentStatus } = await request.json();
    const { id } = await params;

    await updatePaymentStatus(
      id,
      paymentStatus
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Update payment error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update payment",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Sale ID is required",
        },
        { status: 400 }
      );
    }

    // Delete related payments first
    await deletePaymentsBySaleId(id);

    // Then delete the sale
    await deleteSale(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete sale error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete sale",
      },
      { status: 500 }
    );
  }
}