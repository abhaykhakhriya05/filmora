document.addEventListener("DOMContentLoaded", () => {
    const ratingSearchInput = document.getElementById("ratingSearchInput");
    const ratingFilterButtons = document.querySelectorAll("[data-rating-filter]");
    const ratingTableBody = document.getElementById("ratingTableBody");
    const ratingCountText = document.getElementById("ratingCountText");
    let activeRatingFilter = "all";

    const getRatingRows = () => Array.from(document.querySelectorAll("[data-rating-row]"));

    const updateRatingRows = () => {
        const searchValue = ratingSearchInput ? ratingSearchInput.value.trim().toLowerCase() : "";
        const rows = getRatingRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeRatingFilter === "all" || row.dataset.ratingType === activeRatingFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (ratingCountText) {
            ratingCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    ratingFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeRatingFilter = button.dataset.ratingFilter;
            ratingFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateRatingRows();
        });
    });

    ratingSearchInput?.addEventListener("input", updateRatingRows);

    ratingTableBody?.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".danger");
        if (deleteButton) {
            deleteButton.closest("tr")?.remove();
            updateRatingRows();
        }
    });

    updateRatingRows();
});
