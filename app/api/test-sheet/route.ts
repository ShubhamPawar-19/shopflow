import { NextResponse } from "next/server";
import { sheets } from "@/lib/google/sheets";

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "Rates!A:B",
    });

    return NextResponse.json({
      success: true,
      data: response.data.values,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to read Google Sheet",
      },
      { status: 500 }
    );
  }
}