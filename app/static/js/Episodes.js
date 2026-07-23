document.addEventListener("DOMContentLoaded", () => {
    const episodeModal = document.getElementById("episodeModal");
    const openEpisodeModal = document.getElementById("openEpisodeModal");
    const closeEpisodeModalButtons = document.querySelectorAll("[data-close-episode-modal]");
    const episodeForm = document.getElementById("episodeForm");
    const episodeTableBody = document.getElementById("episodeTableBody");
    const episodeSearchInput = document.getElementById("episodeSearchInput");
    const episodeFilterButtons = document.querySelectorAll("[data-episode-filter]");
    const episodeCountText = document.getElementById("episodeCountText");
    const addEpisodeVideoBtn = document.getElementById("addEpisodeVideoBtn");
    const addEpisodeSubtitleBtn = document.getElementById("addEpisodeSubtitleBtn");
    const addEpisodeCastBtn = document.getElementById("addEpisodeCastBtn");
    const episodeVideoTableBody = document.getElementById("episodeVideoTableBody");
    const episodeSubtitleTableBody = document.getElementById("episodeSubtitleTableBody");
    const episodeCastTableBody = document.getElementById("episodeCastTableBody");
    let activeEpisodeFilter = "all";

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

    const getEpisodeRows = () => Array.from(document.querySelectorAll("[data-episode-row]"));

    const updateEpisodeRows = () => {
        const searchValue = episodeSearchInput ? episodeSearchInput.value.trim().toLowerCase() : "";
        const rows = getEpisodeRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeEpisodeFilter === "all" || row.dataset.episodeStatus === activeEpisodeFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (episodeCountText) {
            episodeCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    const closeEpisodeModal = () => {
        if (!episodeModal) {
            return;
        }

        episodeModal.classList.remove("is-open");
        episodeModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("episode-modal-open");
    };

    const openModal = () => {
        if (!episodeModal) {
            return;
        }

        episodeModal.classList.add("is-open");
        episodeModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("episode-modal-open");
        document.getElementById("episodeTitle")?.focus();
    };

    if (openEpisodeModal) {
        openEpisodeModal.addEventListener("click", openModal);
    }

    closeEpisodeModalButtons.forEach((button) => {
        button.addEventListener("click", closeEpisodeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && episodeModal?.classList.contains("is-open")) {
            closeEpisodeModal();
        }
    });

    episodeFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeEpisodeFilter = button.dataset.episodeFilter;
            episodeFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateEpisodeRows();
        });
    });

    if (episodeSearchInput) {
        episodeSearchInput.addEventListener("input", updateEpisodeRows);
    }

    if (episodeTableBody) {
        episodeTableBody.addEventListener("click", (event) => {
            const deleteButton = event.target.closest(".danger");

            if (deleteButton) {
                deleteButton.closest("tr")?.remove();
                updateEpisodeRows();
            }
        });
    }

    const deleteMiniRow = (tableBody) => {
        if (!tableBody) {
            return;
        }

        tableBody.addEventListener("click", (event) => {
            const deleteButton = event.target.closest("[data-delete-mini-row]");

            if (deleteButton) {
                deleteButton.closest("tr")?.remove();
            }
        });
    };

    deleteMiniRow(episodeVideoTableBody);
    deleteMiniRow(episodeSubtitleTableBody);
    deleteMiniRow(episodeCastTableBody);

    if (addEpisodeVideoBtn && episodeVideoTableBody) {
        addEpisodeVideoBtn.addEventListener("click", () => {
            const quality = document.getElementById("episodeVideoQuality").value;
            const fileInput = document.getElementById("episodeVideoFile");
            const download = document.getElementById("episodeVideoDownload").value;
            const fileName = fileInput.files[0]?.name;

            if (!fileName) {
                alert("Please choose a video file.");
                return;
            }

            episodeVideoTableBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${escapeHTML(quality)}</td>
                    <td>${escapeHTML(fileName)}</td>
                    <td>${escapeHTML(download)}</td>
                    <td><button type="button" class="episode-table-action danger" data-delete-mini-row aria-label="Delete video"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `);
            fileInput.value = "";
        });
    }

    if (addEpisodeSubtitleBtn && episodeSubtitleTableBody) {
        addEpisodeSubtitleBtn.addEventListener("click", () => {
            const languageInput = document.getElementById("episodeSubtitleLanguage");
            const fileInput = document.getElementById("episodeSubtitleFile");
            const language = languageInput.value.trim();
            const fileName = fileInput.files[0]?.name;

            if (!language || !fileName) {
                alert("Please enter subtitle language and choose a subtitle file.");
                return;
            }

            episodeSubtitleTableBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${escapeHTML(language)}</td>
                    <td>${escapeHTML(fileName)}</td>
                    <td><button type="button" class="episode-table-action danger" data-delete-mini-row aria-label="Delete subtitle"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `);
            languageInput.value = "";
            fileInput.value = "";
        });
    }

    if (addEpisodeCastBtn && episodeCastTableBody) {
        addEpisodeCastBtn.addEventListener("click", () => {
            const type = document.getElementById("episodeCastType").value;
            const nameInput = document.getElementById("episodeCastName");
            const roleInput = document.getElementById("episodeCastRole");
            const name = nameInput.value.trim();
            const role = roleInput.value.trim();

            if (!name || !role) {
                alert("Please enter cast/crew name and role.");
                return;
            }

            episodeCastTableBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${escapeHTML(type)}</td>
                    <td>${escapeHTML(name)}</td>
                    <td>${escapeHTML(role)}</td>
                    <td><button type="button" class="episode-table-action danger" data-delete-mini-row aria-label="Delete cast or crew"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `);
            nameInput.value = "";
            roleInput.value = "";
        });
    }

    if (episodeForm && episodeTableBody) {
        episodeForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const series = document.getElementById("episodeSeries").value;
            const season = document.getElementById("episodeSeason").value;
            const title = document.getElementById("episodeTitle").value.trim();
            const description = document.getElementById("episodeDescription").value.trim() || "New episode";
            const number = document.getElementById("episodeNumber").value || "1";
            const duration = document.getElementById("episodeDuration").value.trim() || "45 min";
            const releaseDate = document.getElementById("episodeReleaseDate").value || "2026-01-01";
            const status = document.getElementById("episodeStatus").value;
            const access = document.getElementById("episodeAccess").value;
            const statusClass = status === "draft" ? "" : "active";

            if (!title) {
                alert("Please enter episode title.");
                return;
            }

            episodeTableBody.insertAdjacentHTML("beforeend", `
                <tr data-episode-row data-episode-status="${escapeHTML(status)}">
                    <td><input type="checkbox" aria-label="Select ${escapeHTML(title)}"></td>
                    <td><span class="episode-thumb">E${escapeHTML(number)}</span><div><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></div></td>
                    <td>${escapeHTML(series)}</td>
                    <td>${escapeHTML(season)}</td>
                    <td>${escapeHTML(duration)}</td>
                    <td>${escapeHTML(releaseDate)}</td>
                    <td>${escapeHTML(access)}</td>
                    <td><span class="episode-switch ${statusClass}"></span></td>
                    <td><div class="episode-row-actions"><button type="button" aria-label="Edit"><i class="fa-solid fa-pen"></i></button><button class="danger" type="button" aria-label="Delete"><i class="fa-solid fa-trash"></i></button></div></td>
                </tr>
            `);

            episodeForm.reset();
            closeEpisodeModal();
            updateEpisodeRows();
        });
    }

    updateEpisodeRows();
});
