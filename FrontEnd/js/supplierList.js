import { escapeHtml } from "./common.js";
import { initCrudList } from "./crudList.js";

initCrudList({
    pageKey: "supplier-list",
    endpoint: "/supplier",
    editHref: "newSupplier.html",
    emptyMessage: "Nenhum fornecedor cadastrado.",
    columns: [
        { render: (item) => escapeHtml(item.id) },
        { render: (item) => escapeHtml(item.name) },
        { render: (item) => escapeHtml(item.taxId) },
        { render: (item) => escapeHtml(item.phoneNumber) },
        { render: (item) => escapeHtml(item.email) }
    ]
});
