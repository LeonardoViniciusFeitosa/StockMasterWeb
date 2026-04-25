import { getJSON, postJSON } from "./api.js";

const NAV_GROUPS = [
    {
        key: "dashboard",
        icon: "fa-chart-line",
        label: "Dashboard",
        href: "Dashboard.html"
    },
    {
        key: "sales",
        icon: "fa-money-bills",
        label: "Vendas",
        items: [
            { key: "sale-form", label: "Cadastrar Venda", href: "newSale.html" },
            { key: "sale-list", label: "Ultimas Vendas", href: "SaleList.html" }
        ]
    },
    {
        key: "stock",
        icon: "fa-box-open",
        label: "Estoque",
        items: [
            { key: "movement-form", label: "Nova Movimentacao", href: "newMovimentation.html" },
            { key: "movement-list", label: "Lista de Movimentacoes", href: "MovementList.html" }
        ]
    },
    {
        key: "products",
        icon: "fa-bag-shopping",
        label: "Produtos",
        items: [
            { key: "product-form", label: "Cadastrar Produto", href: "newProduct.html" },
            { key: "product-list", label: "Lista de Produtos", href: "ProductList.html" }
        ]
    },
    {
        key: "customers",
        icon: "fa-person-walking-luggage",
        label: "Clientes",
        items: [
            { key: "customer-form", label: "Cadastrar Cliente", href: "newCustomer.html" },
            { key: "customer-list", label: "Lista de Clientes", href: "CustomerList.html" }
        ]
    },
    {
        key: "suppliers",
        icon: "fa-people-carry-box",
        label: "Fornecedores",
        items: [
            { key: "supplier-form", label: "Cadastrar Fornecedor", href: "newSupplier.html" },
            { key: "supplier-list", label: "Lista de Fornecedores", href: "SupplierList.html" }
        ]
    },
    {
        key: "employers",
        icon: "fa-users-gear",
        label: "Funcionarios",
        items: [
            { key: "employer-form", label: "Cadastrar Funcionario", href: "newEmployer.html" },
            { key: "employer-list", label: "Lista de Funcionarios", href: "EmployerList.html" }
        ]
    }
];

let currentUserPromise;

function getCurrentGroup(pageKey) {
    for (const group of NAV_GROUPS) {
        if (group.key === pageKey) {
            return group.key;
        }
        if (group.items?.some((item) => item.key === pageKey)) {
            return group.key;
        }
    }
    return "";
}

function renderNav(prefix, activePage) {
    const activeGroup = getCurrentGroup(activePage);

    return NAV_GROUPS.map((group) => {
        if (!group.items) {
            const activeClass = activePage === group.key ? "active" : "";
            return `
                <a href="${group.href}" class="sidebar-link text-decoration-none text-white fs-5 mb-2 ${activeClass}">
                    <i class="fa-solid ${group.icon} me-2"></i>
                    ${group.label}
                </a>
            `;
        }

        const collapseId = `${prefix}-${group.key}`;
        const activeClass = activeGroup === group.key ? "active" : "";
        const collapseClass = activeGroup === group.key ? "collapse submenu mb-2 show" : "collapse submenu mb-2";

        const items = group.items.map((item) => {
            const itemClass = item.key === activePage ? "submenu-link-active" : "";
            return `
                <a href="${item.href}" class="d-block ms-5 text-white text-decoration-none submenu-link ${itemClass}">
                    • ${item.label}
                </a>
            `;
        }).join("");

        return `
            <a href="#${collapseId}" class="sidebar-link text-decoration-none text-white fs-5 mb-2 ${activeClass}" data-bs-toggle="collapse">
                <i class="fa-solid ${group.icon} me-2"></i>
                ${group.label}
            </a>
            <div class="${collapseClass}" id="${collapseId}">
                ${items}
            </div>
        `;
    }).join("");
}

