class CarShowcase {
    constructor() {
        this.currentSection = 0;
        this.sections = ['toyota', 'mitsubishi', 'honda', 'pickup'];
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        this.particles = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.startAutoSlide();
        this.initParallax();
        this.animateOnLoad();
    }

    setupEventListeners() {
        // Navigation dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSection(index);
            });
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSection(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                this.nextSection();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                this.prevSection();
            }
        });

        // Mouse wheel navigation
        document.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;
            
            if (e.deltaY > 0) {
                this.nextSection();
            } else {
                this.prevSection();
            }
        });

        // CTA button interactions
        const ctaButtons = document.querySelectorAll('.cta-btn');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleCTAClick(btn);
            });
        });

        // Car hover effects
        const carPlaceholders = document.querySelectorAll('.car-placeholder');
        carPlaceholders.forEach(car => {
            car.addEventListener('mouseenter', () => {
                this.createBurstEffect(car);
            });
        });

        // Pause auto-slide on hover
        const container = document.querySelector('.container');
        container.addEventListener('mouseenter', () => {
            this.pauseAutoSlide();
        });
        
        container.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    goToSection(index) {
        if (this.isTransitioning || index === this.currentSection) return;
        
        this.isTransitioning = true;
        
        // Update current section
        const currentSectionEl = document.querySelector('.car-section.active');
        const newSectionEl = document.querySelector(`#${this.sections[index]}`);
        const currentDot = document.querySelector('.dot.active');
        const newDot = document.querySelectorAll('.dot')[index];
        
        // Animate out current section
        currentSectionEl.style.transform = 'translateX(-100%)';
        currentSectionEl.style.opacity = '0';
        
        setTimeout(() => {
            currentSectionEl.classList.remove('active');
            currentSectionEl.style.transform = 'translateX(100%)';
            
            // Animate in new section
            newSectionEl.style.transform = 'translateX(100%)';
            newSectionEl.classList.add('active');
            
            setTimeout(() => {
                newSectionEl.style.transform = 'translateX(0)';
                newSectionEl.style.opacity = '1';
                
                // Update dots
                currentDot.classList.remove('active');
                newDot.classList.add('active');
                
                this.currentSection = index;
                this.isTransitioning = false;
                
                // Update particles for new section
                this.updateParticlesForSection(this.sections[index]);
            }, 50);
        }, 400);
    }

    nextSection() {
        const nextIndex = (this.currentSection + 1) % this.sections.length;
        this.goToSection(nextIndex);
    }

    prevSection() {
        const prevIndex = (this.currentSection - 1 + this.sections.length) % this.sections.length;
        this.goToSection(prevIndex);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSection();
        }, 8000);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    initParallax() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Parallax effect on car visuals
            const carVisuals = document.querySelectorAll('.car-visual');
            carVisuals.forEach(visual => {
                const moveX = (mouseX - 0.5) * 30;
                const moveY = (mouseY - 0.5) * 20;
                visual.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            // Parallax effect on background elements
            const backgrounds = document.querySelectorAll('.skyline-bg, .mountain-bg, .neon-bg, .terrain-bg');
            backgrounds.forEach(bg => {
                const moveX = (mouseX - 0.5) * 15;
                const moveY = (mouseY - 0.5) * 10;
                bg.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    createParticles() {
        const particlesContainer = document.querySelector('.particles');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    updateParticlesForSection(sectionName) {
        const colors = {
            toyota: 'rgba(44, 90, 160, 0.6)',
            mitsubishi: 'rgba(255, 193, 7, 0.6)',
            honda: 'rgba(255, 0, 128, 0.6)',
            pickup: 'rgba(139, 69, 19, 0.6)'
        };
        
        this.particles.forEach(particle => {
            particle.style.background = colors[sectionName] || 'rgba(255, 107, 53, 0.6)';
        });
    }

    createBurstEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            const burst = document.createElement('div');
            burst.style.position = 'fixed';
            burst.style.left = centerX + 'px';
            burst.style.top = centerY + 'px';
            burst.style.width = '6px';
            burst.style.height = '6px';
            burst.style.background = '#ff6b35';
            burst.style.borderRadius = '50%';
            burst.style.pointerEvents = 'none';
            burst.style.zIndex = '9999';
            
            const angle = (i / 15) * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const duration = Math.random() * 800 + 600;
            
            document.body.appendChild(burst);
            
            burst.animate([
                {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                document.body.removeChild(burst);
            };
        }
    }

    handleCTAClick(button) {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Create success effect
        this.createSuccessEffect(button);
        
        // Simulate action
        const originalText = button.textContent;
        button.textContent = 'PROCESSING...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'SUCCESS!';
            button.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(45deg, #ff6b35, #f7931e)';
                button.disabled = false;
            }, 2000);
        }, 1500);
    }

    createSuccessEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const successRing = document.createElement('div');
        successRing.style.position = 'fixed';
        successRing.style.left = centerX + 'px';
        successRing.style.top = centerY + 'px';
        successRing.style.width = '20px';
        successRing.style.height = '20px';
        successRing.style.border = '3px solid #4CAF50';
        successRing.style.borderRadius = '50%';
        successRing.style.pointerEvents = 'none';
        successRing.style.zIndex = '9999';
        successRing.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(successRing);
        
        successRing.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: 'translate(-50%, -50%) scale(3)',
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => {
            document.body.removeChild(successRing);
        };
    }

    animateOnLoad() {
        // Animate elements on page load
        const brand = document.querySelector('.toyota-section .brand');
        const model = document.querySelector('.toyota-section .model');
        const tagline = document.querySelector('.toyota-section .tagline');
        const features = document.querySelectorAll('.toyota-section .features span');
        const price = document.querySelector('.toyota-section .price');
        const ctaBtn = document.querySelector('.toyota-section .cta-btn');
        const carVisual = document.querySelector('.toyota-section .car-visual');
        
        // Stagger animations
        setTimeout(() => brand.style.animation = 'slideInLeft 0.8s ease forwards', 200);
        setTimeout(() => model.style.animation = 'slideInLeft 0.8s ease forwards', 400);
        setTimeout(() => tagline.style.animation = 'slideInLeft 0.8s ease forwards', 600);
        
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.animation = 'slideInLeft 0.6s ease forwards';
            }, 800 + (index * 100));
        });
        
        setTimeout(() => price.style.animation = 'slideInLeft 0.8s ease forwards', 1200);
        setTimeout(() => ctaBtn.style.animation = 'slideInLeft 0.8s ease forwards', 1400);
        setTimeout(() => carVisual.style.animation = 'slideInRight 1s ease forwards', 600);
    }
}

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

// Add additional styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the car showcase when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarShowcase();
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next section
                window.carShowcase?.nextSection();
            } else {
                // Swipe right - previous section
                window.carShowcase?.prevSection();
            }
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Store reference globally for touch events
document.addEventListener('DOMContentLoaded', () => {
    window.carShowcase = new CarShowcase();
});
