document.addEventListener("DOMContentLoaded", () => {
    const seasonModal = document.getElementById("seasonModal");
    const openSeasonModal = document.getElementById("openSeasonModal");
    const closeSeasonModalButtons = document.querySelectorAll("[data-close-season-modal]");
    const seasonForm = document.getElementById("seasonForm");
    const seasonTableBody = document.getElementById("seasonTableBody");
    const seasonSearchInput = document.getElementById("seasonSearchInput");
    const seasonFilterButtons = document.querySelectorAll("[data-season-filter]");
    const seasonCountText = document.getElementById("seasonCountText");
    let activeSeasonFilter = "all";

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

    const getSeasonRows = () => Array.from(document.querySelectorAll("[data-season-row]"));

    const updateSeasonRows = () => {
        const searchValue = seasonSearchInput ? seasonSearchInput.value.trim().toLowerCase() : "";
        const rows = getSeasonRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeSeasonFilter === "all" || row.dataset.seasonStatus === activeSeasonFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (seasonCountText) {
            seasonCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    const closeSeasonModal = () => {
        if (!seasonModal) {
            return;
        }

        seasonModal.classList.remove("is-open");
        seasonModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("season-modal-open");
    };

    const openModal = () => {
        if (!seasonModal) {
            return;
        }

        seasonModal.classList.add("is-open");
        seasonModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("season-modal-open");
        document.getElementById("seasonName")?.focus();
    };

    if (openSeasonModal) {
        openSeasonModal.addEventListener("click", openModal);
    }

    closeSeasonModalButtons.forEach((button) => {
        button.addEventListener("click", closeSeasonModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && seasonModal?.classList.contains("is-open")) {
            closeSeasonModal();
        }
    });

    seasonFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeSeasonFilter = button.dataset.seasonFilter;
            seasonFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateSeasonRows();
        });
    });

    if (seasonSearchInput) {
        seasonSearchInput.addEventListener("input", updateSeasonRows);
    }

    if (seasonTableBody) {
        seasonTableBody.addEventListener("click", (event) => {
            const deleteButton = event.target.closest(".danger");

            if (deleteButton) {
                deleteButton.closest("tr")?.remove();
                updateSeasonRows();
            }
        });
    }

    if (seasonForm && seasonTableBody) {
        seasonForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const series = document.getElementById("seasonSeries").value;
            const name = document.getElementById("seasonName").value.trim();
            const description = document.getElementById("seasonDescription").value.trim() || "New season";
            const number = document.getElementById("seasonNumber").value || "1";
            const episodes = document.getElementById("seasonEpisodes").value || "1";
            const year = document.getElementById("seasonYear").value || "2026";
            const status = document.getElementById("seasonStatus").value;
            const access = document.getElementById("seasonAccess").value;
            const statusClass = status === "draft" ? "" : "active";

            if (!name) {
                alert("Please enter season name.");
                return;
            }

            seasonTableBody.insertAdjacentHTML("beforeend", `
                <tr data-season-row data-season-status="${escapeHTML(status)}">
                    <td><input type="checkbox" aria-label="Select ${escapeHTML(name)}"></td>
                    <td><span class="season-thumb">S${escapeHTML(number)}</span><div><strong>${escapeHTML(name)}</strong><small>${escapeHTML(description)}</small></div></td>
                    <td>${escapeHTML(series)}</td>
                    <td>${escapeHTML(episodes)}</td>
                    <td>${escapeHTML(year)}</td>
                    <td>${escapeHTML(access)}</td>
                    <td><span class="season-switch ${statusClass}"></span></td>
                    <td><div class="season-row-actions"><button type="button" aria-label="Edit"><i class="fa-solid fa-pen"></i></button><button class="danger" type="button" aria-label="Delete"><i class="fa-solid fa-trash"></i></button></div></td>
                </tr>
            `);

            seasonForm.reset();
            closeSeasonModal();
            updateSeasonRows();
        });
    }

    updateSeasonRows();
});
