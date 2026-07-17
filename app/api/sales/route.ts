import { NextResponse } from "next/server";
import {
  createSale,
  getSales,
  updatePaymentStatus,
} from "@/lib/google/sales";

export async function GET() {
  try {
    const sales = await getSales();

    return NextResponse.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sales",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST() {
  try {
    await createSale({
      customer: "Rahul",
      phone: "9876543210",
      jaggeryKg: 5,
      teaKg: 2,
      paymentStatus: "Paid",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    await updatePaymentStatus(
      body.saleId,
      body.paymentStatus
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update payment status",
      },
      {
        status: 500,
      }
    );
  }
}