import { deleteJSON, getJSON } from "./api.js";
import { confirmAction, escapeHtml, initShell, showAlert } from "./common.js";

export function initCrudList(config) {
    initShell(config.pageKey);

    const tbody = document.getElementById("entityTableBody");

    async function loadData() {
        try {
            const items = await getJSON(config.endpoint);
            renderRows(items || []);
        } catch (error) {
            showAlert(error.message);
        }
    }

    function renderRows(items) {
        if (!items.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="${config.columns.length + 1}" class="text-muted py-4">${escapeHtml(config.emptyMessage || "Nenhum registro encontrado.")}</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = items.map((item) => {
            const columns = config.columns.map((column) => `<td>${column.render(item)}</td>`).join("");

            const editButton = config.editHref
                ? `<a href="${config.editHref}?id=${item.id}" class="btn btn-sm btn-warning">Editar</a>`
                : "";
            const deleteButton = config.allowDelete !== false
                ? `<button class="btn btn-sm btn-danger" data-action="delete" data-id="${item.id}">Excluir</button>`
                : "";

            return `
                <tr>
                    ${columns}
                    <td class="d-flex justify-content-center gap-2 flex-wrap">
                        ${editButton}
                        ${deleteButton}
                    </td>
                </tr>
            `;
        }).join("");
    }

    tbody.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-action='delete']");
        if (!button) {
            return;
        }

        const confirmed = await confirmAction(config.deleteMessage || "Deseja excluir este registro?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteJSON(`${config.endpoint}/${button.dataset.id}`);
            showAlert("Registro excluido com sucesso.", "success");
            await loadData();
        } catch (error) {
            showAlert(error.message);
        }
    });

    loadData();
}
