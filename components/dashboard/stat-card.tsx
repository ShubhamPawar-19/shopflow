import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card
      className="
        group
        overflow-hidden
        border-border/70
        bg-gradient-to-br
        from-white
        to-[#faf9f6]
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <CardContent className="p-6">

        <div className="
          flex
          items-start
          justify-between
          gap-4
        ">

          {/* Text */}

          <div className="min-w-0">

            <p className="
              text-sm
              font-medium
              text-muted-foreground
            ">
              {title}
            </p>

            <h2 className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
            ">
              {value}
            </h2>

          </div>


          {/* Icon */}

          <div className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            text-amber-700
            transition-transform
            duration-200
            group-hover:scale-105
          ">
            <Icon className="h-6 w-6" />
          </div>

        </div>


        {/* Bottom accent */}

        <div className="
          mt-6
          h-1
          w-10
          rounded-full
          bg-amber-500
          transition-all
          duration-200
          group-hover:w-16
        " />

      </CardContent>
    </Card>
  );
}