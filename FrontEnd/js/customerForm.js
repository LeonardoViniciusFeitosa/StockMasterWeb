import { getJSON, postJSON, putJSON } from "./api.js";
import { getQueryId, initShell, setButtonLoading, showAlert } from "./common.js";

initShell("customer-form");

const customerId = getQueryId();
const form = document.getElementById("customerForm");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");
const button = document.getElementById("saveButton");

if (customerId) {
    title.textContent = "Editar Cliente";
    subtitle.textContent = "Atualize os dados do cliente";
    button.textContent = "Salvar Alteracoes";
}

if (customerId) {
    loadCustomer();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        personalId: document.getElementById("personalId").value.trim(),
        address: document.getElementById("address").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        email: document.getElementById("email").value.trim(),
        notes: document.getElementById("notes").value.trim()
    };

    setButtonLoading(button, true, button.textContent);

    try {
        if (customerId) {
            await putJSON(`/customer/${customerId}`, payload);
            showAlert("Cliente atualizado com sucesso.", "success");
        } else {
            await postJSON("/customer", payload);
            form.reset();
            showAlert("Cliente cadastrado com sucesso.", "success");
        }
    } catch (error) {
        showAlert(error.message);
    } finally {
        setButtonLoading(button, false, button.textContent);
    }
});

async function loadCustomer() {
    try {
        const customer = await getJSON(`/customer/${customerId}`);
        document.getElementById("name").value = customer.name || "";
        document.getElementById("personalId").value = customer.personalId || "";
        document.getElementById("address").value = customer.address || "";
        document.getElementById("phoneNumber").value = customer.phoneNumber || "";
        document.getElementById("email").value = customer.email || "";
        document.getElementById("notes").value = customer.notes || "";
    } catch (error) {
        showAlert(error.message);
    }
}
