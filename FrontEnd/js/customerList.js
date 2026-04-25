import { escapeHtml } from "./common.js";
import { initCrudList } from "./crudList.js";

initCrudList({
    pageKey: "customer-list",
    endpoint: "/customer",
    editHref: "newCustomer.html",
    emptyMessage: "Nenhum cliente cadastrado.",
    columns: [
        { render: (item) => escapeHtml(item.id) },
        { render: (item) => escapeHtml(item.name) },
        { render: (item) => escapeHtml(item.personalId) },
        { render: (item) => escapeHtml(item.phoneNumber) },
        { render: (item) => escapeHtml(item.email) }
    ]
});
