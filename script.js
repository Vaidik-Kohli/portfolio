/* =====================================
   Vaidik Portfolio — Main Behavior
   Effects: parallax, ambient cursor reveal,
   staggered section reveals, nav active state.
   ===================================== */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const observedSections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const touchDevice = window.matchMedia('(hover: none)').matches;

    setupActiveNav(navLinks, observedSections, header);
    setupRevealAnimations();
    setupParallaxHero(hero);
    setupCursorReveal(touchDevice);
    setupContactForm();
});

function setupActiveNav(navLinks, sections, header) {
    if (!navLinks.length || !sections.length) return;

    const updateActive = () => {
        const headerHeight = header ? header.offsetHeight : 0;
        const marker = window.scrollY + headerHeight + window.innerHeight * 0.2;
        let currentId = sections[0].id;

        sections.forEach((section) => {
            if (marker >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const targetId = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', targetId === currentId);
        });
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();
}

function setupRevealAnimations() {
    const revealTargets = collectRevealTargets();

    revealTargets.forEach((element) => {
        element.classList.add('reveal');
    });

    applySectionStagger();

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            root: null,
            rootMargin: '0px 0px -6% 0px',
        }
    );

    revealTargets.forEach((element) => {
        observer.observe(element);
    });
}

function collectRevealTargets() {
    const targets = new Set();
    const selectors = [
        'section',
        '.project',
        '.blog-item',
        '.about-facts li',
        '.highlight-card',
        '.skill-item',
        '.skill-tag',
        '.github-card',
        '.graph-wrap',
        '.contact-copy',
        'form',
    ];

    selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((node) => targets.add(node));
    });

    return Array.from(targets);
}

function applySectionStagger() {
    const staggerSelectors = [
        '.project',
        '.blog-item',
        '.about-facts li',
        '.highlight-card',
        '.skill-item',
        '.skill-tag',
        '.github-card',
        '.graph-wrap',
        '.contact-copy',
        'form',
        '.section-head',
    ].join(', ');

    document.querySelectorAll('section').forEach((section) => {
        const children = Array.from(section.querySelectorAll(staggerSelectors))
            .filter((element) => element.classList.contains('reveal'));

        children.forEach((element, index) => {
            element.style.transitionDelay = `${index * 90}ms`;
        });
    });
}

function setupParallaxHero(hero) {
    if (!hero || window.innerWidth < 768) return;

    const layer = document.createElement('div');
    layer.className = 'hero-parallax-layer';
    layer.setAttribute('aria-hidden', 'true');
    hero.prepend(layer);

    let rafId = null;
    let latestY = window.scrollY;

    const render = () => {
        rafId = null;

        const heroTop = hero.offsetTop;
        const heroBottom = heroTop + hero.offsetHeight;
        const viewportBottom = latestY + window.innerHeight;

        if (viewportBottom < heroTop || latestY > heroBottom) {
            return;
        }

        const offset = (latestY - heroTop) * 0.35;
        layer.style.transform = `translateY(${offset}px)`;
    };

    const onScroll = () => {
        latestY = window.scrollY;
        if (!rafId) {
            rafId = window.requestAnimationFrame(render);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
}

function setupCursorReveal(touchDevice) {
    if (touchDevice) return;

    const wordsLayer = document.createElement('div');
    wordsLayer.className = 'ambient-words';
    wordsLayer.setAttribute('aria-hidden', 'true');

    const glowLayer = document.createElement('div');
    glowLayer.className = 'cursor-glow';
    glowLayer.setAttribute('aria-hidden', 'true');

    const words = ['build', 'design', 'ship', 'code', 'craft', 'make'];
    const positions = [
        { top: '8%',  left: '-2%', rotate: '-8deg'  },
        { top: '16%', left: '58%', rotate: '6deg'   },
        { top: '40%', left: '10%', rotate: '-4deg'  },
        { top: '55%', left: '62%', rotate: '9deg'   },
        { top: '72%', left: '-3%', rotate: '-6deg'  },
        { top: '78%', left: '55%', rotate: '5deg'   },
    ];

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'ambient-word';
        span.textContent = word;
        span.style.top = positions[index].top;
        span.style.left = positions[index].left;
        span.style.transform = `rotate(${positions[index].rotate})`;
        wordsLayer.appendChild(span);
    });

    // Inject words into hero only, glow stays full-page
    const hero = document.querySelector('.hero');
    if (hero) hero.appendChild(wordsLayer);

    document.body.prepend(glowLayer);
    document.body.prepend(wordsLayer);

    let rafId = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const updateGlow = () => {
        rafId = null;
        glowLayer.style.setProperty('--glow-x', `${mouseX}px`);
        glowLayer.style.setProperty('--glow-y', `${mouseY}px`);
    };

    window.addEventListener(
        'mousemove',
        (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            if (!rafId) {
                rafId = window.requestAnimationFrame(updateGlow);
            }
        },
        { passive: true }
    );

    updateGlow();
}

function setupContactForm() {
    const form = document.querySelector('form[aria-label="Contact form"]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.reset();
    });
}
