import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg text-center space-y-6">

        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="गुरुकृपा"
            width={100}
            height={100}
            className="rounded-full border-4 border-primary shadow-md object-cover"
            priority
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            गुरुकृपा
          </h1>

          <p className="text-muted-foreground">
            फ्रँचायझी व्यवस्थापन प्रणाली
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Welcome back 👋
          </p>

          <Link href="/dashboard">
            <Button className="w-full h-12 text-base">
              Open Dashboard
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}