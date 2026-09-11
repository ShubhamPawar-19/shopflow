import { SaleForm } from "./sale-form";

export default function NewSalePage() {
  return (
    <main className="
      min-h-[calc(100vh-80px)]
      bg-[#f6f5f2]
      px-4
      py-8
      sm:px-6
      lg:px-8
    ">
      <SaleForm />
    </main>
  );
}