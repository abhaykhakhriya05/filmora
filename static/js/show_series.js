document.addEventListener("DOMContentLoaded", () => {
    const adminSidebarToggle = document.getElementById("adminSidebarToggle");
    const adminSubmenuToggle = document.querySelector(".admin-submenu-toggle");
    const seriesModal = document.getElementById("seriesModal");
    const openSeriesModal = document.getElementById("openSeriesModal");
    const closeSeriesModalButtons = document.querySelectorAll("[data-close-series-modal]");
    const seriesForm = document.getElementById("seriesForm");
    const seriesTableBody = document.getElementById("seriesTableBody");
    const seriesSearchInput = document.getElementById("seriesSearchInput");
    const seriesFilterButtons = document.querySelectorAll("[data-series-filter]");
    const seriesCountText = document.getElementById("seriesCountText");
    let activeSeriesFilter = "all";

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

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

    if (seriesForm && seriesTableBody) {
        seriesForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("seriesName").value.trim();
            const description = document.getElementById("seriesDescription").value.trim() || "New series";
            const access = document.getElementById("seriesAccess").value;
            const language = document.getElementById("seriesLanguage").value;
            const genre = document.getElementById("seriesGenre").value;
            const status = document.getElementById("seriesStatus").value;
            const seasons = document.getElementById("seriesSeasons").value || "1";
            const episodes = document.getElementById("seriesEpisodes").value || "1";
            const rating = document.getElementById("seriesRating").value || "0.0";
            const statusClass = status === "draft" ? "" : "active";

            if (!name) {
                alert("Please enter series name.");
                return;
            }

            seriesTableBody.insertAdjacentHTML("beforeend", `
                <tr data-series-row data-series-status="${escapeHTML(status)}">
                    <td><input type="checkbox" aria-label="Select ${escapeHTML(name)}"></td>
                    <td><span class="series-thumb">16:9</span>
                        <div><strong>${escapeHTML(name)}</strong><small>${escapeHTML(description)}</small></div>
                    </td>
                    <td>${escapeHTML(seasons)}</td>
                    <td>${escapeHTML(episodes)}</td>
                    <td>${escapeHTML(genre)}</td>
                    <td>${escapeHTML(language)}</td>
                    <td>${escapeHTML(access)}</td>
                    <td>${escapeHTML(rating)}</td>
                    <td><span class="series-switch ${statusClass}"></span></td>
                    <td>
                        <div class="series-row-actions">
                            <button type="button" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button class="danger" type="button" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `);

            seriesForm.reset();
            closeSeriesModal();
            updateSeriesRows();
        });
    }

    updateSeriesRows();
});
