document.addEventListener("DOMContentLoaded", () => {
    const commentSearchInput = document.getElementById("commentSearchInput");
    const commentFilterButtons = document.querySelectorAll("[data-comment-filter]");
    const commentCardList = document.getElementById("commentCardList");
    const commentCountText = document.getElementById("commentCountText");
    let activeCommentFilter = "all";

    const getCommentRows = () => Array.from(document.querySelectorAll("[data-comment-row]"));

    const updateCommentRows = () => {
        const searchValue = commentSearchInput ? commentSearchInput.value.trim().toLowerCase() : "";
        const rows = getCommentRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeCommentFilter === "all" || row.dataset.commentType === activeCommentFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (commentCountText) {
            commentCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    commentFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCommentFilter = button.dataset.commentFilter;
            commentFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateCommentRows();
        });
    });

    commentSearchInput?.addEventListener("input", updateCommentRows);

    commentCardList?.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".comment-delete-btn");
        if (deleteButton) {
            deleteButton.closest("[data-comment-row]")?.remove();
            updateCommentRows();
        }
    });

    updateCommentRows();
});
