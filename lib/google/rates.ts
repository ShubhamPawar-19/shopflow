import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import { ProductRates } from "./types";

export async function getRates(): Promise<ProductRates> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.RATES}!A:B`,
  });

  const rows = response.data.values ?? [];

  let pouch = 80; // Default price

  for (const row of rows.slice(1)) {
    const [product, rate] = row;

    const key = product.trim().toLowerCase();

    if (key === "pouch") {
      pouch = Number(rate);
    }
  }

  return {
    pouch,
  };
}