import { getJSON } from "./api.js";
import { calculateSaleTotals, formatMoney, initShell, showAlert } from "./common.js";

initShell("dashboard");

loadDashboard();

async function loadDashboard() {
    try {
        const [products, sales] = await Promise.all([
            getJSON("/product"),
            getJSON("/sales")
        ]);

        const today = new Date();
        const totalStock = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
        const lowStock = products.filter((product) => Number(product.quantity || 0) < 15).length;
        const dailySales = sales.filter((sale) => isSameDay(sale.saleDate, today));
        const monthlySales = sales.filter((sale) => isSameMonth(sale.saleDate, today));

        const dailyTotals = sumSales(dailySales);
        const monthlyTotals = sumSales(monthlySales);

        document.getElementById("total").textContent = totalStock;
        document.getElementById("lowStockCount").textContent = lowStock;
        document.getElementById("dailySalesCount").textContent = dailySales.length;
        document.getElementById("monthlySalesCount").textContent = monthlySales.length;
        document.getElementById("monthlySalesValue").textContent = formatMoney(monthlyTotals.total);
        document.getElementById("monthlyProfit").textContent = formatMoney(monthlyTotals.profit);
        document.getElementById("dailySalesValue").textContent = formatMoney(dailyTotals.total);
        document.getElementById("dailyProfit").textContent = formatMoney(dailyTotals.profit);
    } catch (error) {
        showAlert(error.message);
    }
}

function sumSales(sales) {
    return sales.reduce((accumulator, sale) => {
        const totals = calculateSaleTotals(sale.items || []);
        accumulator.total += totals.total;
        accumulator.profit += totals.profit;
        return accumulator;
    }, { total: 0, profit: 0 });
}

function isSameDay(dateString, referenceDate) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.getDate() === referenceDate.getDate()
        && date.getMonth() === referenceDate.getMonth()
        && date.getFullYear() === referenceDate.getFullYear();
}

function isSameMonth(dateString, referenceDate) {
    const date = new Date(`${dateString}T00:00:00`);
    return date.getMonth() === referenceDate.getMonth()
        && date.getFullYear() === referenceDate.getFullYear();
}
