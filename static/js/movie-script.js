// 1. DYNAMIC AUTH TOGGLE HANDLERS



// 2. HORIZONTAL SCROLL CAROUSEL ENGINE
document.querySelectorAll('.row-section').forEach(section => {
    const nextBtn = section.querySelector('.control-btn.next');
    const prevBtn = section.querySelector('.control-btn.prev');
    const slider = section.querySelector('.cards-slider');

    if (nextBtn && prevBtn && slider) {
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: slider.clientWidth * 0.75, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -slider.clientWidth * 0.75, behavior: 'smooth' });
        });
    }
});

// 3. BACKGROUND HERO INTERFACE CAROUSEL
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.carousel-dots .dot');
let activeIndex = 0;

function switchHeroSlide(targetIndex) {
    if (slides.length === 0) return;
    
    // Remove active class from old elements
    slides[activeIndex].classList.remove('active');
    dots[activeIndex].classList.remove('active');
    
    // Update index pointer
    activeIndex = targetIndex;
    
    // Add active class to new elements (Fixed classList addition here)
    slides[activeIndex].classList.add('active');
    dots[activeIndex].classList.add('active');
}

dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        switchHeroSlide(index);
    });
});

// Auto-play timer loop
if (slides.length > 0) {
    setInterval(() => {
        let next = (activeIndex + 1) % slides.length;
        switchHeroSlide(next);
    }, 6000);
}