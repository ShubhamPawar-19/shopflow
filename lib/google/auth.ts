import { google } from "googleapis";
import path from "path";

export const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials", "shopflow.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});