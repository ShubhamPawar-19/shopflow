"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
      const response = await fetch("/api/payment-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          phone,
          amount,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Reminder sent!");
      } else {
        toast.error("Failed to send reminder");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={sendReminder}
      disabled={loading}
    >
      {loading ? "Sending..." : "Send Reminder"}
    </Button>
  );
}