import { getJSON, postJSON } from "./api.js";
import { calculateSaleTotals, confirmAction, formatMoney, initShell, setButtonLoading, showAlert } from "./common.js";

initShell("sale-form");

const customerSelect = document.getElementById("customerId");
const dateInput = document.getElementById("saleDate");
const productSelect = document.getElementById("productId");
const quantityInput = document.getElementById("quantity");
const itemValueInput = document.getElementById("itemValue");
const addItemButton = document.getElementById("addItemButton");
const finishSaleButton = document.getElementById("finishSale");
const tbody = document.getElementById("saleItemsBody");
const totalValue = document.getElementById("totalValue");
const profitValue = document.getElementById("profitValue");

let products = [];
let items = [];
let editingIndex = null;

dateInput.value = new Date().toISOString().slice(0, 10);
loadBaseData();

productSelect.addEventListener("change", updateItemValue);
quantityInput.addEventListener("input", updateItemValue);

addItemButton.addEventListener("click", () => {
    const productId = Number(productSelect.value);
    const quantity = Number(quantityInput.value);

    if (!productId || quantity <= 0) {
        showAlert("Selecione um produto e informe uma quantidade valida.");
        return;
    }

    if (editingIndex === null) {
        items.push({ productId, quantity });
    } else {
        items[editingIndex] = { productId, quantity };
        editingIndex = null;
        addItemButton.textContent = "Adicionar";
        addItemButton.classList.remove("btn-warning");
        addItemButton.classList.add("btn-primary");
    }

    productSelect.value = "";
    quantityInput.value = 1;
    updateItemValue();
    renderItems();
});

tbody.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    const index = Number(event.target.dataset.index);

    if (action === "edit") {
        const item = items[index];
        productSelect.value = item.productId;
        quantityInput.value = item.quantity;
        editingIndex = index;
        addItemButton.textContent = "Salvar Item";
        addItemButton.classList.remove("btn-primary");
        addItemButton.classList.add("btn-warning");
        updateItemValue();
    }

    if (action === "delete") {
        items.splice(index, 1);
        renderItems();
    }
});

finishSaleButton.addEventListener("click", async () => {
    if (!customerSelect.value) {
        showAlert("Selecione um cliente para concluir a venda.");
        return;
    }

    if (!items.length) {
        showAlert("Adicione pelo menos um item na venda.");
        return;
    }

    const confirmed = await confirmAction("Deseja concluir esta venda?");
    if (!confirmed) {
        return;
    }

    const payload = {
        customerId: Number(customerSelect.value),
        date: dateInput.value,
        items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
        }))
    };

    setButtonLoading(finishSaleButton, true, finishSaleButton.textContent, "Salvando...");

    try {
        await postJSON("/sales", payload);
        items = [];
        editingIndex = null;
        addItemButton.textContent = "Adicionar";
        addItemButton.classList.remove("btn-warning");
        addItemButton.classList.add("btn-primary");
        renderItems();
        document.getElementById("saleForm").reset();
        dateInput.value = new Date().toISOString().slice(0, 10);
        quantityInput.value = 1;
        itemValueInput.value = "";
        showAlert("Venda cadastrada com sucesso.", "success");
    } catch (error) {
        showAlert(error.message);
    } finally {
        setButtonLoading(finishSaleButton, false, finishSaleButton.textContent);
    }
});

async function loadBaseData() {
    try {
        const [customersResponse, productsResponse] = await Promise.all([
            getJSON("/customer"),
            getJSON("/product")
        ]);

        products = productsResponse || [];

        customerSelect.innerHTML = `<option value="">Selecione...</option>${customersResponse.map((customer) =>
            `<option value="${customer.id}">${customer.name}</option>`).join("")}`;

        productSelect.innerHTML = `<option value="">Selecione...</option>${products.map((product) =>
            `<option value="${product.id}">${product.name}</option>`).join("")}`;
    } catch (error) {
        showAlert(error.message);
    }
}

function updateItemValue() {
    const product = products.find((item) => item.id === Number(productSelect.value));
    const quantity = Number(quantityInput.value || 0);

    itemValueInput.value = product ? formatMoney(Number(product.sellValue || 0) * quantity) : "";
}

function renderItems() {
    if (!items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-muted py-4">Nenhum item adicionado.</td>
            </tr>
        `;
        totalValue.value = formatMoney(0);
        profitValue.value = formatMoney(0);
        return;
    }

    tbody.innerHTML = items.map((item, index) => {
        const product = products.find((entry) => entry.id === item.productId);
        const lineTotal = Number(product?.sellValue || 0) * item.quantity;

        return `
            <tr>
                <td>${product?.name || "-"}</td>
                <td>${item.quantity}</td>
                <td>${formatMoney(lineTotal)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-warning" data-action="edit" data-index="${index}">Editar</button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-index="${index}">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    const detailedItems = items.map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return {
            quantity: item.quantity,
            product: {
                sellValue: Number(product?.sellValue || 0),
                costValue: Number(product?.costValue || 0)
            }
        };
    });

    const totals = calculateSaleTotals(detailedItems);
    totalValue.value = formatMoney(totals.total);
    profitValue.value = formatMoney(totals.profit);
}
