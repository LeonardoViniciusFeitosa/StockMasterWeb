import { products, sales } from "./FakeDatabase.js";

const today = new Date();

const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);


// Funções 
function isToday(date) {
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isThisMonth(date) {
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Métricas

const totalStock = products.reduce((t, p) => t + p.quantity, 0);

const lowStockCount = products.filter(p => p.quantity < 15).length;

const dailySales = sales.filter(s => isToday(s.saleDate));
const dailySalesCount = dailySales.length;

const monthlySales = sales.filter(s => isThisMonth(s.saleDate));
const monthlySalesCount = monthlySales.length;

const dailySalesValue = dailySales.reduce((t, s) => t + s.value, 0).toFixed(2);
const dailyProfit = dailySales.reduce((t, s) => t + s.profit, 0);

const monthlySalesValue = monthlySales.reduce((t, s) => t + s.value, 0).toFixed(2);
const monthlyProfit = monthlySales.reduce((t, s) => t + s.profit, 0);

// Inserir no HTML

document.getElementById("total").textContent = totalStock;

document.getElementById("lowStockCount").textContent = lowStockCount;

document.getElementById("dailySalesCount").textContent = dailySalesCount;

document.getElementById("monthlySalesCount").textContent = monthlySalesCount;

document.getElementById("monthlySalesValue").textContent = "R$" + formatBRL(monthlySalesValue);
document.getElementById("monthlyProfit").textContent = "R$" + formatBRL(monthlyProfit);

document.getElementById("dailySalesValue").textContent = "R$" +  formatBRL(dailySalesValue);
document.getElementById("dailyProfit").textContent = "R$" + formatBRL(dailyProfit);