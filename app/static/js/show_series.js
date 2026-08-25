document.addEventListener("DOMContentLoaded", () => {
    const adminSidebarToggle = document.getElementById("adminSidebarToggle");
    const adminSubmenuToggle = document.querySelector(".admin-submenu-toggle");
    const seriesModal = document.getElementById("seriesModal");
    const openSeriesModal = document.getElementById("openSeriesModal");
    const closeSeriesModalButtons = document.querySelectorAll("[data-close-series-modal]");
    const seriesTableBody = document.getElementById("seriesTableBody");
    const seriesSearchInput = document.getElementById("seriesSearchInput");
    const seriesFilterButtons = document.querySelectorAll("[data-series-filter]");
    const seriesCountText = document.getElementById("seriesCountText");
    let activeSeriesFilter = "all";

    const getSeriesRows = () => Array.from(document.querySelectorAll("[data-series-row]"));

    const updateSeriesRows = () => {
        const searchValue = seriesSearchInput ? seriesSearchInput.value.trim().toLowerCase() : "";
        const rows = getSeriesRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeSeriesFilter === "all" || row.dataset.seriesStatus === activeSeriesFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (seriesCountText) {
            seriesCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    const closeSeriesModal = () => {
        if (!seriesModal) {
            return;
        }

        seriesModal.classList.remove("is-open");
        seriesModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("series-modal-open");
    };

    const openModal = () => {
        if (!seriesModal) {
            return;
        }

        seriesModal.classList.add("is-open");
        seriesModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("series-modal-open");
        document.getElementById("seriesName")?.focus();
    };

    if (adminSidebarToggle) {
        adminSidebarToggle.addEventListener("click", () => {
            document.body.classList.toggle("admin-sidebar-open");
        });
    }

    if (adminSubmenuToggle) {
        adminSubmenuToggle.addEventListener("click", () => {
            const group = adminSubmenuToggle.closest(".admin-menu-group");
            const isOpen = group.classList.toggle("open");
            adminSubmenuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    if (openSeriesModal) {
        openSeriesModal.addEventListener("click", openModal);
    }

    closeSeriesModalButtons.forEach((button) => {
        button.addEventListener("click", closeSeriesModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && seriesModal?.classList.contains("is-open")) {
            closeSeriesModal();
        }
    });

    seriesFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeSeriesFilter = button.dataset.seriesFilter;
            seriesFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateSeriesRows();
        });
    });

    if (seriesSearchInput) {
        seriesSearchInput.addEventListener("input", updateSeriesRows);
    }

    if (seriesTableBody) {
        seriesTableBody.addEventListener("click", (event) => {
            const deleteButton = event.target.closest(".danger");

            if (deleteButton) {
                deleteButton.closest("tr")?.remove();
                updateSeriesRows();
            }
        });
    }

    updateSeriesRows();
});
