import { Payment, Sale } from "@/lib/google/types";

export function saleMessage(sale: Sale) {
  return `गुरुकृपा

नमस्कार ${sale.customer} 

आपल्या शाखेसाठी पाऊचचा खालीलप्रमाणे माल देण्यात आला आहे.

━━━━━━━━━━━━━━━━━━

📦 उत्पादन : पाऊच
📦 प्रमाण : ${sale.quantity}

💰 एकूण बिल : ₹${sale.total}
💵 भरलेली रक्कम : ₹${sale.amountPaid}
🧾 बाकी रक्कम : ₹${sale.amountRemaining}
📊 स्थिती : ${sale.paymentStatus === "Paid" ? "पूर्ण" : "बाकी"}

━━━━━━━━━━━━━━━━━━

आपल्या सहकार्याबद्दल धन्यवाद 🙏.

- गुरुकृपा`;
}

export function paymentReminderMessage(
  customer: string,
  amount: number
) {
  return `गुरुकृपा

नमस्कार ${customer} 

आपल्या शाखेच्या खात्यामध्ये ₹${amount} इतकी रक्कम बाकी आहे.

कृपया आपल्या सोयीने लवकरात लवकर पेमेंट पूर्ण करावे.

धन्यवाद 🙏.

- गुरुकृपा`;
}

export function paymentReceivedMessage(
  payment: Payment,
  remaining: number
) {
  const paymentMode =
    payment.paymentMode === "CASH"
      ? "रोख"
      : payment.paymentMode === "UPI"
      ? "UPI"
      : "बँक हस्तांतरण";

  return `✅ गुरुकृपा

नमस्कार ${payment.customer} 

आपले पेमेंट यशस्वीरित्या प्राप्त झाले आहे.

━━━━━━━━━━━━━━━━━━

💵 प्राप्त रक्कम : ₹${payment.amount}
💳 पेमेंट प्रकार : ${paymentMode}
🧾 उर्वरित बाकी : ₹${remaining}

━━━━━━━━━━━━━━━━━━

आपल्या सहकार्याबद्दल धन्यवाद 🙏.

- गुरुकृपा`;
}

export function qrCaptionMessage(amount: number) {
  return `📲 गुरुकृपा

आपल्या शाखेच्या ₹${amount} बाकी रकमेचे पेमेंट करण्यासाठी कृपया खाली दिलेला QR Code स्कॅन करा.

धन्यवाद 🙏.

- गुरुकृपा`;
}

export function dailyReportMessage(
  totalSales: number,
  revenue: number,
  paid: number,
  credit: number
) {
  return `📊 गुरुकृपा दैनिक अहवाल

📦 एकूण पुरवठे : ${totalSales}
💰 एकूण बिल : ₹${revenue}
✅ प्राप्त रक्कम : ₹${paid}
🧾 बाकी रक्कम : ₹${credit}

━━━━━━━━━━━━━━━━━━`
};