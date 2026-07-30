import { z } from "zod";

export const saleSchema = z
  .object({
    customer: z
      .string()
      .min(2, "Customer name is required"),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits"),

    quantity: z.coerce
      .number()
      .int()
      .min(1, "Quantity must be at least 1"),

    amountPaid: z.coerce
      .number()
      .min(0, "Amount paid cannot be negative"),
  })
  .refine(
    (data) => data.amountPaid <= data.quantity * 70,
    {
      message: "Amount paid cannot exceed total amount",
      path: ["amountPaid"],
    }
  );

export type SaleFormValues = z.output<typeof saleSchema>;