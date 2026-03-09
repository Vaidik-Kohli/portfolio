/* ==========================================
   PORTFOLIO — Vaidik Kohli
   Main JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');
    const fadeElements = document.querySelectorAll('.fade-up');

    // ---- Create mobile overlay ----
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    // ==========================================
    // 1. NAVBAR — Scroll Effect
    // ==========================================
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Run on load

    // ==========================================
    // 2. NAVBAR — Active Section Highlighting
    // ==========================================
    function highlightActiveSection() {
        const scrollPos = window.scrollY + 150;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    highlightActiveSection();

    // ==========================================
    // 3. MOBILE MENU — Toggle
    // ==========================================
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close menu when a nav link is clicked
    navLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on resize (if it was open on mobile and user resizes to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // ==========================================
    // 4. SMOOTH SCROLL — With offset for fixed nav
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth',
                });
            }
        });
    });

    // ==========================================
    // 5. FADE-UP — Intersection Observer
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach((el) => {
        fadeObserver.observe(el);
    });

    // ==========================================
    // 6. TYPING EFFECT — Hero greeting
    // ==========================================
    const greetingEl = document.querySelector('.hero-greeting');
    if (greetingEl) {
        const originalText = greetingEl.textContent;
        greetingEl.textContent = '';
        greetingEl.classList.add('visible'); // Don't hide via fade-up
        greetingEl.style.opacity = '1';
        greetingEl.style.transform = 'none';

        let charIndex = 0;
        const typingSpeed = 60;

        function typeText() {
            if (charIndex < originalText.length) {
                greetingEl.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, typingSpeed);
            } else {
                // Add blinking cursor after typing finishes
                const cursor = document.createElement('span');
                cursor.classList.add('typing-cursor');
                cursor.textContent = '|';
                greetingEl.appendChild(cursor);
            }
        }

        // Delay start to let the page load
        setTimeout(typeText, 500);
    }

    // ==========================================
    // 7. CONTACT FORM — Basic handler
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // If using Formspree, let the form submit naturally
            // For now, show a basic feedback message
            const action = contactForm.getAttribute('action');

            // If it's still the placeholder action, prevent submission
            if (action.includes('your-form-id')) {
                e.preventDefault();

                const btn = contactForm.querySelector('.btn-submit');
                const originalHTML = btn.innerHTML;

                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Message Sent!
                `;
                btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }
        });
    }

    // ==========================================
    // 8. CURSOR BLINK CSS (inject dynamically)
    // ==========================================
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .typing-cursor {
            display: inline;
            color: var(--accent-1);
            font-weight: 300;
            animation: blink 1s infinite;
            margin-left: 2px;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(cursorStyle);
});
