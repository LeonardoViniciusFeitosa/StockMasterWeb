import { getJSON, postJSON } from "./api.js";
import { initShell, setButtonLoading, showAlert } from "./common.js";

initShell("movement-form");

const form = document.getElementById("movementForm");
const button = document.getElementById("saveButton");
const productSelect = document.getElementById("productId");
document.getElementById("movementDate").value = new Date().toISOString().slice(0, 10);

loadProducts();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        productId: Number(productSelect.value),
        quantity: Number(document.getElementById("quantity").value),
        movementType: document.getElementById("movementType").value,
        movementDate: document.getElementById("movementDate").value,
        notes: document.getElementById("notes").value.trim()
    };

    setButtonLoading(button, true, button.textContent);

    try {
        await postJSON("/stockMovement", payload);
        form.reset();
        document.getElementById("movementDate").value = new Date().toISOString().slice(0, 10);
        showAlert("Movimentacao cadastrada com sucesso.", "success");
    } catch (error) {
        showAlert(error.message);
    } finally {
        setButtonLoading(button, false, button.textContent);
    }
});

async function loadProducts() {
    try {
        const products = await getJSON("/product");
        productSelect.innerHTML = `<option value="">Selecione...</option>${products.map((product) =>
            `<option value="${product.id}">${product.name}</option>`).join("")}`;
    } catch (error) {
        showAlert(error.message);
    }
}
