import { getJSON, postJSON, putJSON } from "./api.js";
import { getQueryId, initShell, setButtonLoading, showAlert } from "./common.js";

initShell("product-form");

const productId = getQueryId();
const form = document.getElementById("productForm");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");
const button = document.getElementById("saveButton");
const supplierSelect = document.getElementById("supplierId");
const categorySelect = document.getElementById("category");
const categories = ["Eletronico", "Papelaria", "Escritorio", "Limpeza", "Outros"];

loadCategories();
loadSuppliers();

if (productId) {
    title.textContent = "Editar Produto";
    subtitle.textContent = "Atualize os dados do produto";
    button.textContent = "Salvar Alteracoes";
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        category: categorySelect.value,
        supplier: { id: Number(supplierSelect.value) },
        quantity: Number(document.getElementById("quantity").value),
        costValue: Number(document.getElementById("costValue").value),
        sellValue: Number(document.getElementById("sellValue").value),
        notes: document.getElementById("notes").value.trim()
    };

    setButtonLoading(button, true, button.textContent);

    try {
        if (productId) {
            await putJSON(`/product/${productId}`, payload);
            showAlert("Produto atualizado com sucesso.", "success");
        } else {
            await postJSON("/product", payload);
            form.reset();
            showAlert("Produto cadastrado com sucesso.", "success");
        }
    } catch (error) {
        showAlert(error.message);
    } finally {
        setButtonLoading(button, false, button.textContent);
    }
});

async function loadSuppliers() {
    try {
        const suppliers = await getJSON("/supplier");
        supplierSelect.innerHTML = `<option value="">Selecione...</option>${suppliers.map((supplier) =>
            `<option value="${supplier.id}">${supplier.name}</option>`).join("")}`;

        if (productId) {
            await loadProduct();
        }
    } catch (error) {
        showAlert(error.message);
    }
}

async function loadProduct() {
    try {
        const product = await getJSON(`/product/${productId}`);
        document.getElementById("name").value = product.name || "";
        categorySelect.value = categories.includes(product.category) ? product.category : "";
        if (!categorySelect.value && product.category) {
            categorySelect.innerHTML += `<option value="${product.category}" selected>${product.category}</option>`;
        }
        supplierSelect.value = product.supplier?.id || "";
        document.getElementById("quantity").value = product.quantity ?? 0;
        document.getElementById("costValue").value = product.costValue ?? "";
        document.getElementById("sellValue").value = product.sellValue ?? "";
        document.getElementById("notes").value = product.notes || "";
    } catch (error) {
        showAlert(error.message);
    }
}

function loadCategories() {
    categorySelect.innerHTML = `<option value="">Selecione...</option>${categories.map((category) =>
        `<option value="${category}">${category}</option>`).join("")}`;
}
