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
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sale = await createSale(body);

    return NextResponse.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create sale",
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