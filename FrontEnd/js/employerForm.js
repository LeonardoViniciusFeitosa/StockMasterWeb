import { getJSON, postJSON, putJSON } from "./api.js";
import { getQueryId, initShell, setButtonLoading, showAlert } from "./common.js";

initShell("employer-form");

const employerId = getQueryId();
const form = document.getElementById("employerForm");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");
const button = document.getElementById("saveButton");

if (employerId) {
    title.textContent = "Editar Funcionario";
    subtitle.textContent = "Atualize os dados do funcionario";
    button.textContent = "Salvar Alteracoes";
    loadEmployer();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        personalId: document.getElementById("personalId").value.trim(),
        address: document.getElementById("address").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        role: document.getElementById("role").value.trim(),
        email: document.getElementById("email").value.trim(),
        notes: document.getElementById("notes").value.trim()
    };

    setButtonLoading(button, true, button.textContent);

    try {
        if (employerId) {
            await putJSON(`/employer/${employerId}`, payload);
            showAlert("Funcionario atualizado com sucesso.", "success");
        } else {
            await postJSON("/employer", payload);
            form.reset();
            showAlert("Funcionario cadastrado com sucesso.", "success");
        }
    } catch (error) {
        showAlert(error.message);
    } finally {
        setButtonLoading(button, false, button.textContent);
    }
});

async function loadEmployer() {
    try {
        const employer = await getJSON(`/employer/${employerId}`);
        document.getElementById("name").value = employer.name || "";
        document.getElementById("personalId").value = employer.personalId || "";
        document.getElementById("address").value = employer.address || "";
        document.getElementById("phoneNumber").value = employer.phoneNumber || "";
        document.getElementById("role").value = employer.role || "";
        document.getElementById("email").value = employer.email || "";
        document.getElementById("notes").value = employer.notes || "";
    } catch (error) {
        showAlert(error.message);
    }
}
