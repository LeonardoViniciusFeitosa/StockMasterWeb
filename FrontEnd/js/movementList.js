import { escapeHtml, formatDate } from "./common.js";
import { initCrudList } from "./crudList.js";

initCrudList({
    pageKey: "movement-list",
    endpoint: "/stockMovement",
    emptyMessage: "Nenhuma movimentacao cadastrada.",
    columns: [
        { render: (item) => escapeHtml(item.id) },
        { render: (item) => formatDate(item.movementDate) },
        { render: (item) => escapeHtml(item.product?.name || "-") },
        { render: (item) => escapeHtml(item.movementType) },
        { render: (item) => escapeHtml(item.quantity) },
        { render: (item) => escapeHtml(item.notes || "-") }
    ]
});
