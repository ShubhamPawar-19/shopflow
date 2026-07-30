"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function SendDailyReportButton() {
  const [loading, setLoading] = useState(false);


  async function sendReport() {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/daily-report",
        {
          method: "POST",
        }
      );


      const result = await response.json();


      if (result.success) {
        toast.success(
          "आजचा रिपोर्ट WhatsApp वर पाठवला!"
        );
      } else {
        toast.error(
          "रिपोर्ट पाठवण्यात अडचण आली."
        );
      }


    } catch (error) {

      console.error(error);

      toast.error(
        "काहीतरी चूक झाली."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <Button
      onClick={sendReport}
      disabled={loading}
      variant="outline"
      className="
        gap-2
        h-10
      "
    >

      <FileText
        className="h-4 w-4"
      />


      {
        loading
          ? "पाठवत आहे..."
          : "आजचा रिपोर्ट पाठवा"
      }


    </Button>
  );
}