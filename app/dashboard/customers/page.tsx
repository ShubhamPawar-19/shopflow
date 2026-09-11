import { getCustomers } from "@/lib/google/customers";
import { CustomerList } from "./customer-list";
import { Users, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <section className="flex flex-col gap-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-7 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <Users className="h-7 w-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  ग्राहक
                </h1>

                <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 sm:inline-flex">
                  CUSTOMERS
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                फ्रँचायझी ग्राहक आणि त्यांच्या व्यवहारांचे व्यवस्थापन
              </p>
            </div>

          </div>


          {/* Customer Count */}

          <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 px-5 py-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium text-amber-700">
                एकूण ग्राहक
              </p>

              <p className="mt-0.5 text-2xl font-bold tracking-tight text-amber-900">
                {customers.length}
              </p>
            </div>

          </div>

        </section>


        {/* Customer List */}

        <section>
          <CustomerList customers={customers} />
        </section>

      </div>
    </main>
  );
}