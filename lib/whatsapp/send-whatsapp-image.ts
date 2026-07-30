import { WhatsAppImageMessage } from "./types";

export async function sendWhatsAppImage(data: WhatsAppImageMessage) {
  console.log("Sending image to:", data.to);

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
        type: "image",
        image: {
          link: data.imageUrl,
          caption: data.caption,
        },
      }),
    }
  );

  const result = await response.json();

  console.log("Meta Image Response:", JSON.stringify(result, null, 2));

  return result;
}