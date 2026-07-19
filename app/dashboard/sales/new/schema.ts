import { z } from "zod";

export const saleSchema = z.object({
  customer: z.string().min(2, "Customer name is required"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),

  jaggeryKg: z.coerce.number().min(0),

  teaKg: z.coerce.number().min(0),
  amountPaid: z.coerce.number().min(0),
}).refine(
  (data) => data.jaggeryKg > 0 || data.teaKg > 0,
  {
    message: "Enter quantity for at least one product",
    path: ["jaggeryKg"],
  }
);

export type SaleFormValues = z.output<typeof saleSchema>;