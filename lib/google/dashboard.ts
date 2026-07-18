import { getSales } from "./sales";

export async function getDashboardStats() {
  const sales = await getSales();

  const today = new Date().toDateString();

  const todaySales = sales.filter(
    (sale) => new Date(sale.date).toDateString() === today
  );

  const todayRevenue = todaySales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const paidRevenue = todaySales
    .filter((sale) => sale.paymentStatus === "Paid")
    .reduce((sum, sale) => sum + sale.total, 0);

  const creditRevenue = todaySales
    .filter((sale) => sale.paymentStatus === "Credit")
    .reduce((sum, sale) => sum + sale.total, 0);

  const recentSales = sales
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 10);

  return {
    todayRevenue,
    todaySales: todaySales.length,
    paidRevenue,
    creditRevenue,
    recentSales,
  };
}