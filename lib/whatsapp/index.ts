import { sendMockWhatsApp } from "./mock";
import { WhatsAppMessage } from "./types";

export async function sendWhatsAppMessage(
  data: WhatsAppMessage
) {
  return sendMockWhatsApp(data);
}