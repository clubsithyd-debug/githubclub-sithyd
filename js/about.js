/* ===============================
   ABOUT PAGE JAVASCRIPT
   =============================== */

(function() {
    'use strict';
    
    // Animate leadership cards on scroll
    function animateOnScroll() {
        const cards = document.querySelectorAll('.leader-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100); // Stagger animation
                }
            });
        }, {
            threshold: 0.1
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    function initLeaderCardHoverFlip() {
        const cards = document.querySelectorAll('.leader-card');

        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('is-flipped');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('is-flipped');
            });

            card.addEventListener('focusin', () => {
                card.classList.add('is-flipped');
            });

            card.addEventListener('focusout', () => {
                card.classList.remove('is-flipped');
            });
        });
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            animateOnScroll();
            initLeaderCardHoverFlip();
        });
    } else {
        animateOnScroll();
        initLeaderCardHoverFlip();
    }
    
})();
