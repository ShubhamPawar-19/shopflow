import { getCustomers } from "@/lib/google/customers";
import { CustomerList } from "./customer-list";
import { Users } from "lucide-react";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <main className="container mx-auto py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              ग्राहक
            </h1>

            <p className="text-muted-foreground">
              फ्रँचायझी ग्राहक व्यवस्थापन
            </p>
          </div>

        </div>


        <div className="rounded-lg border px-5 py-3 text-center">

          <p className="text-sm text-muted-foreground">
            एकूण ग्राहक
          </p>

          <p className="text-2xl font-bold">
            {customers.length}
          </p>

        </div>

      </div>


      {/* Customer List */}
      <CustomerList customers={customers} />

    </main>
  );
}