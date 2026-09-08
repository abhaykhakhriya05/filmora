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

    const createHiddenInput = (name, value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        return input;
    };

    // A file input cannot be converted to a hidden input without losing its
    // selected file. Keep a copied file input in the table row so it remains
    // part of the multipart form submission after the entry fields are reset.
    const createStoredFileInput = (name, file) => {
        const input = document.createElement("input");
        input.type = "file";
        input.name = name;
        input.className = "episode-submitted-file";
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        return input;
    };

    const appendRowFields = (row, fields) => {
        fields.forEach((field) => row.appendChild(field));
    };

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
            const row = episodeVideoTableBody.lastElementChild;
            appendRowFields(row, [
                createHiddenInput("episodeVideoQuality[]", quality),
                createHiddenInput("episodeVideoDownload[]", download),
                createStoredFileInput("episodeVideoFile[]", fileInput.files[0])
            ]);
            // The entry controls are now only for the next row.  Removing their
            // names prevents their blank values from shifting request indexes.
            document.getElementById("episodeVideoQuality").name = "";
            document.getElementById("episodeVideoDownload").name = "";
            fileInput.name = "";
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
            const row = episodeSubtitleTableBody.lastElementChild;
            appendRowFields(row, [
                createHiddenInput("episodeSubtitleLanguage[]", language),
                createStoredFileInput("episodeSubtitleFile[]", fileInput.files[0])
            ]);
            languageInput.name = "";
            fileInput.name = "";
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
            const row = episodeCastTableBody.lastElementChild;
            appendRowFields(row, [
                createHiddenInput("episodeCastType[]", type),
                createHiddenInput("episodeCastName[]", name),
                createHiddenInput("episodeCastRole[]", role)
            ]);
            document.getElementById("episodeCastType").name = "";
            nameInput.name = "";
            roleInput.name = "";
            nameInput.value = "";
            roleInput.value = "";
        });
    }

    updateEpisodeRows();
});
