document.addEventListener("DOMContentLoaded", () => {
    const categoryModal = document.getElementById("categoryModal");
    const openCategoryModal = document.getElementById("openCategoryModal");
    const closeCategoryModalButtons = document.querySelectorAll("[data-close-category-modal]");
    const categoryForm = document.getElementById("categoryForm");
    const categoryTableBody = document.getElementById("categoryTableBody");
    const categorySearchInput = document.getElementById("categorySearchInput");
    const categoryFilterButtons = document.querySelectorAll("[data-category-filter]");
    const categoryCountText = document.getElementById("categoryCountText");
    const categoryName = document.getElementById("categoryName");
    const categorySlug = document.getElementById("categorySlug");
    let activeCategoryFilter = "all";

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

    const getCategoryRows = () => Array.from(document.querySelectorAll("[data-category-row]"));

    const slugify = (value) => value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const updateCategoryRows = () => {
        const searchValue = categorySearchInput ? categorySearchInput.value.trim().toLowerCase() : "";
        const rows = getCategoryRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeCategoryFilter === "all" || row.dataset.categoryStatus === activeCategoryFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (categoryCountText) {
            categoryCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    const closeCategoryModal = () => {
        if (!categoryModal) {
            return;
        }

        categoryModal.classList.remove("is-open");
        categoryModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("category-modal-open");
    };

    const openModal = () => {
        if (!categoryModal) {
            return;
        }

        categoryModal.classList.add("is-open");
        categoryModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("category-modal-open");
        categoryName?.focus();
    };

    if (openCategoryModal) {
        openCategoryModal.addEventListener("click", openModal);
    }

    closeCategoryModalButtons.forEach((button) => {
        button.addEventListener("click", closeCategoryModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && categoryModal?.classList.contains("is-open")) {
            closeCategoryModal();
        }
    });

    if (categoryName && categorySlug) {
        categoryName.addEventListener("input", () => {
            categorySlug.value = slugify(categoryName.value);
        });
    }

    categoryFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategoryFilter = button.dataset.categoryFilter;
            categoryFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateCategoryRows();
        });
    });

    if (categorySearchInput) {
        categorySearchInput.addEventListener("input", updateCategoryRows);
    }

    if (categoryTableBody) {
        categoryTableBody.addEventListener("click", (event) => {
            const deleteButton = event.target.closest(".danger");

            if (deleteButton) {
                deleteButton.closest("tr")?.remove();
                updateCategoryRows();
            }
        });
    }

    if (categoryForm && categoryTableBody) {
        categoryForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = categoryName.value.trim();
            const slug = categorySlug.value.trim() || slugify(name);
            const description = document.getElementById("categoryDescription").value.trim() || "New category";
            const type = document.getElementById("categoryType").value;
            const order = document.getElementById("categoryOrder").value || "1";
            const items = document.getElementById("categoryItems").value || "0";
            const status = document.getElementById("categoryStatus").value;
            const icon = document.getElementById("categoryIcon").value;
            const statusClass = status === "inactive" ? "" : "active";

            if (!name) {
                alert("Please enter category name.");
                return;
            }

            categoryTableBody.insertAdjacentHTML("beforeend", `
                <tr data-category-row data-category-status="${escapeHTML(status)}">
                    <td><input type="checkbox" aria-label="Select ${escapeHTML(name)}"></td>
                    <td><span class="category-thumb"><i class="fa-solid ${escapeHTML(icon)}"></i></span><div><strong>${escapeHTML(name)}</strong><small>${escapeHTML(description)}</small></div></td>
                    <td>${escapeHTML(slug)}</td>
                    <td>${escapeHTML(type)}</td>
                    <td>${escapeHTML(items)}</td>
                    <td>${escapeHTML(order)}</td>
                    <td><span class="category-switch ${statusClass}"></span></td>
                    <td><div class="category-row-actions"><button type="button" aria-label="Edit"><i class="fa-solid fa-pen"></i></button><button class="danger" type="button" aria-label="Delete"><i class="fa-solid fa-trash"></i></button></div></td>
                </tr>
            `);

            categoryForm.reset();
            closeCategoryModal();
            updateCategoryRows();
        });
    }

    updateCategoryRows();
});
