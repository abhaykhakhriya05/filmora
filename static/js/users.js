document.addEventListener("DOMContentLoaded", () => {
    const userModal = document.getElementById("userModal");
    const openUserModal = document.getElementById("openUserModal");
    const closeUserModalButtons = document.querySelectorAll("[data-close-user-modal]");
    const userForm = document.getElementById("userForm");
    const usersTableBody = document.getElementById("usersTableBody");
    const usersSearchInput = document.getElementById("usersSearchInput");
    const userFilterButtons = document.querySelectorAll("[data-user-filter]");
    const usersCountText = document.getElementById("usersCountText");
    let activeUserFilter = "all";

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);

    const getUserRows = () => Array.from(document.querySelectorAll("[data-user-row]"));

    const updateUserRows = () => {
        const searchValue = usersSearchInput ? usersSearchInput.value.trim().toLowerCase() : "";
        const rows = getUserRows();
        let visibleCount = 0;

        rows.forEach((row) => {
            const matchesFilter = activeUserFilter === "all" || row.dataset.userStatus === activeUserFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            const shouldShow = matchesFilter && matchesSearch;

            row.classList.toggle("is-hidden", !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (usersCountText) {
            usersCountText.textContent = `Showing ${visibleCount ? 1 : 0} to ${visibleCount} of ${rows.length} entries`;
        }
    };

    const closeUserModal = () => {
        userModal?.classList.remove("is-open");
        userModal?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("user-modal-open");
    };

    if (openUserModal) {
        openUserModal.addEventListener("click", () => {
            userModal?.classList.add("is-open");
            userModal?.setAttribute("aria-hidden", "false");
            document.body.classList.add("user-modal-open");
            document.getElementById("userName")?.focus();
        });
    }

    closeUserModalButtons.forEach((button) => button.addEventListener("click", closeUserModal));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && userModal?.classList.contains("is-open")) {
            closeUserModal();
        }
    });

    userFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeUserFilter = button.dataset.userFilter;
            userFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            updateUserRows();
        });
    });

    usersSearchInput?.addEventListener("input", updateUserRows);

    usersTableBody?.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".danger");
        if (deleteButton) {
            deleteButton.closest("tr")?.remove();
            updateUserRows();
        }
    });

    userForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const plan = document.getElementById("userPlan").value;
        const status = document.getElementById("userStatus").value;
        const joined = document.getElementById("userJoined").value || "2026-07-20";
        const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "US";

        if (!name || !email) {
            alert("Please enter user name and email.");
            return;
        }

        usersTableBody.insertAdjacentHTML("beforeend", `
            <tr data-user-row data-user-status="${escapeHTML(status)}">
                <td><span class="users-avatar">${escapeHTML(initials)}</span><div><strong>${escapeHTML(name)}</strong><small>#USR-NEW</small></div></td>
                <td>${escapeHTML(email)}</td>
                <td>${escapeHTML(plan)}</td>
                <td><span class="users-status ${escapeHTML(status)}">${escapeHTML(status.charAt(0).toUpperCase() + status.slice(1))}</span></td>
                <td>${escapeHTML(joined)}</td>
                <td>Today</td>
                <td><div class="users-row-actions"><button type="button" aria-label="View user"><i class="fa-solid fa-eye"></i></button><button type="button" aria-label="Edit user"><i class="fa-solid fa-pen"></i></button><button class="danger" type="button" aria-label="Delete user"><i class="fa-solid fa-trash"></i></button></div></td>
            </tr>
        `);

        userForm.reset();
        closeUserModal();
        updateUserRows();
    });

    updateUserRows();
});
