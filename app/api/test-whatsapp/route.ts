import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function GET() {
  try {
    const result = await sendWhatsAppMessage({
      to: "918261819381",
      message: "🚀 Hello from ShopFlow!",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}