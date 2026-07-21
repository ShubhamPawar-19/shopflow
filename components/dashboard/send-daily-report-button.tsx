"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SendDailyReportButton() {
  const [loading, setLoading] = useState(false);

  async function sendReport() {
    setLoading(true);

    try {
      const response = await fetch("/api/daily-report", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Daily report sent!");
      } else {
        toast.error("Failed to send report");
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
      onClick={sendReport}
      disabled={loading}
    >
      {loading ? "Sending..." : "Send Daily Report"}
    </Button>
  );
}