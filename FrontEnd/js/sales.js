import { sales, getCustomerById, getProductById } from "./FakeDatabase.js";

function formatMoney(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR");
}

function deleteSale(id) {
    const index = sales.findIndex(s => s.id === id);

    if (index !== -1) {
        sales.splice(index, 1);
        renderSalesTable();
    }
}

function renderSalesTable() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    if (sales.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-muted">Nenhuma venda cadastrada</td>
            </tr>
        `;
        return;
    }

    sales.forEach(sale => {
        const customer = getCustomerById(sale.customerId);

        const itemsText = sale.items.map(item => {
            const product = getProductById(item.productId);
            return `${product.name} (${item.quantity})`;
        }).join(", ");

        tbody.innerHTML += `
            <tr>
                <td>${sale.id}</td>
                <td>${customer?.name ?? "N/A"}</td>
                <td>${formatDate(sale.saleDate)}</td>
                <td>${itemsText}</td>
                <td>${formatMoney(sale.value)}</td>
                <td>${formatMoney(sale.profit)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteSale(${sale.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

window.deleteSale = deleteSale;

renderSalesTable();