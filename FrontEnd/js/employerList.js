import { escapeHtml } from "./common.js";
import { initCrudList } from "./crudList.js";

initCrudList({
    pageKey: "employer-list",
    endpoint: "/employer",
    editHref: "newEmployer.html",
    emptyMessage: "Nenhum funcionario cadastrado.",
    columns: [
        { render: (item) => escapeHtml(item.id) },
        { render: (item) => escapeHtml(item.name) },
        { render: (item) => escapeHtml(item.personalId) },
        { render: (item) => escapeHtml(item.role) },
        { render: (item) => escapeHtml(item.email) }
    ]
});
