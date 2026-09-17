import { NextRequest, NextResponse } from "next/server";

import {
  deleteSale,
  updatePaymentStatus,
  updateSale,
} from "@/lib/google/sales";

import {
  deletePaymentsBySaleId,
} from "@/lib/google/payments";

export async function PATCH(
  request: NextRequest,
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

    const body = await request.json();

    /*
     * Edit complete sale
     */
    if (body.action === "edit") {
      await updateSale(id, {
        date: body.date,
        customer: body.customer,
        phone: body.phone,
        quantity: Number(body.quantity),
        amountPaid: Number(body.amountPaid),
      });

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * Existing payment-status update
     */
    if (body.paymentStatus) {
      await updatePaymentStatus(
        id,
        body.paymentStatus
      );

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid update request",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Update sale error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update sale",
      },
      { status: 500 }
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