const fallbackCarouselImages = {
    1: Array.from({length: 12}, (_, i) => `assets/images/carousels/landscape-projects/${i+1}.webp`),
    2: Array.from({length: 6}, (_, i) => `assets/images/carousels/landscape-implementation/${i+1}.webp`),
    3: Array.from({length: 8}, (_, i) => `assets/images/carousels/interior-projects/${i+1}.webp`),
    4: Array.from({length: 8}, (_, i) => `assets/images/carousels/interior-implementation/${i+1}.webp`)
};

const imageCache = {};

function resolveCarouselImages(id) {
    const content = window.__CONTENT__;
    const targetId = String(id);

    if (content && Array.isArray(content.carousels)) {
        const carousel = content.carousels.find(item => String(item.id) === targetId);
        if (carousel && Array.isArray(carousel.images)) {
            return carousel.images
                .slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((image, index) => ({
                    src: image.src,
                    alt: image.alt || `Изображение ${index + 1}`
                }));
        }
    }

    const fallback = fallbackCarouselImages[id] || [];
    return fallback.map((src, index) => ({ src, alt: `Изображение ${index + 1}` }));
}

function preloadImages(id, images) {
    imageCache[id] = [];
    const toPreload = Math.min(3, images.length);

    for (let i = 0; i < toPreload; i++) {
        const img = new Image();
        img.src = images[i].src;
        imageCache[id][i] = { element: img, loaded: true };
    }
}

