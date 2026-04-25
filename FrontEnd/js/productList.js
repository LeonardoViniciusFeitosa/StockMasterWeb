import { formatMoney, escapeHtml } from "./common.js";
import { initCrudList } from "./crudList.js";

initCrudList({
    pageKey: "product-list",
    endpoint: "/product",
    editHref: "newProduct.html",
    emptyMessage: "Nenhum produto cadastrado.",
    columns: [
        { render: (item) => escapeHtml(item.id) },
        { render: (item) => escapeHtml(item.name) },
        { render: (item) => escapeHtml(item.category) },
        { render: (item) => escapeHtml(item.supplier?.name || "-") },
        { render: (item) => escapeHtml(item.quantity) },
        { render: (item) => formatMoney(item.sellValue) }
    ]
});
