import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/google/dashboard";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { dailyReportMessage } from "@/lib/whatsapp/templates";

export async function POST() {
    try {
        const stats = await getDashboardStats();

        await sendWhatsAppMessage({
            to: "918261819381",
            message: dailyReportMessage(
                stats.todaySales,
                stats.todayRevenue,
                stats.paidRevenue,
                stats.creditRevenue
            ),
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
            },
            {
                status: 500,
            }
        );
    }
}