function initCarousels() {
    const isMobile = () => window.innerWidth <= 767;
    const state = new Map();
    
    const settings = {
        desktop: { speed: 60, gap: 24, imageWidth: 306 },
        mobile: { speed: 80, gap: 24, imageWidth: 306 }
    };
    
    if (isMobile()) {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 767px) {
                .carousel-image {
                    pointer-events: none !important;
                    cursor: default !important;
                    -webkit-tap-highlight-color: transparent;
                    user-select: none;
                    -webkit-user-select: none;
                }
                
                .carousel-image:hover,
                .carousel-image:hover img {
                    transform: none !important;
                }
                
                .carousel-track {
                    pointer-events: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.querySelectorAll('.carousel-track').forEach((track, index) => {
        const id = track.dataset.carousel || (index + 1);

        const images = resolveCarouselImages(id);
        if (images.length) {
            preloadImages(id, images);
        }
        
        if (state.has(track)) return;
        
        if (isMobile()) {
            initMobileCarousel(track, id);
        } else {
            initDesktopCarousel(track, id);
        }
        
        state.set(track, { initialized: true, id });
    });
    
    function initDesktopCarousel(track, id) {
        const images = resolveCarouselImages(id);
        
        if (track.children.length === 0) {
            track.innerHTML = '';
            
            for (let copy = 0; copy < 3; copy++) {
                images.forEach((image, index) => {
                    track.appendChild(createImageElement(image, id, index + 1, false));
                });
            }
        }
        
        setTimeout(() => {
            const setWidth = calculateSetWidth(track, images.length);
            
            if (!state.get(track)?.animationRunning) {
                startDesktopAnimation(track, images.length, setWidth);
            }
        }, 100);
    }
    
    function startDesktopAnimation(track, imagesCount, setWidth) {
        let position = state.get(track)?.position || 0;
        let animationId = null;
        let isScrolling = true;
        const speed = settings.desktop.speed / 60;
        
        track.style.transition = 'none';
        track.style.transform = `translateX(${position}px)`;
        
        function animate() {
            if (!isScrolling) {
                animationId = null;
                return;
            }
            
            position -= speed;
            
            if (position <= -setWidth) {
                position += setWidth;
            }
            
            track.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        track.addEventListener('mouseenter', () => {
            isScrolling = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            state.set(track, { ...state.get(track), animationRunning: false, position });
        });
        
        track.addEventListener('mouseleave', () => {
            isScrolling = true;
            if (!animationId) {
                animate();
                state.set(track, { ...state.get(track), animationRunning: true });
            }
        });
        
        state.set(track, {
            ...state.get(track),
            animationRunning: true,
            position,
            animationId
        });
        
        track._stopAnimation = () => {
            isScrolling = false;
            if (animationId) cancelAnimationFrame(animationId);
        };
    }
    
    function initMobileCarousel(track, id) {
        const images = resolveCarouselImages(id);
        
        if (track.children.length === 0) {
            track.innerHTML = '';
            
            for (let copy = 0; copy < 3; copy++) {
                images.forEach((image, index) => {
                    track.appendChild(createImageElement(image, id, index + 1, true));
                });
            }
        }
        
        startMobileAnimation(track, images.length);
    }
    
    function startMobileAnimation(track, imagesCount) {
        setTimeout(() => {
            const setWidth = calculateSetWidth(track, imagesCount);
            let position = state.get(track)?.mobilePosition || 0;
            let animationId = null;
            const speed = settings.mobile.speed / 60;
            
            track.style.transition = 'none';
            track.style.transform = `translateX(${position}px)`;
            
            function animate() {
                position -= speed;
                
                if (position <= -setWidth) {
                    position += setWidth;
                }
                
                track.style.transform = `translateX(${position}px)`;
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            state.set(track, {
                ...state.get(track),
                mobileAnimationRunning: true,
                mobilePosition: position,
                mobileAnimationId: animationId
            });
            
            track._stopAnimation = () => {
                if (animationId) cancelAnimationFrame(animationId);
            };
        }, 100);
    }
    
    function createImageElement(image, id, index, isForMobile) {
        const div = document.createElement('div');
        div.className = 'carousel-image';
        
        if (isForMobile) {
            div.style.cssText = `
                pointer-events: none !important;
                -webkit-tap-highlight-color: transparent;
                user-select: none;
                -webkit-user-select: none;
                touch-action: none;
                cursor: default !important;
            `;
        }
        
        const img = document.createElement('img');
        
        if (imageCache[id] && imageCache[id][index - 1]) {
            const cached = imageCache[id][index - 1];
            img.src = cached.element?.src || image.src;
        } else {
            img.src = image.src;
        }
        
        img.alt = image.alt || `Изображение ${index}`;
        img.loading = 'eager';
        img.decoding = 'async';
        
        if (isForMobile) {
            img.style.cssText = `
                pointer-events: none !important;
                user-select: none;
                -webkit-user-select: none;
                touch-action: none;
            `;
        }
        
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            img.onload = () => img.style.opacity = '1';
        } else {
            img.style.opacity = '1';
        }
        
        div.appendChild(img);
        return div;
    }
    
    function calculateSetWidth(track, imagesCount) {
        const firstImage = track.children[0];
        const lastImage = track.children[imagesCount - 1];
        
        if (!firstImage || !lastImage) return 0;
        
        const firstRect = firstImage.getBoundingClientRect();
        const lastRect = lastImage.getBoundingClientRect();
        let width = lastRect.right - firstRect.left;
        
        if (width <= 0) {
            const gap = parseFloat(getComputedStyle(track).gap) || 24;
            width = 0;
            for (let i = 0; i < imagesCount; i++) {
                width += track.children[i].offsetWidth || 306;
                if (i < imagesCount - 1) width += gap;
            }
        }
        
        return width;
    }
    
    let resizeTimeout;
    let lastMobileState = isMobile();
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const currentMobile = isMobile();
            
            if (currentMobile !== lastMobileState) {
                document.querySelectorAll('.carousel-track').forEach(track => {
                    if (track._stopAnimation) track._stopAnimation();
                });
                
                state.clear();
                
                document.querySelectorAll('.carousel-track').forEach((track, index) => {
                    const id = track.dataset.carousel || (index + 1);
                    
                    if (currentMobile) {
                        initMobileCarousel(track, id);
                    } else {
                        initDesktopCarousel(track, id);
                    }
                    
                    state.set(track, { initialized: true, id });
                });
                
                lastMobileState = currentMobile;
            }
        }, 250);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .carousel-track {
            will-change: transform;
            backface-visibility: hidden;
        }
        
        .carousel-image {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center center;
        }
        
        .carousel-image img {
            transition: transform 0.4s ease;
            transform-origin: center center;
        }
        
        @media (min-width: 768px) {
            .carousel-image:hover {
                transform: scale(1.08);
                z-index: 100;
            }
            
            .carousel-image:hover img {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);
}

let carouselsInitialized = false;

function startCarousels() {
    if (carouselsInitialized) return;
    carouselsInitialized = true;
    initCarousels();
}

document.addEventListener('content:loaded', () => {
    carouselsInitialized = false;
    startCarousels();
});

document.addEventListener('DOMContentLoaded', () => {
    startCarousels();
});
