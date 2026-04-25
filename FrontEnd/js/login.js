import { postJSON } from "./api.js";
import { getQueryParam, requireAuthenticatedUser, setButtonLoading, showAlert } from "./common.js";

const form = document.getElementById("loginForm");
const button = document.getElementById("loginButton");

tryAutoRedirect();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value
    };

    setButtonLoading(button, true, button.textContent, "Entrando...");

    try {
        await postJSON("/auth/login", payload);
        const redirect = getQueryParam("redirect") || "Dashboard.html";
        window.location.href = redirect;
    } catch (error) {
        showAlert(error.message);
    } finally {
        setButtonLoading(button, false, button.textContent);
    }
});

async function tryAutoRedirect() {
    try {
        await requireAuthenticatedUser();
        window.location.href = getQueryParam("redirect") || "Dashboard.html";
    } catch {
        // permanece na tela de login
    }
}
