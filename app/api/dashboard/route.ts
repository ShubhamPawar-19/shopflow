import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/google/dashboard";

export async function GET() {
  try {
    const data = await getDashboardStats();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}