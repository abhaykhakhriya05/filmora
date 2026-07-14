document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Mobile Dropdown Toggle Handler
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            
            // Switch icons between bars and close window mark dynamically
            const icon = menuToggle.querySelector("i");
            if(navLinks.classList.contains("show")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });
    }

    // 2. Responsive Carousel Slide Controls
    document.querySelectorAll('.row-section').forEach(section => {
        const nextBtn = section.querySelector('.control-btn.next');
        const prevBtn = section.querySelector('.control-btn.prev');
        const slider = section.querySelector('.cards-slider');

        if (nextBtn && prevBtn && slider) {
            nextBtn.addEventListener('click', () => {
                // Adaptive step values balance correctly matching screen sizes automatically
                const scrollAmount = slider.clientWidth * 0.75;
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                const scrollAmount = slider.clientWidth * 0.75;
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
    });

    const adminSidebarToggle = document.getElementById("adminSidebarToggle");
    const adminSidebar = document.getElementById("adminSidebar");
    const adminSubmenuToggle = document.querySelector(".admin-submenu-toggle");

    if (adminSidebarToggle && adminSidebar) {
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

    const ratingFilterButtons = document.querySelectorAll("[data-rating-filter]");
    const ratingCards = document.querySelectorAll("[data-rating-type]");

    if (ratingFilterButtons.length && ratingCards.length) {
        ratingFilterButtons.forEach(button => {
            button.addEventListener("click", () => {
                const filter = button.dataset.ratingFilter;

                ratingFilterButtons.forEach(item => item.classList.remove("active"));
                button.classList.add("active");

                ratingCards.forEach(card => {
                    const shouldShow = filter === "all" || card.dataset.ratingType === filter;
                    card.classList.toggle("is-hidden", !shouldShow);
                });
            });
        });
    }

    const commentFilterButtons = document.querySelectorAll("[data-comment-filter]");
    const commentCards = document.querySelectorAll("[data-comment-type]");

    if (commentFilterButtons.length && commentCards.length) {
        commentFilterButtons.forEach(button => {
            button.addEventListener("click", () => {
                const filter = button.dataset.commentFilter;

                commentFilterButtons.forEach(item => item.classList.remove("active"));
                button.classList.add("active");

                commentCards.forEach(card => {
                    const shouldShow = filter === "all" || card.dataset.commentType === filter;
                    card.classList.toggle("is-hidden", !shouldShow);
                });
            });
        });
    }

    const userFilterButtons = document.querySelectorAll("[data-user-filter]");
    const userRows = document.querySelectorAll("[data-user-row]");
    const usersSearchInput = document.getElementById("usersSearchInput");
    let activeUserFilter = "all";

    const updateUserRows = () => {
        const searchValue = usersSearchInput ? usersSearchInput.value.trim().toLowerCase() : "";

        userRows.forEach(row => {
            const matchesFilter = activeUserFilter === "all" || row.dataset.userStatus === activeUserFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            row.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
        });
    };

    if (userFilterButtons.length && userRows.length) {
        userFilterButtons.forEach(button => {
            button.addEventListener("click", () => {
                activeUserFilter = button.dataset.userFilter;
                userFilterButtons.forEach(item => item.classList.remove("active"));
                button.classList.add("active");
                updateUserRows();
            });
        });
    }

    if (usersSearchInput && userRows.length) {
        usersSearchInput.addEventListener("input", updateUserRows);
    }

    const movieModal = document.getElementById("movieModal");
    const openMovieModal = document.getElementById("openMovieModal");
    const closeMovieModalButtons = document.querySelectorAll("[data-close-movie-modal]");

    const closeMovieModal = () => {
        if (!movieModal) {
            return;
        }

        movieModal.classList.remove("is-open");
        movieModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("movie-modal-open");
    };

    if (movieModal && openMovieModal) {
        openMovieModal.addEventListener("click", () => {
            movieModal.classList.add("is-open");
            movieModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("movie-modal-open");
        });

        closeMovieModalButtons.forEach(button => {
            button.addEventListener("click", closeMovieModal);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && movieModal.classList.contains("is-open")) {
                closeMovieModal();
            }
        });
    }

    const movieFilterButtons = document.querySelectorAll("[data-movie-filter]");
    const movieRows = document.querySelectorAll("[data-movie-row]");
    const movieSearchInput = document.getElementById("movieSearchInput");
    let activeMovieFilter = "all";

    const updateMovieRows = () => {
        const searchValue = movieSearchInput ? movieSearchInput.value.trim().toLowerCase() : "";

        movieRows.forEach(row => {
            const matchesFilter = activeMovieFilter === "all" || row.dataset.movieStatus === activeMovieFilter;
            const matchesSearch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
            row.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
        });
    };

    if (movieFilterButtons.length && movieRows.length) {
        movieFilterButtons.forEach(button => {
            button.addEventListener("click", () => {
                activeMovieFilter = button.dataset.movieFilter;
                movieFilterButtons.forEach(item => item.classList.remove("active"));
                button.classList.add("active");
                updateMovieRows();
            });
        });
    }

    if (movieSearchInput && movieRows.length) {
        movieSearchInput.addEventListener("input", updateMovieRows);
    }
});


    document.addEventListener("DOMContentLoaded", function () {
        const authWrapper = document.getElementById("authWrapper");
        const loginBtn = document.getElementById("loginBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        if (!authWrapper || !loginBtn || !logoutBtn) {
            return;
        }

        // Event listener simulating Login confirmation actions
        loginBtn.addEventListener("click", function() {
            // authWrapper.classList.remove("logged-out");
            // authWrapper.classList.add("logged-in");

            window.location.href="login.html";
        });

        // Event listener simulating Logout confirmation actions
        logoutBtn.addEventListener("click", function() {
            // authWrapper.classList.remove("logged-in");
            // authWrapper.classList.add("logged-out");
        });
    });

// document.getElementById("loginBtn").addEventListener("submit", function(e){
    
//     window.location.href = "login.html";

// });