export function initShell(activePage) {
    const headerMount = document.getElementById("headerMount");
    const sidebarMount = document.getElementById("sidebarMount");
    const offcanvasMount = document.getElementById("offcanvasMount");
    const modalMount = document.getElementById("modalMount");

    if (headerMount) {
        headerMount.innerHTML = `
            <header class="shadow px-4 py-2">
                <div class="container-fluid d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <img src="media/img/Logo.png" class="logotype me-2" alt="Logo">
                        <span class="text-primary fw-bold fs-4">StockMaster</span>
                    </div>
                    <div class="d-none d-xl-flex align-items-center gap-3">
                        <span class="text-secondary fs-5">Projeto Integrador</span>
                        <div class="vr"></div>
                        <span class="d-flex align-items-center gap-2 text-secondary">
                            <i class="fa-solid fa-circle-user fs-3"></i>
                            <span class="fs-5" id="currentUserName">Carregando...</span>
                        </span>
                        <div class="vr"></div>
                        <button type="button" id="logoutButtonDesktop" class="header-action-btn">Sair</button>
                    </div>
                    <button class="btn d-xl-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu" aria-label="Abrir menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2.5 12.5a.5.5 0 010-1h11a.5.5 0 010 1h-11zm0-4a.5.5 0 010-1h11a.5.5 0 010 1h-11zm0-4a.5.5 0 010-1h11a.5.5 0 010 1h-11z" />
                        </svg>
                    </button>
                </div>
            </header>
        `;
    }

    if (sidebarMount) {
        sidebarMount.className = "col-xl-2 d-none d-xl-block sidebar shadow-lg bg-primary px-0 py-3";
        sidebarMount.innerHTML = `<nav class="sidebar-menu">${renderNav("desktop", activePage)}</nav>`;
    }

    if (offcanvasMount) {
        offcanvasMount.innerHTML = `
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasMenu">
                <div class="offcanvas-header">
                    <div>
                        <h5 class="offcanvas-title mb-0">Menu</h5>
                        <small class="text-muted" id="currentUserNameMobile">Carregando...</small>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div class="offcanvas-body bg-primary">
                    <nav class="sidebar-menu">${renderNav("mobile", activePage)}</nav>
                    <button type="button" id="logoutButtonMobile" class="btn btn-light w-100 mt-3">Sair</button>
                </div>
            </div>
        `;
    }

    if (modalMount) {
        modalMount.innerHTML = `
            <div class="modal fade" id="confirmModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Confirmacao</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p id="confirmMessage" class="mb-0"></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="confirmAction">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachAuthState();
}

async function attachAuthState() {
    try {
        const user = await requireAuthenticatedUser();
        const name = user.displayName || user.username;
        const desktopName = document.getElementById("currentUserName");
        const mobileName = document.getElementById("currentUserNameMobile");

        if (desktopName) {
            desktopName.textContent = name;
        }
        if (mobileName) {
            mobileName.textContent = name;
        }

        document.getElementById("logoutButtonDesktop")?.addEventListener("click", logout);
        document.getElementById("logoutButtonMobile")?.addEventListener("click", logout);
    } catch {
        redirectToLogin();
    }
}

export function requireAuthenticatedUser() {
    if (!currentUserPromise) {
        currentUserPromise = getJSON("/auth/me");
    }
    return currentUserPromise;
}

export async function logout() {
    try {
        await postJSON("/auth/logout", {});
    } catch {
        // noop
    } finally {
        currentUserPromise = null;
        redirectToLogin();
    }
}

export function redirectToLogin() {
    const current = window.location.pathname.split("/").pop() || "Dashboard.html";
    window.location.href = `login.html?redirect=${encodeURIComponent(current)}`;
}

export function showAlert(message, type = "danger") {
    const container = document.getElementById("alertContainer");
    if (!container) {
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show shadow" role="alert">
            ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    container.appendChild(wrapper);
    setTimeout(() => wrapper.remove(), 4000);
}

export function confirmAction(message) {
    const modalElement = document.getElementById("confirmModal");
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmActionButton = document.getElementById("confirmAction");

    if (!modalElement || !confirmMessage || !confirmActionButton) {
        return Promise.resolve(window.confirm(message));
    }

    confirmMessage.textContent = message;
    const modal = new bootstrap.Modal(modalElement);

    return new Promise((resolve) => {
        const newButton = confirmActionButton.cloneNode(true);
        confirmActionButton.parentNode.replaceChild(newButton, confirmActionButton);
        let confirmed = false;

        newButton.addEventListener("click", () => {
            confirmed = true;
            modal.hide();
            resolve(true);
        });

        modalElement.addEventListener("hidden.bs.modal", () => {
            if (!confirmed) {
                resolve(false);
            }
        }, { once: true });

        modal.show();
    });
}

export function formatMoney(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export function formatDate(value) {
    if (!value) {
        return "-";
    }

    const date = typeof value === "string" && value.length <= 10
        ? new Date(`${value}T00:00:00`)
        : new Date(value);

    return date.toLocaleDateString("pt-BR");
}

export function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

export function getQueryId() {
    const id = getQueryParam("id");
    return id ? Number(id) : null;
}

export function setButtonLoading(button, loading, originalText, loadingText = "Salvando...") {
    if (!button) {
        return;
    }

    if (!button.dataset.originalText) {
        button.dataset.originalText = originalText || button.textContent;
    }

    button.disabled = loading;
    button.textContent = loading ? loadingText : button.dataset.originalText;
}

export function calculateSaleTotals(items) {
    return items.reduce((accumulator, item) => {
        const quantity = Number(item.quantity || 0);
        const sellValue = Number(item.sellValue ?? item.product?.sellValue ?? 0);
        const costValue = Number(item.costValue ?? item.product?.costValue ?? 0);

        accumulator.total += sellValue * quantity;
        accumulator.profit += (sellValue - costValue) * quantity;
        return accumulator;
    }, { total: 0, profit: 0 });
}
