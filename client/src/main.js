// Main JavaScript file for Tettrix website
(function() {
    'use strict';

    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        toggleMobileMenu();
                    }
                }
            });
        });
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('mobile-menu-btn');
        const icon = menuBtn.querySelector('i');
        
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('show');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    // Initialize mobile menu
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
    }

    // Navbar background on scroll
    function initNavbarScroll() {
        const nav = document.querySelector('nav');
        
        function updateNavbar() {
            if (window.scrollY > 50) {
                nav.classList.add('bg-card/95');
            } else {
                nav.classList.remove('bg-card/95');
            }
        }
        
        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // Initial call
    }

    // Toggle nav link colors: white on Home (hero in view), default elsewhere
    function initNavbarColorMode() {
        const nav = document.querySelector('nav');
        const hero = document.getElementById('home');
        if (!nav || !hero) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    nav.classList.add('nav-on-hero');
                } else {
                    nav.classList.remove('nav-on-hero');
                }
            });
        }, { threshold: [0, 0.3, 0.6, 1] });

        observer.observe(hero);
    }

    // Form validation
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            const fieldName = field.name || field.id;
            
            // Remove existing error styling
            field.classList.remove('border-destructive');
            
            if (!value) {
                field.classList.add('border-destructive');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(value)) {
                field.classList.add('border-destructive');
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form status
    function showFormStatus(message, isError = false) {
        const statusDiv = document.getElementById('form-status');
        statusDiv.textContent = message;
        statusDiv.className = isError ? 'mt-4 status-error' : 'mt-4 status-success';
        statusDiv.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);
    }

    // Handle contact form submission
    async function handleContactSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Validate form
        if (!validateForm(form)) {
            showFormStatus('Please fill in all required fields correctly.', true);
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (response.ok) {
                const result = await response.json();
                showFormStatus('Thank you for your message! We will get back to you soon.');
                form.reset();
            } else {
                const error = await response.json();
                showFormStatus(error.message || 'Failed to send message. Please try again.', true);
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showFormStatus('Network error. Please check your connection and try again.', true);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    // Initialize contact form
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactSubmit);
        }
    }

    // Initialize pricing buttons
    function initPricingButtons() {
        const pricingButtons = document.querySelectorAll('[data-testid^="button-select-"]');
        pricingButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Scroll to contact form
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Pre-fill service selection if available
                    setTimeout(() => {
                        const serviceSelect = document.getElementById('service');
                        const buttonId = button.getAttribute('data-testid');
                        
                        if (serviceSelect && buttonId) {
                            if (buttonId.includes('website')) {
                                serviceSelect.value = 'website-design';
                            } else if (buttonId.includes('admin')) {
                                serviceSelect.value = 'system-admin';
                            } else if (buttonId.includes('security')) {
                                serviceSelect.value = 'it-security';
                            }
                        }
                    }, 500);
                }
            });
        });
    }

    // Add intersection observer for animations
    function initAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -30px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation delay for service cards
                    if (entry.target.classList.contains('service-card')) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-slide-in-up');
                        }, index * 150); // 150ms delay between each card
                    } else {
                        entry.target.classList.add('animate-fade-in');
                    }
                }
            });
        }, observerOptions);
        
        // Observe service cards and team cards
        document.querySelectorAll('.service-card, .team-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Language management functionality
    function initLanguageManager() {
        import('./translations.js').then(module => {
            const { LanguageManager } = module;
            window.languageManager = new LanguageManager();
            
            // Initialize language system
            window.languageManager.init();
            
            // Setup event listeners for language selectors
            const desktopSelector = document.getElementById('language-selector');
            const mobileSelector = document.getElementById('language-selector-mobile');
            
            function handleLanguageChange(e) {
                const selectedLanguage = e.target.value;
                window.languageManager.setLanguage(selectedLanguage);
                
                // Sync both selectors
                if (desktopSelector) desktopSelector.value = selectedLanguage;
                if (mobileSelector) mobileSelector.value = selectedLanguage;
            }
            
            if (desktopSelector) {
                desktopSelector.addEventListener('change', handleLanguageChange);
            }
            
            if (mobileSelector) {
                mobileSelector.addEventListener('change', handleLanguageChange);
            }
        }).catch(error => {
            console.error('Failed to load language manager:', error);
        });
    }

    // Initialize everything when DOM is loaded
    function init() {
        initSmoothScrolling();
        initMobileMenu();
        initNavbarScroll();
        initNavbarColorMode();
        initContactForm();
        initPricingButtons();
        initAnimations();
        initLanguageManager();
        
        console.log('Tettrix website initialized successfully');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
