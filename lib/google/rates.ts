import { sheets } from "./sheets";
import { SHEETS } from "./constants";
import { ProductRates } from "./types";

export async function getRates(): Promise<ProductRates> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEETS.RATES}!A:B`,
  });

  const rows = response.data.values ?? [];

  let jaggery = 0;
  let teaPowder = 0;

  for (const row of rows.slice(1)) {
    const [product, rate] = row;

    const key = product.trim().toLowerCase();

    if (key === "jaggery") {
      jaggery = Number(rate);
    }

    if (key === "tea powder") {
      teaPowder = Number(rate);
    }
  }

  return {
    jaggery,
    teaPowder,
  };
}