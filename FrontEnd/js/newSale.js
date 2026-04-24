import {
    products,
    customers,
    sales,
    getProductById,
    getCustomerById
} from "./FakeDatabase.js";

// ========================
// ESTADO
// ========================

let currentSale = {
    customerId: null,
    address: "",
    items: []
};

let editIndex = null;

// guarda valor anterior do endereço (ESSENCIAL)
let previousAddress = "";

// trava pra não disparar loop
let addressLock = false;

// ========================
// ELEMENTOS
// ========================

let productSelect;
let quantityInput;
let valueInput;
let customerSelect;
let addressInput;
let mainButton;
let totalInput;
let profitInput;
let finishButton;

// ========================
// ALERTA
// ========================

function showAlert(message, type = "danger") {
    const container = document.getElementById("alertContainer");

    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show shadow" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    container.appendChild(wrapper);

    setTimeout(() => wrapper.remove(), 3000);
}

// ========================
// MODAL (FUNCIONANDO DE VERDADE)
// ========================

function showConfirmModal(message, onConfirm, onCancel) {
    const modalElement = document.getElementById("confirmModal");
    const modal = new bootstrap.Modal(modalElement);

    document.getElementById("confirmMessage").textContent = message;

    const confirmBtn = document.getElementById("confirmAction");

    // remove eventos antigos (IMPORTANTE)
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    let canceled = true;

    newConfirmBtn.addEventListener("click", () => {
        canceled = false;
        onConfirm?.();
        modal.hide();
    });

    modalElement.addEventListener("hidden.bs.modal", () => {
        if (canceled) {
            onCancel?.();
        }
    }, { once: true });

    modal.show();
}

// ========================
// QUANTIDADE
// ========================

function increment() {
    quantityInput.value = parseInt(quantityInput.value) + 1;
    calculateValue();
}

function decrement() {
    const value = parseInt(quantityInput.value);
    if (value > 1) {
        quantityInput.value = value - 1;
        calculateValue();
    }
}

// ========================
// VALOR ITEM
// ========================

function calculateValue() {
    const productId = parseInt(productSelect.value);

    if (!productId) {
        valueInput.value = "";
        return;
    }

    const product = getProductById(productId);
    const quantity = parseInt(quantityInput.value) || 1;

    const total = product.sellValue * quantity;

    valueInput.value = `R$ ${total.toFixed(2)}`;
}

// ========================
// RESUMO
// ========================

function updateSummary() {
    let total = 0;
    let profit = 0;

    currentSale.items.forEach(item => {
        const product = getProductById(item.productId);

        total += product.sellValue * item.quantity;
        profit += (product.sellValue - product.costValue) * item.quantity;
    });

    totalInput.value = total ? `R$ ${total.toFixed(2)}` : "";
    profitInput.value = profit ? `R$ ${profit.toFixed(2)}` : "";
}

// ========================
// ITENS (SEM ALTERAÇÃO)
// ========================

function addItem() {
    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);

    if (!productId) {
        showAlert("Selecione um produto.", "warning");
        return;
    }

    currentSale.items.push({ productId, quantity });

    renderTable();
    clearForm();
}

function updateItem() {
    const productId = parseInt(productSelect.value);
    const quantity = parseInt(quantityInput.value);

    currentSale.items[editIndex] = { productId, quantity };

    editIndex = null;

    renderTable();
    clearForm();
    resetButton();
}

function editItem(index) {
    const item = currentSale.items[index];

    productSelect.value = item.productId;
    quantityInput.value = item.quantity;

    editIndex = index;

    calculateValue();

    mainButton.textContent = "Salvar";
    mainButton.classList.remove("btn-primary");
    mainButton.classList.add("btn-warning");
}

function deleteItem(index) {
    showConfirmModal("Deseja remover este item?", () => {
        currentSale.items.splice(index, 1);
        renderTable();
    });
}

function clearForm() {
    productSelect.value = "";
    quantityInput.value = 1;
    valueInput.value = "";
}

function resetButton() {
    mainButton.textContent = "Cadastrar";
    mainButton.classList.remove("btn-warning");
    mainButton.classList.add("btn-primary");
}

// ========================
// SELECTS (SEM ALTERAÇÃO)
// ========================

function loadCustomers() {
    customerSelect.innerHTML = `<option value="">Selecione...</option>`;

    customers.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        customerSelect.appendChild(option);
    });
}

