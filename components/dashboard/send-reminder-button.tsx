"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface Props {
  customer: string;
  phone: string;
  amount: number;
}

export function SendReminderButton({
  customer,
  phone,
  amount,
}: Props) {

  const [loading, setLoading] = useState(false);


  async function sendReminder() {

    setLoading(true);

    try {

      const response = await fetch(
        "/api/payment-reminder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer,
            phone,
            amount,
          }),
        }
      );


      const result = await response.json();


      if (result.success) {

        toast.success(
          "पेमेंट आठवण पाठवली"
        );

      } else {

        toast.error(
          "आठवण पाठवता आली नाही"
        );

      }


    } catch(error) {

      console.error(error);

      toast.error(
        "काहीतरी चूक झाली"
      );

    }
    finally {

      setLoading(false);

    }

  }


  return (

    <Button
      size="sm"
      variant="outline"
      onClick={sendReminder}
      disabled={loading}
      className="gap-2"
    >

      <Bell className="h-4 w-4"/>

      {
        loading
          ? "पाठवत आहे..."
          : "आठवण पाठवा"
      }

    </Button>

  );
}