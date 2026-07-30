export interface WhatsAppMessage {
  to: string;
  message: string;
}

export interface WhatsAppImageMessage {
  to: string;
  imageUrl: string;
  caption?: string;
}