function loadProducts() {
    productSelect.innerHTML = `<option value="">Selecione...</option>`;

    products.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.name;
        productSelect.appendChild(option);
    });
}

// ========================
// TABELA (SEM ALTERAÇÃO)
// ========================

function renderTable() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    currentSale.items.forEach((item, index) => {
        const product = getProductById(item.productId);
        const total = product.sellValue * item.quantity;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${item.quantity}</td>
            <td>R$ ${total.toFixed(2)}</td>
            <td>
                <button class="btn btn-warning me-2" onclick="editItem(${index})">✏</button>
                <button class="btn btn-danger" onclick="deleteItem(${index})">🗑</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    for (let i = currentSale.items.length; i < 3; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>-</td><td>-</td><td>-</td><td>-</td>`;
        tbody.appendChild(tr);
    }

    updateSummary();
}

// ========================
// CLIENTE (SEM ALTERAÇÃO)
// ========================

function handleCustomerChange() {
    const id = parseInt(customerSelect.value);

    if (!id) {
        currentSale.customerId = null;
        currentSale.address = "";
        addressInput.value = "";
        return;
    }

    const customer = getCustomerById(id);

    if (
        currentSale.address &&
        customer.address &&
        currentSale.address !== customer.address
    ) {
        showConfirmModal(
            "Deseja substituir o endereço pelo do cliente?",
            () => {
                currentSale.customerId = id;
                currentSale.address = customer.address;
                addressInput.value = customer.address;
                previousAddress = customer.address;
            },
            () => {
                customerSelect.value = currentSale.customerId || "";
            }
        );
    } else {
        currentSale.customerId = id;
        currentSale.address = customer.address || "";
        addressInput.value = currentSale.address;
        previousAddress = currentSale.address;
    }
}

// ========================
// ENDEREÇO (CORRIGIDO DE VERDADE)
// ========================

function handleAddressChange() {
    if (addressLock) return;

    const typed = addressInput.value;

    const customer = getCustomerById(currentSale.customerId);

    if (!customer || !customer.address) {
        currentSale.address = typed;
        previousAddress = typed;
        return;
    }

    if (typed === customer.address) {
        currentSale.address = typed;
        previousAddress = typed;
        return;
    }

    addressLock = true;

    showConfirmModal(
        "O endereço é diferente do cliente. Deseja manter o novo endereço?",
        () => {
            currentSale.address = typed;
            previousAddress = typed;
            addressLock = false;
        },
        () => {
            addressInput.value = previousAddress || customer.address;
            currentSale.address = addressInput.value;
            addressLock = false;
        }
    );
}

// ========================
// FINALIZAR (SEM ALTERAÇÃO)
// ========================

function finishSale() {
    if (currentSale.items.length === 0) {
        showAlert("Adicione itens antes de finalizar.", "danger");
        return;
    }

    showConfirmModal("Confirmar venda?", () => {
        sales.push({
            id: sales.length + 1,
            customerId: currentSale.customerId,
            address: currentSale.address,
            saleDate: new Date(),
            items: [...currentSale.items]
        });

        currentSale = {
            customerId: null,
            address: "",
            items: []
        };

        renderTable();
        clearForm();
        resetButton();

        totalInput.value = "";
        profitInput.value = "";
        customerSelect.value = "";
        addressInput.value = "";

        showAlert("Venda cadastrada!", "success");
    });
}

// ========================
// INIT
// ========================

document.addEventListener("DOMContentLoaded", () => {
    productSelect = document.getElementById("product");
    quantityInput = document.getElementById("quantity");
    valueInput = document.getElementById("value");
    customerSelect = document.getElementById("customer");
    addressInput = document.getElementById("address");
    mainButton = document.getElementById("mainButton");
    totalInput = document.getElementById("totalValue");
    profitInput = document.getElementById("profitValue");
    finishButton = document.getElementById("finishSale");

    loadCustomers();
    loadProducts();
    renderTable();

    productSelect.addEventListener("change", calculateValue);
    quantityInput.addEventListener("input", calculateValue);
    customerSelect.addEventListener("change", handleCustomerChange);
    addressInput.addEventListener("input", handleAddressChange);

    mainButton.addEventListener("click", () => {
        if (editIndex !== null) updateItem();
        else addItem();
    });

    finishButton.addEventListener("click", finishSale);
});

// ========================
// GLOBAL
// ========================

window.increment = increment;
window.decrement = decrement;
window.editItem = editItem;
window.deleteItem = deleteItem;