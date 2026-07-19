import { Sale } from "@/lib/google/types";

export function saleMessage(sale: Sale) {
  return `🛒 ShopFlow

Hello ${sale.customer},

Thank you for shopping with us!

━━━━━━━━━━━━━━━━━━

📦 Jaggery : ${sale.jaggeryKg} kg
🍵 Tea Powder : ${sale.teaKg} kg

💰 Total : ₹${sale.total}
💳 Payment : ${sale.paymentStatus}

━━━━━━━━━━━━━━━━━━

We appreciate your business.

Have a great day! 🙏`;
}