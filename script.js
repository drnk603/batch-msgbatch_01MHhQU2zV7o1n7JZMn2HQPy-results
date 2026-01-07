(function() {
    'use strict';
    
    window.__app = window.__app || {};
    
    const utils = {
        throttle: function(func, delay) {
            let timeoutId;
            let lastExecTime = 0;
            return function() {
                const context = this;
                const args = arguments;
                const currentTime = Date.now();
                
                if (currentTime - lastExecTime > delay) {
                    func.apply(context, args);
                    lastExecTime = currentTime;
                } else {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function() {
                        func.apply(context, args);
                        lastExecTime = Date.now();
                    }, delay - (currentTime - lastExecTime));
                }
            };
        },
        
        debounce: function(func, delay) {
            let timeoutId;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    func.apply(context, args);
                }, delay);
            };
        },
        
        isHomepage: function() {
            const path = window.location.pathname;
            return path === '/' || path === '/index.html' || path.endsWith('/index.html');
        }
    };
    
    const burgerMenuModule = {
        init: function() {
            if (window.__app.burgerInit) return;
            window.__app.burgerInit = true;
            
            const toggle = document.querySelector('.navbar-toggler');
            const collapse = document.querySelector('.navbar-collapse');
            
            if (!toggle || !collapse) return;
            
            let isOpen = false;
            
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                isOpen = !isOpen;
                
                if (isOpen) {
                    collapse.classList.add('show');
                    collapse.style.maxHeight = 'calc(100vh - var(--header-h))';
                    toggle.setAttribute('aria-expanded', 'true');
                    document.body.classList.add('u-no-scroll');
                } else {
                    collapse.classList.remove('show');
                    collapse.style.maxHeight = '0';
                    toggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('u-no-scroll');
                }
            });
            
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (isOpen) {
                        collapse.classList.remove('show');
                        collapse.style.maxHeight = '0';
                        toggle.setAttribute('aria-expanded', 'false');
                        document.body.classList.remove('u-no-scroll');
                        isOpen = false;
                    }
                });
            });
            
            document.addEventListener('click', function(e) {
                if (isOpen && !collapse.contains(e.target) && !toggle.contains(e.target)) {
                    collapse.classList.remove('show');
                    collapse.style.maxHeight = '0';
                    toggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('u-no-scroll');
                    isOpen = false;
                }
            });
            
            window.addEventListener('resize', utils.debounce(function() {
                if (window.innerWidth >= 768 && isOpen) {
                    collapse.classList.remove('show');
                    collapse.style.maxHeight = '';
                    toggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('u-no-scroll');
                    isOpen = false;
                }
            }, 250));
        }
    };
    
    const scrollAnimationsModule = {
        init: function() {
            if (window.__app.scrollAnimInit) return;
            window.__app.scrollAnimInit = true;
            
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            const animateElements = document.querySelectorAll('.c-card, .media-mention, .c-form, .hero-content, .brochure-content');
            animateElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                observer.observe(el);
            });
        }
    };
    
    const imageAnimationsModule = {
        init: function() {
            if (window.__app.imageAnimInit) return;
            window.__app.imageAnimInit = true;
            
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '1';
                        img.style.transform = 'scale(1)';
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            images.forEach(img => {
                img.style.opacity = '0';
                img.style.transform = 'scale(0.95)';
                img.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                imageObserver.observe(img);
            });
        }
    };
    
    const buttonRippleModule = {
        init: function() {
            if (window.__app.rippleInit) return;
            window.__app.rippleInit = true;
            
            const buttons = document.querySelectorAll('.c-button, .btn, .nav-link');
            
            buttons.forEach(button => {
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple-effect 0.6s ease-out';
                    ripple.style.pointerEvents = 'none';
                    
                    button.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple-effect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    const hoverEffectsModule = {
        init: function() {
            if (window.__app.hoverInit) return;
            window.__app.hoverInit = true;
            
            const cards = document.querySelectorAll('.c-card, .card, .media-mention');
            
            cards.forEach(card => {
                card.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
                
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = 'var(--shadow-xl)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'var(--shadow-sm)';
                });
            });
            
            const buttons = document.querySelectorAll('.c-button, .btn');
            buttons.forEach(btn => {
                btn.style.transition = 'all 0.25s ease-out';
            });
        }
    };
    
    const formValidationModule = {
        init: function() {
            if (window.__app.formValidInit) return;
            window.__app.formValidInit = true;
            
            const patterns = {
                name: /^[a-zA-ZÀ-ÿs-']{2,50}$/,
                email: /^[^s@]+@[^s@]+.[^s@]+$/,
                phone: /^[ds+-()]{10,20}$/,
                message: /^.{10,}$/
            };
            
            const errorMessages = {
                name: 'Naam moet 2-50 tekens bevatten (alleen letters)',
                email: 'Voer een geldig e-mailadres in',
                phone: 'Voer een geldig telefoonnummer in (10-20 cijfers)',
                message: 'Bericht moet minimaal 10 tekens bevatten',
                consent: 'U moet akkoord gaan met de voorwaarden',
                required: 'Dit veld is verplicht'
            };
            
            function validateField(field) {
                const fieldType = field.type;
                const fieldValue = field.value.trim();
                const fieldName = field.name || field.id;
                let isValid = true;
                let errorMessage = '';
                
                if (field.hasAttribute('required') && !fieldValue && fieldType !== 'checkbox') {
                    isValid = false;
                    errorMessage = errorMessages.required;
                } else if (fieldType === 'checkbox' && field.hasAttribute('required') && !field.checked) {
                    isValid = false;
                    errorMessage = errorMessages.consent;
                } else if (fieldValue) {
                    if (fieldName.includes('name') || fieldName.includes('Name')) {
                        isValid = patterns.name.test(fieldValue);
                        errorMessage = errorMessages.name;
                    } else if (fieldType === 'email' || fieldName.includes('email')) {
                        isValid = patterns.email.test(fieldValue);
                        errorMessage = errorMessages.email;
                    } else if (fieldType === 'tel' || fieldName.includes('phone')) {
                        isValid = patterns.phone.test(fieldValue);
                        errorMessage = errorMessages.phone;
                    } else if (fieldName.includes('message')) {
                        isValid = patterns.message.test(fieldValue);
                        errorMessage = errorMessages.message;
                    }
                }
                
                const formGroup = field.closest('.c-form__group') || field.closest('.mb-3') || field.parentElement;
                let errorElement = formGroup.querySelector('.c-form__error, .invalid-feedback');
                
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'c-form__error invalid-feedback';
                    if (field.type === 'checkbox') {
                        field.closest('.form-check').appendChild(errorElement);
                    } else {
                        field.parentElement.appendChild(errorElement);
                    }
                }
                
                if (!isValid) {
                    field.classList.add('is-invalid');
                    field.style.borderColor = 'var(--color-error)';
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                    errorElement.style.color = 'var(--color-error)';
                    errorElement.style.fontSize = 'var(--text-sm)';
                    errorElement.style.marginTop = 'var(--space-xs)';
                } else {
                    field.classList.remove('is-invalid');
                    field.style.borderColor = '';
                    errorElement.style.display = 'none';
                }
                
                return isValid;
            }
            
            const forms = document.querySelectorAll('.c-form, form');
            
            forms.forEach(form => {
                const fields = form.querySelectorAll('input, textarea, select');
                
                fields.forEach(field => {
                    field.addEventListener('blur', function() {
                        validateField(this);
                    });
                    
                    field.addEventListener('input', function() {
                        if (this.classList.contains('is-invalid')) {
                            validateField(this);
                        }
                    });
                });
                
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    let isFormValid = true;
                    
                    fields.forEach(field => {
                        if (!validateField(field)) {
                            isFormValid = false;
                        }
                    });
                    
                    if (!isFormValid) {
                        const firstInvalid = form.querySelector('.is-invalid');
                        if (firstInvalid) {
                            firstInvalid.focus();
                            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        return;
                    }
                    
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn ? submitBtn.innerHTML : '';
                    
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px;"></span>Verzenden...';
                    }
                    
                    const style = document.createElement('style');
                    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
                    document.head.appendChild(style);
                    
                    setTimeout(() => {
                        window.location.href = 'thank_you.html';
                    }, 1000);
                });
            });
        }
    };
    
    const scrollSpyModule = {
        init: function() {
            if (window.__app.scrollSpyInit) return;
            window.__app.scrollSpyInit = true;
            
            if (!utils.isHomepage()) return;
            
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
            
            if (sections.length === 0 || navLinks.length === 0) return;
            
            function updateActiveLink() {
                let currentSection = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const scrollPosition = window.scrollY + 100;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('is-active');
                    link.removeAttribute('aria-current');
                    
                    if (link.getAttribute('href') === '#' + currentSection) {
                        link.classList.add('is-active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
            
            window.addEventListener('scroll', utils.throttle(updateActiveLink, 100));
            updateActiveLink();
        }
    };
    
    const smoothScrollModule = {
        init: function() {
            if (window.__app.smoothScrollInit) return;
            window.__app.smoothScrollInit = true;
            
            document.addEventListener('click', function(e) {
                const target = e.target.closest('a[href^="#"]');
                if (!target) return;
                
                const href = target.getAttribute('href');
                if (!href || href === '#' || href === '#!') return;
                
                e.preventDefault();
                
                const sectionId = href.replace('#', '');
                const section = document.getElementById(sectionId);
                
                if (section) {
                    const header = document.querySelector('.l-header');
                    const offset = header ? header.offsetHeight : 80;
                    const top = section.offsetTop - offset;
                    
                    window.scrollTo({
                        top: Math.max(0, top),
                        behavior: 'smooth'
                    });
                }
            });
        }
    };
    
    const countUpModule = {
        init: function() {
            if (window.__app.countUpInit) return;
            window.__app.countUpInit = true;
            
            const countElements = document.querySelectorAll('[data-count]');
            
            if (countElements.length === 0) return;
            
            function animateCount(element) {
                const target = parseInt(element.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        element.textContent = target;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }, 16);
            }
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            countElements.forEach(el => observer.observe(el));
        }
    };
    
    const scrollToTopModule = {
        init: function() {
            if (window.__app.scrollTopInit) return;
            window.__app.scrollTopInit = true;
            
            const scrollBtn = document.createElement('button');
            scrollBtn.innerHTML = '↑';
            scrollBtn.setAttribute('aria-label', 'Scroll naar boven');
            scrollBtn.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 48px;
                height: 48px;
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease-out;
                z-index: 999;
                box-shadow: var(--shadow-lg);
            `;
            
            document.body.appendChild(scrollBtn);
            
            window.addEventListener('scroll', utils.throttle(function() {
                if (window.scrollY > 300) {
                    scrollBtn.style.opacity = '1';
                    scrollBtn.style.visibility = 'visible';
                } else {
                    scrollBtn.style.opacity = '0';
                    scrollBtn.style.visibility = 'hidden';
                }
            }, 100));
            
            scrollBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            scrollBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = 'var(--shadow-xl)';
            });
            
            scrollBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });
        }
    };
    
    const lazyLoadModule = {
        init: function() {
            if (window.__app.lazyLoadInit) return;
            window.__app.lazyLoadInit = true;
            
            const images = document.querySelectorAll('img:not([loading])');
            const videos = document.querySelectorAll('video:not([loading])');
            
            images.forEach(img => {
                if (!img.classList.contains('c-logo__img')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
            
            videos.forEach(video => {
                video.setAttribute('loading', 'lazy');
            });
        }
    };
    
    window.__app.init = function() {
        if (window.__app.mainInit) return;
        window.__app.mainInit = true;
        
        burgerMenuModule.init();
        scrollAnimationsModule.init();
        imageAnimationsModule.init();
        buttonRippleModule.init();
        hoverEffectsModule.init();
        formValidationModule.init();
        scrollSpyModule.init();
        smoothScrollModule.init();
        countUpModule.init();
        scrollToTopModule.init();
        lazyLoadModule.init();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.__app.init);
    } else {
        window.__app.init();
    }
    
})();
.navbar-collapse {
    position: fixed;
    top: var(--header-h);
    left: 0;
    right: 0;
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-border);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;
    box-shadow: var(--shadow-lg);
    z-index: var(--z-nav);
    height: calc(100vh - var(--header-h));
}

.navbar-collapse.show {
    max-height: calc(100vh - var(--header-h));
    overflow-y: auto;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.c-card, .card {
    animation: fadeInUp 0.6s ease-out;
}

.c-button:active, .btn:active {
    transform: scale(0.96);
}

.nav-link {
    position: relative;
    overflow: hidden;
}

.nav-link::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: var(--color-primary);
    transform: scaleX(0);
    transition: transform 0.3s ease-out;
}

.nav-link:hover::before,
.nav-link.is-active::before {
    transform: scaleX(1);
}

.c-form__input:focus, .form-control:focus, .form-select:focus {
    animation: inputFocus 0.3s ease-out;
}

@keyframes inputFocus {
    0% {
        box-shadow: 0 0 0 0 rgba(127, 176, 105, 0.4);
    }
    100% {
        box-shadow: 0 0 0 3px rgba(127, 176, 105, 0.15);
    }
}

.hero-section {
    animation: fadeIn 1s ease-out;
}

.carousel-item {
    animation: fadeIn 0.6s ease-in-out;
}

img[loading="lazy"] {
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.media-mention {
    transition: all 0.3s ease-out;
}

.media-mention:hover {
    transform: translateY(-6px) scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
