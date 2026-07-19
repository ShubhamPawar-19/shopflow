import { WhatsAppMessage } from "./types";

export async function sendMockWhatsApp(
  data: WhatsAppMessage
) {
  console.log("📱 WhatsApp Message");
  console.log("----------------------");
  console.log("To:", data.to);
  console.log("Message:");
  console.log(data.message);
  console.log("----------------------");

  return {
    success: true,
  };
}