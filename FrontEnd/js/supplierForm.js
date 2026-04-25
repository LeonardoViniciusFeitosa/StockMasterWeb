import { getJSON, postJSON, putJSON } from "./api.js";
import { getQueryId, initShell, setButtonLoading, showAlert } from "./common.js";

initShell("supplier-form");

const supplierId = getQueryId();
const form = document.getElementById("supplierForm");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");
const button = document.getElementById("saveButton");

if (supplierId) {
    title.textContent = "Editar Fornecedor";
    subtitle.textContent = "Atualize os dados do fornecedor";
    button.textContent = "Salvar Alteracoes";
    loadSupplier();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        taxId: document.getElementById("taxId").value.trim(),
        address: document.getElementById("address").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        email: document.getElementById("email").value.trim(),
        notes: document.getElementById("notes").value.trim()
    };

    setButtonLoading(button, true, button.textContent);

    try {
        if (supplierId) {
            await putJSON(`/supplier/${supplierId}`, payload);
            showAlert("Fornecedor atualizado com sucesso.", "success");
        } else {
            await postJSON("/supplier", payload);
            form.reset();
            showAlert("Fornecedor cadastrado com sucesso.", "success");
        }
    } catch (error) {
        showAlert(error.message);
    } finally {
        setButtonLoading(button, false, button.textContent);
    }
});

async function loadSupplier() {
    try {
        const supplier = await getJSON(`/supplier/${supplierId}`);
        document.getElementById("name").value = supplier.name || "";
        document.getElementById("taxId").value = supplier.taxId || "";
        document.getElementById("address").value = supplier.address || "";
        document.getElementById("phoneNumber").value = supplier.phoneNumber || "";
        document.getElementById("email").value = supplier.email || "";
        document.getElementById("notes").value = supplier.notes || "";
    } catch (error) {
        showAlert(error.message);
    }
}
