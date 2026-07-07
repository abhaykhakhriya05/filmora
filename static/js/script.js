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
});


    document.addEventListener("DOMContentLoaded", function () {
        const authWrapper = document.getElementById("authWrapper");
        const loginBtn = document.getElementById("loginBtn");
        const logoutBtn = document.getElementById("logoutBtn");

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






