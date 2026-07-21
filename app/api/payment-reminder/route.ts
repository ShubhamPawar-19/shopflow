import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { paymentReminderMessage } from "@/lib/whatsapp/templates";

export async function POST(request: NextRequest) {
  try {
    const { customer, phone, amount } = await request.json();

    const whatsappNumber = phone.startsWith("91")
      ? phone
      : `91${phone}`;

    await sendWhatsAppMessage({
      to: whatsappNumber,
      message: paymentReminderMessage(customer, amount),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}