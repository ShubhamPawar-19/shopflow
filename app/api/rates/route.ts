import { NextResponse } from "next/server";
import { getRates } from "@/lib/google/rates";

export async function GET() {
  const rates = await getRates();

  return NextResponse.json(rates);
}