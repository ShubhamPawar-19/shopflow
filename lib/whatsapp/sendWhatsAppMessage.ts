import { WhatsAppMessage } from "./types";

export async function sendWhatsAppMessage(data: WhatsAppMessage) {
  console.log("Sending to:", data.to);

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: data.to,
        type: "text",
        text: {
          body: data.message,
        },
      }),
    }
  );

  const result = await response.json();

  console.log("Meta Response:", JSON.stringify(result, null, 2));

  return result;
}