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

    if (categoryForm) {
        categoryForm.addEventListener("submit", (event) => {
            const name = categoryName?.value.trim();

            if (!name) {
                event.preventDefault();
                alert("Please enter category name.");
            }
        });
    }

    updateCategoryRows();
});
