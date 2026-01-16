(function optimizeProjectImages() {
    'use strict';
    
    const criticalImages = [
        'assets/images/projects/small/project1.webp',
        'assets/images/projects/small/project2.webp',
        'assets/images/projects/large/project1-1.webp',
        'assets/images/projects/large/project1-2.webp',
        'assets/images/projects/small/project3.webp',
        'assets/images/projects/small/project4.webp',
        'assets/images/projects/small/project5.webp',
        'assets/images/projects/small/project6.webp'
    ];
    
    function preloadCriticalImages() {
        criticalImages.forEach((src, index) => {
            const img = new Image();
            img.fetchPriority = index > 3 ? 'low' : 'high';
            img.decoding = 'async';
            img.src = src;
        });
    }
    
    function setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.loading = 'lazy';
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            observer.unobserve(img);
                        }
                    }
                });
            }, { rootMargin: '50px 0px', threshold: 0.01 });
            
            document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        preloadCriticalImages();
        setupLazyLoading();
    });
    
    if (document.readyState === 'loading') {
        const firstImg = new Image();
        firstImg.src = 'assets/images/projects/small/project1.webp';
        firstImg.fetchPriority = 'high';
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Projects: Initializing...');
    
    const projectsTrack = document.querySelector('.projects-track');
    const projectCards = document.querySelectorAll('.project-card');
    const toggleButtons = document.querySelectorAll('.project-toggle-btn');
    const featuredCards = document.querySelectorAll('.featured-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentPosition = 0;
    let currentProjectId = 1;
    
    const isMobile = () => window.innerWidth <= 767;
    
    function getCardWidthMobile() {
        if (!isMobile()) return 306;
        return window.innerWidth <= 360 ? 280 : 306;
    }
    
    function getMaxPosition() {
        if (isMobile()) {
            const cardWidth = getCardWidthMobile();
            return (projectCards.length - 1) * cardWidth;
        }
        
        const container = document.querySelector('.projects-container');
        const visibleCards = Math.floor((container.clientWidth + 24) / (306 + 24));
        const totalCards = 6;
        
        return visibleCards >= totalCards ? 0 : (totalCards - visibleCards) * (306 + 24);
    }
    
    function updateCarousel() {
        const maxPosition = getMaxPosition();
        
        currentPosition = Math.max(0, Math.min(currentPosition, maxPosition));
        projectsTrack.style.transform = `translateX(-${currentPosition}px)`;
        updateButtons(maxPosition);
    }
    
    function updateButtons(maxPosition) {
        if (prevBtn) {
            prevBtn.disabled = currentPosition <= 0;
            prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPosition >= maxPosition;
            nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (prevBtn.disabled) return;
            
            if (isMobile()) {
                currentPosition = Math.max(0, currentPosition - getCardWidthMobile());
            } else {
                const container = document.querySelector('.projects-container');
                const visibleCards = Math.floor((container.clientWidth + 24) / (306 + 24));
                const step = (306 + 24) * Math.min(2, visibleCards);
                currentPosition = Math.max(0, currentPosition - step);
            }
            
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (nextBtn.disabled) return;
            
            const maxPosition = getMaxPosition();
            
            if (isMobile()) {
                currentPosition = Math.min(maxPosition, currentPosition + getCardWidthMobile());
            } else {
                const container = document.querySelector('.projects-container');
                const visibleCards = Math.floor((container.clientWidth + 24) / (306 + 24));
                const step = (306 + 24) * Math.min(2, visibleCards);
                currentPosition = Math.min(maxPosition, currentPosition + step);
            }
            
            updateCarousel();
        });
    }
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.project-card');
            const description = card.querySelector('.project-card-description');
            const arrowLeft = card.querySelector('.arrow-left');
            const arrowDown = card.querySelector('.arrow-down');
            
            document.querySelectorAll('.project-card-description').forEach(desc => {
                if (desc !== description && desc.classList.contains('show')) {
                    desc.classList.remove('show');
                    const parentCard = desc.closest('.project-card');
                    if (parentCard) {
                        parentCard.querySelector('.arrow-left')?.classList.remove('hidden');
                        parentCard.querySelector('.arrow-down')?.classList.add('hidden');
                    }
                }
            });
            
            if (description.classList.contains('show')) {
                description.classList.remove('show');
                if (arrowLeft) arrowLeft.classList.remove('hidden');
                if (arrowDown) arrowDown.classList.add('hidden');
            } else {
                description.classList.add('show');
                if (arrowLeft) arrowLeft.classList.add('hidden');
                if (arrowDown) arrowDown.classList.remove('hidden');
                
                const projectId = card.dataset.projectId;
                if (projectId) {
                    selectProject(projectId);
                }
            }
        });
    });
    
    function selectProject(projectId) {
        currentProjectId = parseInt(projectId);
        
        featuredCards.forEach(card => {
            card.classList.remove('active');
        });
        
        const targetCard = document.querySelector(`.featured-card[data-project-id="${projectId}"]`);
        if (targetCard) {
            targetCard.classList.add('active');
        }
    }
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.project-toggle-btn')) {
                const projectId = this.dataset.projectId;
                if (projectId) {
                    selectProject(projectId);
                }
            }
        });
    });
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const maxPosition = getMaxPosition();
            if (currentPosition > maxPosition) {
                currentPosition = maxPosition;
            }
            updateCarousel();
        }, 250);
    });
    
    updateCarousel();
    selectProject(currentProjectId);
    
    console.log('Projects: Initialization complete');
});