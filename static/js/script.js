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


    // document.addEventListener("DOMContentLoaded", function () {
    //     const authWrapper = document.getElementById("authWrapper");
    //     const loginBtn = document.getElementById("loginBtn");
    //     const logoutBtn = document.getElementById("logoutBtn");

    //     if (!authWrapper || !loginBtn || !logoutBtn) {
    //         return;
    //     }

    //     // Event listener simulating Login confirmation actions
    //     loginBtn.addEventListener("click", function() {
    //         // authWrapper.classList.remove("logged-out");
    //         // authWrapper.classList.add("logged-in");

    //         window.location.href="{{ url_for('login') }}";
    //     });

    //     // Event listener simulating Logout confirmation actions
    //     logoutBtn.addEventListener("click", function() {
    //         // authWrapper.classList.remove("logged-in");
    //         // authWrapper.classList.add("logged-out");
    //     });
    // });

// document.getElementById("loginBtn").addEventListener("submit", function(e){
    
//     window.location.href = "login.html";

// });













document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("castCrewModal");
  const openBtn = document.getElementById("castes");
  const closeIcon = document.getElementById("modalCloseIcon");
  const closeBtn = document.getElementById("closeCastBtn");
  const saveBtn = document.getElementById("saveCastBtn");
  const form = document.getElementById("castCrewForm");
  const castCrewTableBody = document.getElementById("castCrewTableBody");
  let editingCastRow = null;

  const getActionCell = (editAttribute) => `
    <td>
      <button type="button" class="table-action-btn" ${editAttribute}>
        <i class="fa-solid fa-pen green"></i>
      </button>
      <button type="button" class="table-action-btn" data-delete-row>
        <i class="fa-solid fa-trash red"></i>
      </button>
    </td>
  `;
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);

  if (modal && openBtn && closeIcon && closeBtn && saveBtn && form) {
    // Open Modal On Top
    openBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevents page reload or nested form submissions
      editingCastRow = null;
      saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';
      modal.classList.add("show-modal");
    });

    // Close Event Handlers
    closeIcon.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    
    // Close if clicking outside the container box
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    // Action Logic
    saveBtn.addEventListener("click", () => {
      const name = document.getElementById("castName").value.trim();
      const role = document.getElementById("castRole").value.trim();
      const isCrew = document.getElementById("isCrew").checked;
      const memberType = isCrew ? "Crew" : "Cast";

      if (!name || !role) {
        alert("Please enter both Name and Role.");
        return;
      }

      if (editingCastRow) {
        editingCastRow.children[0].textContent = memberType;
        editingCastRow.children[1].textContent = name;
        editingCastRow.children[2].textContent = role;
      } else if (castCrewTableBody) {
        castCrewTableBody.insertAdjacentHTML(
          "beforeend",
          `<tr><td>${memberType}</td><td>${escapeHTML(name)}</td><td>${escapeHTML(role)}</td>${getActionCell("data-edit-cast")}</tr>`
        );
      }

      console.log("Data Captured:", { name, role, isCrew });
      closeModal();
    });

    if (castCrewTableBody) {
      castCrewTableBody.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) {
          return;
        }

        const row = button.closest("tr");
        if (!row) {
          return;
        }

        if (button.matches("[data-delete-row]")) {
          row.remove();
          return;
        }

        if (button.matches("[data-edit-cast]")) {
          editingCastRow = row;
          document.getElementById("castName").value = row.children[1].textContent.trim();
          document.getElementById("castRole").value = row.children[2].textContent.trim();
          document.getElementById("isCrew").checked = row.children[0].textContent.trim().toLowerCase() === "crew";
          saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update';
          modal.classList.add("show-modal");
        }
      });
    }
  }

  function closeModal() {
    modal.classList.remove("show-modal");
    form.reset();
    editingCastRow = null;
    if (saveBtn) {
      saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';
    }
  }

  const videoModal = document.getElementById("videoModal");
  const addVideoBtn = document.getElementById("addVideoBtn");
  const videoCloseIcon = document.getElementById("videoModalCloseIcon");
  const closeVideoBtn = document.getElementById("closeVideoBtn");
  const saveVideoBtn = document.getElementById("saveVideoBtn");
  const videoForm = document.getElementById("videoForm");
  const videoTableBody = document.getElementById("videoTableBody");
  let editingVideoRow = null;

  if (videoModal && addVideoBtn && videoCloseIcon && closeVideoBtn && saveVideoBtn && videoForm) {
    const openVideoModal = (event) => {
      event.preventDefault();
      editingVideoRow = null;
      videoForm.reset();
      saveVideoBtn.textContent = "Save changes";
      videoModal.classList.add("show-modal");
    };

    const closeVideoModal = () => {
      videoModal.classList.remove("show-modal");
      videoForm.reset();
      editingVideoRow = null;
      saveVideoBtn.textContent = "Save changes";
    };

    addVideoBtn.addEventListener("click", openVideoModal);
    videoCloseIcon.addEventListener("click", closeVideoModal);
    closeVideoBtn.addEventListener("click", closeVideoModal);

    window.addEventListener("click", (event) => {
      if (event.target === videoModal) {
        closeVideoModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && videoModal.classList.contains("show-modal")) {
        closeVideoModal();
      }
    });

    saveVideoBtn.addEventListener("click", () => {
      const quality = document.getElementById("videoQuality").value;
      const file = document.getElementById("videoFile").files[0];
      const downloadEnabled = document.getElementById("downloadLink").checked;
      const fileName = file ? file.name : (editingVideoRow ? editingVideoRow.children[1].textContent.trim() : "");

      if (!fileName) {
        alert("Please choose a video file.");
        return;
      }

      if (editingVideoRow) {
        editingVideoRow.children[0].textContent = quality;
        editingVideoRow.children[1].textContent = fileName;
      } else if (videoTableBody) {
        videoTableBody.insertAdjacentHTML(
          "beforeend",
          `<tr><td>${escapeHTML(quality)}</td><td>${escapeHTML(fileName)}</td>${getActionCell("data-edit-video")}</tr>`
        );
      }

      console.log("Video Data Captured:", {
        quality,
        fileName,
        downloadEnabled
      });
      closeVideoModal();
    });

    if (videoTableBody) {
      videoTableBody.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) {
          return;
        }

        const row = button.closest("tr");
        if (!row) {
          return;
        }

        if (button.matches("[data-delete-row]")) {
          row.remove();
          return;
        }

        if (button.matches("[data-edit-video]")) {
          const quality = row.children[0].textContent.trim();
          const qualitySelect = document.getElementById("videoQuality");
          const matchingOption = Array.from(qualitySelect.options).find(option => (
            option.textContent.trim().toLowerCase() === quality.toLowerCase()
          ));

          editingVideoRow = row;
          videoForm.reset();
          qualitySelect.value = matchingOption ? matchingOption.value : qualitySelect.value;
          saveVideoBtn.textContent = "Update";
          videoModal.classList.add("show-modal");
        }
      });
    }
  }

  const subtitleModal = document.getElementById("subtitleModal");
  const addSubtitleBtn = document.getElementById("addSubtitleBtn");
  const subtitleCloseIcon = document.getElementById("subtitleModalCloseIcon");
  const closeSubtitleBtn = document.getElementById("closeSubtitleBtn");
  const saveSubtitleBtn = document.getElementById("saveSubtitleBtn");
  const subtitleForm = document.getElementById("subtitleForm");
  const subtitleTableBody = document.getElementById("subtitleTableBody");
  let editingSubtitleRow = null;

  if (subtitleModal && addSubtitleBtn && subtitleCloseIcon && closeSubtitleBtn && saveSubtitleBtn && subtitleForm) {
    const openSubtitleModal = (event) => {
      event.preventDefault();
      editingSubtitleRow = null;
      subtitleForm.reset();
      saveSubtitleBtn.textContent = "Save changes";
      subtitleModal.classList.add("show-modal");
    };

    const closeSubtitleModal = () => {
      subtitleModal.classList.remove("show-modal");
      subtitleForm.reset();
      editingSubtitleRow = null;
      saveSubtitleBtn.textContent = "Save changes";
    };

    addSubtitleBtn.addEventListener("click", openSubtitleModal);
    subtitleCloseIcon.addEventListener("click", closeSubtitleModal);
    closeSubtitleBtn.addEventListener("click", closeSubtitleModal);

    window.addEventListener("click", (event) => {
      if (event.target === subtitleModal) {
        closeSubtitleModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && subtitleModal.classList.contains("show-modal")) {
        closeSubtitleModal();
      }
    });

    saveSubtitleBtn.addEventListener("click", () => {
      const language = document.getElementById("subtitleLanguage").value;
      const file = document.getElementById("subtitleFile").files[0];
      const fileName = file ? file.name : (editingSubtitleRow ? editingSubtitleRow.children[1].textContent.trim() : "");

      if (!fileName) {
        alert("Please choose a subtitle file.");
        return;
      }

      if (editingSubtitleRow) {
        editingSubtitleRow.children[0].textContent = language;
        editingSubtitleRow.children[1].textContent = fileName;
      } else if (subtitleTableBody) {
        subtitleTableBody.insertAdjacentHTML(
          "beforeend",
          `<tr><td>${escapeHTML(language)}</td><td>${escapeHTML(fileName)}</td>${getActionCell("data-edit-subtitle")}</tr>`
        );
      }

      console.log("Subtitle Data Captured:", {
        language,
        fileName
      });
      closeSubtitleModal();
    });

    if (subtitleTableBody) {
      subtitleTableBody.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) {
          return;
        }

        const row = button.closest("tr");
        if (!row) {
          return;
        }

        if (button.matches("[data-delete-row]")) {
          row.remove();
          return;
        }

        if (button.matches("[data-edit-subtitle]")) {
          const language = row.children[0].textContent.trim();
          const languageSelect = document.getElementById("subtitleLanguage");
          const matchingOption = Array.from(languageSelect.options).find(option => (
            option.textContent.trim().toLowerCase() === language.toLowerCase()
          ));

          editingSubtitleRow = row;
          subtitleForm.reset();
          languageSelect.value = matchingOption ? matchingOption.value : languageSelect.value;
          saveSubtitleBtn.textContent = "Update";
          subtitleModal.classList.add("show-modal");
        }
      });
    }
  }
});



 // 


        // 2. LIVE DYNAMIC STATE SYNC ARCHITECTURE CONTROLLER
        const btnMonthly = document.getElementById('btnMonthly');
        const btnYearly = document.getElementById('btnYearly');

        const basicPrice = document.getElementById('basicPrice');
        const standardPrice = document.getElementById('standardPrice');
        const premiumPrice = document.getElementById('premiumPrice');

        const basicDuration = document.getElementById('basicDuration');
        const standardDuration = document.getElementById('standardDuration');
        const premiumDuration = document.getElementById('premiumDuration');

        const tableBasicPrice = document.getElementById('tableBasicPrice');
        const tableStandardPrice = document.getElementById('tableStandardPrice');
        const tablePremiumPrice = document.getElementById('tablePremiumPrice');

        if(btnMonthly && btnYearly) {
            btnMonthly.addEventListener('click', () => {
                btnMonthly.classList.add('active');
                btnYearly.classList.remove('active');

                basicPrice.textContent = "₹300";
                standardPrice.textContent = "₹500";
                premiumPrice.textContent = "₹1000";

                basicDuration.textContent = "/month";
                standardDuration.textContent = "/month";
                premiumDuration.textContent = "/month";

                tableBasicPrice.textContent = "$9.99/Month";
                tableStandardPrice.textContent = "$12.99/Month";
                tablePremiumPrice.textContent = "$14.99/Month";
            });

            btnYearly.addEventListener('click', () => {
                btnYearly.classList.add('active');
                btnMonthly.classList.remove('active');

                basicPrice.textContent = "$95.88";
                standardPrice.textContent = "$124.68";
                premiumPrice.textContent = "$143.88";

                basicDuration.textContent = "/year";
                standardDuration.textContent = "/year";
                premiumDuration.textContent = "/year";

                tableBasicPrice.textContent = "$95.88/Year";
                tableStandardPrice.textContent = "$124.68/Year";
                tablePremiumPrice.textContent = "$143.88/Year";
            });
        }


        // 1. ACCORDION ACCESSIBILITY AND SLIDE ENGINE HANDLERS
        document.querySelectorAll('.faq-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const currentItem = trigger.parentElement;
                const content = currentItem.querySelector('.faq-content');
                const isActive = currentItem.classList.contains('active');

                // Close all other open accordion panels for a clean UI layout look
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-content').style.maxHeight = null;
                });

                // Toggle the state of the active selected panel
                if (!isActive) {
                    currentItem.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });

