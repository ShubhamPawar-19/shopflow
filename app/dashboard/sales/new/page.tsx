import { SaleForm } from "./sale-form";

export default function NewSalePage() {
  return (
    <main className="container mx-auto max-w-3xl py-8">
      <h1 className="text-3xl font-bold">
        New Sale
      </h1>

      <p className="text-muted-foreground mt-2">
        Record a new customer sale.
      </p>

      <SaleForm />
    </main>
  );
}