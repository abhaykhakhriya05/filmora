document.addEventListener("DOMContentLoaded", () => {
    const movieModal = document.getElementById("movieModal");
    const openMovieModal = document.getElementById("openMovieModal");
    const closeMovieModalButtons = document.querySelectorAll("[data-close-movie-modal]");
    const movieForm = document.getElementById("movieForm");
    const movieTableBody = document.getElementById("movieTableBody");
    const movieSearchInput = document.getElementById("movieSearchInput");
    const movieFilterButtons = document.querySelectorAll("[data-movie-filter]");
    const movieCountText = document.getElementById("movieCountText");
    const addMovieCastBtn = document.getElementById("addMovieCastBtn");
    const addMovieVideoBtn = document.getElementById("addMovieVideoBtn");
    const addMovieSubtitleBtn = document.getElementById("addMovieSubtitleBtn");
    const movieCastTableBody = document.getElementById("movieCastTableBody");
    const movieVideoTableBody = document.getElementById("movieVideoTableBody");
    const movieSubtitleTableBody = document.getElementById("movieSubtitleTableBody");
    let activeMovieFilter = "all";
    let editingMovieRow = null;

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

    const getMovieRows = () => Array.from(document.querySelectorAll("[data-movie-row]"));

    const updateMovieRows = () => {
        const searchValue = movieSearchInput ? movieSearchInput.value.trim().toLowerCase() : "";
        const rows = getMovieRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeMovieFilter === "all" || row.dataset.movieStatus === activeMovieFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (movieCountText) {
            movieCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    const closeMovieModal = () => {
        if (!movieModal) {
            return;
        }

        movieModal.classList.remove("is-open");
        movieModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("movie-modal-open");
        editingMovieRow = null;
        movieForm?.setAttribute("data-mode", "add");

        const modalTitle = document.getElementById("movieModalTitle");
        if (modalTitle) {
            modalTitle.textContent = "Add New Movie";
        }
    };

    const populateMovieForm = (row) => {
        if (!movieForm || !row) {
            return;
        }

        const nameInput = movieForm.querySelector('input[name="movie_name"]');
        const descriptionInput = movieForm.querySelector('textarea[name="movie_desc"]');
        const accessSelect = movieForm.querySelector('select[name="movie_access"]');
        const languageSelect = movieForm.querySelector('select[name="movie_language"]');
        const genreSelect = movieForm.querySelector('select[name="movie_cat"]');
        const yearInput = movieForm.querySelector('input[name="movie_year"]');
        const durationInput = movieForm.querySelector('input[name="movie_duration"]');
        const statusSelect = movieForm.querySelector('select[name="movie_status"]');

        const movieCell = row.cells[1];
        const titleText = movieCell?.querySelector("strong")?.textContent.trim() || "";
        const metaText = movieCell?.querySelector("small")?.textContent.trim() || "";
        const qualityText = row.cells[2]?.textContent.trim() || "";
        const genreText = row.cells[3]?.textContent.trim() || "";
        const yearText = row.cells[4]?.textContent.trim() || "";
        const languageText = row.cells[5]?.textContent.trim() || "";
        const accessText = row.cells[6]?.textContent.trim() || "";
        const statusText = row.dataset.movieStatus || "published";

        if (nameInput) {
            nameInput.value = titleText;
        }

        if (descriptionInput) {
            descriptionInput.value = metaText;
        }

        if (accessSelect) {
            accessSelect.value = accessText || "Free";
        }

        if (languageSelect) {
            languageSelect.value = languageText || "Hindi";
        }

        if (genreSelect) {
            genreSelect.value = genreText || "";
        }

        if (yearInput) {
            yearInput.value = yearText;
        }

        if (durationInput) {
            durationInput.value = metaText.split(" ")[0] || "120 min";
        }

        if (statusSelect) {
            statusSelect.value = statusText;
        }

        const modalTitle = document.getElementById("movieModalTitle");
        if (modalTitle) {
            modalTitle.textContent = "Edit Movie";
        }
    };

    const openModal = (row = null) => {
        if (!movieModal) {
            return;
        }

        movieModal.classList.add("is-open");
        movieModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("movie-modal-open");

        if (row) {
            editingMovieRow = row;
            movieForm?.setAttribute("data-mode", "edit");
            populateMovieForm(row);
        } else {
            editingMovieRow = null;
            movieForm?.setAttribute("data-mode", "add");
            const modalTitle = document.getElementById("movieModalTitle");
            if (modalTitle) {
                modalTitle.textContent = "Add New Movie";
            }
        }

        document.querySelector('input[name="movie_name"]')?.focus();
    };

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

    if (openMovieModal) {
        openMovieModal.addEventListener("click", openModal);
    }

    closeMovieModalButtons.forEach((button) => {
        button.addEventListener("click", closeMovieModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && movieModal?.classList.contains("is-open")) {
            closeMovieModal();
        }
    });

    movieFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeMovieFilter = button.dataset.movieFilter;
            movieFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateMovieRows();
        });
    });

    if (movieSearchInput) {
        movieSearchInput.addEventListener("input", updateMovieRows);
    }

    if (movieTableBody) {
        movieTableBody.addEventListener("click", (event) => {
            const editButton = event.target.closest('button[aria-label="Edit"]');

            if (editButton) {
                const row = editButton.closest("tr[data-movie-row]");
                if (row) {
                    openModal(row);
                }
                return;
            }

            const deleteButton = event.target.closest(".danger");

            if (deleteButton) {
                deleteButton.closest("tr")?.remove();
                updateMovieRows();
            }
        });
    }

    deleteMiniRow(movieCastTableBody);
    deleteMiniRow(movieVideoTableBody);
    deleteMiniRow(movieSubtitleTableBody);

    if (addMovieCastBtn && movieCastTableBody) {
        addMovieCastBtn.addEventListener("click", () => {
            const type = document.getElementById("movieCastType").value;
            const nameInput = document.getElementById("movieCastName");
            const roleInput = document.getElementById("movieCastRole");
            const name = nameInput.value.trim();
            const role = roleInput.value.trim();

            if (!name || !role) {
                alert("Please enter cast/crew name and role.");
                return;
            }

            movieCastTableBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${escapeHTML(type)}</td>
                    <td>${escapeHTML(name)}</td>
                    <td>${escapeHTML(role)}</td>
                    <td><button type="button" class="movie-table-action danger" data-delete-mini-row aria-label="Delete cast or crew"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `);
            nameInput.value = "";
            roleInput.value = "";
        });
    }

    if (addMovieVideoBtn && movieVideoTableBody) {
        addMovieVideoBtn.addEventListener("click", () => {
            const quality = document.getElementById("movieVideoQuality").value;
            const fileInput = document.getElementById("movieVideoFile");
            const download = document.getElementById("movieVideoDownload").value;
            const fileName = fileInput.files[0]?.name;

            if (!fileName) {
                alert("Please choose a video file.");
                return;
            }

            movieVideoTableBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${escapeHTML(quality)}</td>
                    <td>${escapeHTML(fileName)}</td>
                    <td>${escapeHTML(download)}</td>
                    <td><button type="button" class="movie-table-action danger" data-delete-mini-row aria-label="Delete video"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `);
            fileInput.value = "";
        });
    }

    if (addMovieSubtitleBtn && movieSubtitleTableBody) {
        addMovieSubtitleBtn.addEventListener("click", () => {
            const languageInput = document.getElementById("movieSubtitleLanguage");
            const fileInput = document.getElementById("movieSubtitleFile");
            const language = languageInput.value.trim();
            const fileName = fileInput.files[0]?.name;

            if (!language || !fileName) {
                alert("Please enter subtitle language and choose a subtitle file.");
                return;
            }

            movieSubtitleTableBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${escapeHTML(language)}</td>
                    <td>${escapeHTML(fileName)}</td>
                    <td><button type="button" class="movie-table-action danger" data-delete-mini-row aria-label="Delete subtitle"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `);
            languageInput.value = "";
            fileInput.value = "";
        });
    }

    if (movieForm && movieTableBody) {
        movieForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("movieName").value.trim();
            const description = document.getElementById("movieDescription").value.trim() || "New movie";
            const access = document.getElementById("movieAccess").value;
            const language = document.getElementById("movieLanguage").value;
            const genre = document.getElementById("movieGenre").value;
            const year = document.getElementById("movieYear").value || "2026";
            const duration = document.getElementById("movieDuration").value.trim() || "120 min";
            const status = document.getElementById("movieStatus").value;
            const statusClass = status === "draft" ? "" : "active";
            const qualities = Array.from(movieVideoTableBody?.querySelectorAll("tr") || [])
                .map((row) => row.children[0]?.textContent.trim())
                .filter(Boolean)
                .join("/") || "720P";

            if (!name) {
                alert("Please enter movie name.");
                return;
            }

            if (editingMovieRow) {
                editingMovieRow.dataset.movieStatus = status;
                editingMovieRow.cells[1].innerHTML = `<span class="movie-thumb">4:3</span><div><strong>${escapeHTML(name)}</strong><small>${escapeHTML(duration)} ${escapeHTML(description)}</small></div>`;
                editingMovieRow.cells[2].textContent = qualities;
                editingMovieRow.cells[3].textContent = genre;
                editingMovieRow.cells[4].textContent = year;
                editingMovieRow.cells[5].textContent = language;
                editingMovieRow.cells[6].textContent = access;
                editingMovieRow.cells[7].innerHTML = `<span class="movie-switch ${statusClass}"></span>`;
                editingMovieRow.cells[8].innerHTML = `<div class="movie-row-actions"><button type="button" aria-label="Edit"><i class="fa-solid fa-pen"></i></button><button class="danger" type="button" aria-label="Delete"><i class="fa-solid fa-trash"></i></button></div>`;
            } else {
                movieTableBody.insertAdjacentHTML("beforeend", `
                    <tr data-movie-row data-movie-status="${escapeHTML(status)}">
                        <td><input type="checkbox" aria-label="Select ${escapeHTML(name)}"></td>
                        <td><span class="movie-thumb">4:3</span><div><strong>${escapeHTML(name)}</strong><small>${escapeHTML(duration)} ${escapeHTML(description)}</small></div></td>
                        <td>${escapeHTML(qualities)}</td>
                        <td>${escapeHTML(genre)}</td>
                        <td>${escapeHTML(year)}</td>
                        <td>${escapeHTML(language)}</td>
                        <td>${escapeHTML(access)}</td>
                        <td><span class="movie-switch ${statusClass}"></span></td>
                        <td><div class="movie-row-actions"><button type="button" aria-label="Edit"><i class="fa-solid fa-pen"></i></button><button class="danger" type="button" aria-label="Delete"><i class="fa-solid fa-trash"></i></button></div></td>
                    </tr>
                `);
            }

            movieForm.reset();
            closeMovieModal();
            updateMovieRows();
        });
    }

    updateMovieRows();
});
