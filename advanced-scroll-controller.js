// Advanced Scroll Controller for Smart Header Behavior
class AdvancedScrollController {
    constructor() {
        this.subHeader = document.querySelector('.sub-header');
        this.mainHeader = document.querySelector('.header');
        this.hero = document.querySelector('.hero, .page-hero');
        this.main = document.querySelector('main');
        
        this.lastScrollY = 0;
        this.scrollThreshold = 100;
        this.hideThreshold = 200;
        this.isHeaderHidden = false;
        this.isScrollingDown = false;
        this.scrollTimeout = null;
        this.ticking = false;
        
        if (this.subHeader && this.mainHeader) {
            this.init();
        }
    }
    
    init() {
        this.setupScrollListener();
        this.setupResizeListener();
        this.setupIntersectionObserver();
        this.addScrollIndicators();
        this.initializeCarouselEnhancements();
    }
    
    setupScrollListener() {
        let scrollTimer = null;
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
            
            // Clear the scroll timer
            clearTimeout(scrollTimer);
            
            // Set a timer to trigger when scrolling stops
            scrollTimer = setTimeout(() => {
                this.onScrollStop();
            }, 150);
        }, { passive: true });
    }
    
    handleScroll() {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
        const scrollDelta = Math.abs(currentScrollY - this.lastScrollY);
        
        // Update sub-header scroll class
        if (currentScrollY > 50) {
            this.subHeader.classList.add('scrolled');
        } else {
            this.subHeader.classList.remove('scrolled');
        }
        
        // Smart header hiding logic
        if (scrollDirection === 'down' && currentScrollY > this.hideThreshold && scrollDelta > 5) {
            this.hideMainHeader();
        } else if (scrollDirection === 'up' && scrollDelta > 5) {
            this.showMainHeader();
        }
        
        // Update scroll position
        this.lastScrollY = currentScrollY;
        this.isScrollingDown = scrollDirection === 'down';
        
        // Update carousel behavior based on scroll
        this.updateCarouselBehavior(currentScrollY);
    }
    
    hideMainHeader() {
        if (!this.isHeaderHidden) {
            this.isHeaderHidden = true;
            this.mainHeader.classList.add('hidden');
            this.subHeader.classList.add('header-hidden');
            
            // Adjust content padding
            if (this.main) {
                this.main.classList.add('content-adjusted');
            }
            
            this.triggerHeaderHideAnimation();
        }
    }
    
    showMainHeader() {
        if (this.isHeaderHidden) {
            this.isHeaderHidden = false;
            this.mainHeader.classList.remove('hidden');
            this.subHeader.classList.remove('header-hidden');
            
            // Remove content padding adjustment
            if (this.main) {
                this.main.classList.remove('content-adjusted');
            }
            
            this.triggerHeaderShowAnimation();
        }
    }
    
    triggerHeaderHideAnimation() {
        // Add smooth transition effects
        this.subHeader.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            this.subHeader.style.transform = 'translateY(0)';
        }, 200);
    }
    
    triggerHeaderShowAnimation() {
        // Add smooth transition effects
        this.mainHeader.style.transform = 'translateY(-10px)';
        this.mainHeader.style.opacity = '0';
        
        requestAnimationFrame(() => {
            this.mainHeader.style.transform = 'translateY(0)';
            this.mainHeader.style.opacity = '1';
        });
    }
    
    onScrollStop() {
        // Enhanced behavior when scrolling stops
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollY < this.scrollThreshold && this.isHeaderHidden) {
            this.showMainHeader();
        }
        
        // Resume carousel if paused
        this.resumeCarouselIfNeeded();
    }
    
    updateCarouselBehavior(scrollY) {
        const carousel = document.querySelector('.carousel-track');
        if (!carousel) return;
        
        // Adjust carousel speed based on scroll velocity
        const scrollVelocity = Math.abs(scrollY - this.lastScrollY);
        
        if (scrollVelocity > 20) {
            // Fast scrolling - pause carousel
            carousel.style.animationPlayState = 'paused';
        } else if (scrollVelocity < 5) {
            // Slow/no scrolling - resume carousel
            carousel.style.animationPlayState = 'running';
        }
    }
    
    resumeCarouselIfNeeded() {
        const carousel = document.querySelector('.carousel-track');
        if (carousel) {
            carousel.style.animationPlayState = 'running';
        }
    }
    
    setupIntersectionObserver() {
        // Enhanced intersection observer for hero section
        if (this.hero) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.subHeader.classList.remove('hero-passed');
                    } else {
                        this.subHeader.classList.add('hero-passed');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '-50px 0px'
            });
            
            observer.observe(this.hero);
        }
    }
    
    setupResizeListener() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        // Reset header state on resize
        if (window.innerWidth !== this.lastWidth) {
            this.showMainHeader();
            this.lastWidth = window.innerWidth;
        }
    }
    
    addScrollIndicators() {
        // Add visual scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, #fff, rgba(255,255,255,0.8), #fff);
            z-index: 1002;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(255,255,255,0.5);
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }
    
    initializeCarouselEnhancements() {
        // Add enhanced carousel features
        const carouselLinks = document.querySelectorAll('.carousel-link');
        
        carouselLinks.forEach(link => {
            // Add hover sound effect (optional)
            link.addEventListener('mouseenter', () => {
                this.playHoverEffect(link);
            });
            
            // Add click ripple effect
            link.addEventListener('click', (e) => {
                this.createRippleEffect(e, link);
            });
            
            // Add link indicator if not present
            if (!link.querySelector('.link-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'link-indicator';
                link.appendChild(indicator);
            }
        });
    }
    
    playHoverEffect(element) {
        // Subtle animation enhancement
        element.style.transform = element.style.transform + ' scale(1.02)';
        
        setTimeout(() => {
            element.style.transform = element.style.transform.replace(' scale(1.02)', '');
        }, 200);
    }
    
    createRippleEffect(event, element) {
        // Create ripple effect on click
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Enhanced carousel navigation
    enableKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.sub-header')) {
                const links = Array.from(document.querySelectorAll('.carousel-link'));
                const activeIndex = links.findIndex(link => link.classList.contains('active'));
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        const prevIndex = activeIndex > 0 ? activeIndex - 1 : links.length - 1;
                        this.setActiveLink(links[prevIndex]);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        const nextIndex = activeIndex < links.length - 1 ? activeIndex + 1 : 0;
                        this.setActiveLink(links[nextIndex]);
                        break;
                    case 'Enter':
                        e.preventDefault();
                        if (activeIndex !== -1) {
                            links[activeIndex].click();
                        }
                        break;
                }
            }
        });
    }
    
    setActiveLink(link) {
        document.querySelectorAll('.carousel-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        link.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}

// Initialize the advanced scroll controller
document.addEventListener('DOMContentLoaded', () => {
    const scrollController = new AdvancedScrollController();
    
    // Make it globally accessible for debugging
    window.scrollController = scrollController;
});

// Enhanced performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Preload optimization for smooth animations
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical animations
    const style = document.createElement('style');
    style.textContent = `
        .header, .sub-header {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
        }
    `;
    document.head.appendChild(style);
});