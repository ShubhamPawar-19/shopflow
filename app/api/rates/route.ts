import { NextResponse } from "next/server";
import { getRates } from "@/lib/google/rates";

export async function GET() {
  try {
    const rates = await getRates();

    return NextResponse.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch rates",
      },
      {
        status: 500,
      }
    );
  }
}