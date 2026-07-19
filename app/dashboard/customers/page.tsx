import { getCustomers } from "@/lib/google/customers";
import { CustomerList } from "./customer-list";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">
        Customers
      </h1>

      <CustomerList customers={customers} />
    </main>
  );
}