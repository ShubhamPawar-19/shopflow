import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f5f2] px-4 py-8">
      <div className="w-full max-w-md">

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          {/* Logo / Brand */}

          <div className="bg-gradient-to-br from-amber-50/80 via-white to-white px-8 pt-10 text-center">

            <div className="flex justify-center">
              <div className="rounded-3xl bg-amber-50 p-2 ring-1 ring-amber-100">
                <Image
                  src="/images/logo.png"
                  alt="गुरुकृपा"
                  width={100}
                  height={100}
                  className="rounded-2xl object-cover"
                  priority
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  गुरुकृपा
                </h1>
              </div>

              <p className="text-sm text-muted-foreground">
                फ्रँचायझी व्यवस्थापन प्रणाली
              </p>
            </div>

          </div>

          {/* Action */}

          <div className="space-y-4 px-8 pb-10 pt-8">

            <div className="rounded-xl border bg-[#faf9f6] p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Welcome back 👋
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                तुमचा व्यवसाय सहजपणे व्यवस्थापित करा.
              </p>
            </div>

            <Link href="/dashboard" className="block">
              <Button
                className="
                  h-12
                  w-full
                  bg-amber-600
                  text-base
                  font-semibold
                  text-white
                  shadow-sm
                  hover:bg-amber-700
                "
              >
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>

        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          गुरुकृपा फ्रँचायझी व्यवस्थापन
        </p>

      </div>
    </main>
  );
}