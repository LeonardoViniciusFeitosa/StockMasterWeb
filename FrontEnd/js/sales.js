import { deleteJSON, getJSON } from "./api.js";
import { calculateSaleTotals, confirmAction, formatDate, formatMoney, initShell, showAlert } from "./common.js";

initShell("sale-list");

const tbody = document.getElementById("salesTableBody");

tbody.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-sale-id]");
    if (!button) {
        return;
    }

    const confirmed = await confirmAction("Deseja excluir esta venda?");
    if (!confirmed) {
        return;
    }

    try {
        await deleteJSON(`/sales/${button.dataset.saleId}`);
        showAlert("Venda excluida com sucesso.", "success");
        await loadSales();
    } catch (error) {
        showAlert(error.message);
    }
});

loadSales();

async function loadSales() {
    try {
        const sales = await getJSON("/sales");

        if (!sales.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-muted py-4">Nenhuma venda cadastrada.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = sales.map((sale) => {
            const totals = calculateSaleTotals(sale.items || []);
            const itemsText = (sale.items || []).map((item) =>
                `${item.product?.name || "Produto"} (${item.quantity})`).join(", ");

            return `
                <tr>
                    <td>${sale.id}</td>
                    <td>${sale.customer?.name || "-"}</td>
                    <td>${formatDate(sale.saleDate)}</td>
                    <td>${itemsText || "-"}</td>
                    <td>${formatMoney(totals.total)}</td>
                    <td>${formatMoney(totals.profit)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" data-sale-id="${sale.id}">Excluir</button>
                    </td>
                </tr>
            `;
        }).join("");
    } catch (error) {
        showAlert(error.message);
    }
}
