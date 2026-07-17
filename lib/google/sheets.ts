import { google } from "googleapis";
import { auth } from "./auth";

export const sheets = google.sheets({
  version: "v4",
  auth,
});