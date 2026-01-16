// ПРЕДЗАГРУЗКА (оставляем без изменений)
const carouselImages = {
    1: [
        'assets/images/carousels/landscape-projects/1.png',
        'assets/images/carousels/landscape-projects/2.png',
        'assets/images/carousels/landscape-projects/3.png',
        'assets/images/carousels/landscape-projects/4.png',
        'assets/images/carousels/landscape-projects/5.png',
        'assets/images/carousels/landscape-projects/6.png',
        'assets/images/carousels/landscape-projects/7.png',
        'assets/images/carousels/landscape-projects/8.png',
        'assets/images/carousels/landscape-projects/9.png',
        'assets/images/carousels/landscape-projects/10.png',
        'assets/images/carousels/landscape-projects/11.png',
        'assets/images/carousels/landscape-projects/12.png'
    ],
    2: [
        'assets/images/carousels/landscape-implementation/1.jpg',
        'assets/images/carousels/landscape-implementation/2.jpg',
        'assets/images/carousels/landscape-implementation/3.jpg',
        'assets/images/carousels/landscape-implementation/4.jpg',
        'assets/images/carousels/landscape-implementation/5.jpg',
        'assets/images/carousels/landscape-implementation/6.jpg'
    ],
    3: [
        'assets/images/carousels/interior-projects/1.png',
        'assets/images/carousels/interior-projects/2.png',
        'assets/images/carousels/interior-projects/3.png',
        'assets/images/carousels/interior-projects/4.png',
        'assets/images/carousels/interior-projects/5.png',
        'assets/images/carousels/interior-projects/6.png',
        'assets/images/carousels/interior-projects/7.jpg',
        'assets/images/carousels/interior-projects/8.jpg'
    ],
    4: [
        'assets/images/carousels/interior-implementation/1.jpg',
        'assets/images/carousels/interior-implementation/2.jpg',
        'assets/images/carousels/interior-implementation/3.jpg',
        'assets/images/carousels/interior-implementation/4.jpg',
        'assets/images/carousels/interior-implementation/5.jpg',
        'assets/images/carousels/interior-implementation/6.jpg',
        'assets/images/carousels/interior-implementation/7.jpg',
        'assets/images/carousels/interior-implementation/8.jpg'
    ]
};

const preloadedImagesCache = {};

(function aggressivePreload() {
    console.log('🚀 Начинаем агрессивную предзагрузку всех изображений каруселей...');
    
    let loadedCount = 0;
    let totalCount = 0;
    
    Object.values(carouselImages).forEach(images => {
        totalCount += images.length;
    });
    
    Object.keys(carouselImages).forEach(carouselId => {
        const images = carouselImages[carouselId];
        
        if (!preloadedImagesCache[carouselId]) {
            preloadedImagesCache[carouselId] = [];
        }
        
        images.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            
            img.onload = () => {
                preloadedImagesCache[carouselId][index] = {
                    src: src,
                    element: img,
                    loaded: true
                };
                loadedCount++;
                if (loadedCount === totalCount) {
                    console.log(`✅ Все ${totalCount} изображений каруселей предзагружены!`);
                }
            };
            
            img.onerror = () => {
                console.warn(`⚠️ Не удалось загрузить: ${src}`);
                preloadedImagesCache[carouselId][index] = {
                    src: src,
                    loaded: false
                };
                loadedCount++;
            };
        });
    });
})();

// ОСНОВНОЙ КОД С МОБИЛЬНЫМ СВАЙПОМ
// ОСНОВНОЙ КОД С БЕСКОНЕЧНОЙ КАРУСЕЛЬЮ
document.addEventListener('DOMContentLoaded', function() {
    console.log('Карусели: скрипт запущен');
    
    // Проверка на мобильное устройство
    function isMobile() {
        return window.innerWidth <= 767;
    }
    
    // НАСТРОЙКИ
    const settings = {
        desktop: {
            speed: 60,
            gap: 24,
            imageWidth: 306,
            autoPlay: true,
            infinite: true
        },
        mobile: {
            gap: 24,
            imageWidth: 306,
            speed: 80, // Медленнее чем на десктопе
            autoPlay: true
        }
    };
    
    // УБИРАЕМ HOVER ЭФФЕКТЫ НА МОБИЛКАХ
    function disableHoverOnMobile() {
        if (isMobile()) {
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 767px) {
                    .carousel-image:hover,
                    .carousel-image:hover img {
                        transform: none !important;
                    }
                    
                    .carousel-image {
                        cursor: default;
                        user-select: none;
                        -webkit-user-select: none;
                        pointer-events: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ИНИЦИАЛИЗАЦИЯ ВСЕХ КАРУСЕЛЕЙ
    function initCarousels() {
        const carousels = document.querySelectorAll('.carousel-track');
        
        carousels.forEach((track, index) => {
            const carouselId = track.dataset.carousel || (index + 1);
            
            if (isMobile()) {
                initMobileCarousel(track, carouselId);
            } else {
                initDesktopCarousel(track, carouselId);
            }
        });
        
        disableHoverOnMobile();
    }
    
    // ===== ДЕСКТОПНАЯ КАРУСЕЛЬ (бесконечная) =====
    function initDesktopCarousel(track, carouselId) {
        const images = carouselImages[carouselId] || getDefaultImages(carouselId);
        
        track.innerHTML = '';
        const totalCopies = 3;
        
        for (let copy = 0; copy < totalCopies; copy++) {
            images.forEach((src, imgIndex) => {
                const imgElement = createImageElement(src, carouselId, imgIndex + 1);
                track.appendChild(imgElement);
            });
        }
        
        const checkAndStart = () => {
            const firstImage = track.querySelector('.carousel-image');
            const lastImageInSet = track.children[images.length - 1];
            
            if (!firstImage || !lastImageInSet) {
                requestAnimationFrame(checkAndStart);
                return;
            }
            
            const firstSetImages = Array.from(track.children).slice(0, images.length);
            const allLoaded = firstSetImages.every(el => {
                const img = el.querySelector('img');
                return img && img.complete && img.naturalHeight > 0;
            });
            
            if (!allLoaded) {
                setTimeout(checkAndStart, 50);
                return;
            }
            
            const firstRect = firstImage.getBoundingClientRect();
            const lastRect = lastImageInSet.getBoundingClientRect();
            let singleSetWidth = lastRect.right - firstRect.left;
            
            if (singleSetWidth <= 0 || singleSetWidth < settings.desktop.imageWidth) {
                const computedStyle = window.getComputedStyle(track);
                const realGap = parseFloat(computedStyle.gap) || settings.desktop.gap;
                
                singleSetWidth = 0;
                for (let i = 0; i < images.length; i++) {
                    const imgEl = track.children[i];
                    singleSetWidth += imgEl.offsetWidth || settings.desktop.imageWidth;
                    if (i < images.length - 1) {
                        singleSetWidth += realGap;
                    }
                }
            }
            
            track.style.transition = 'none';
            track.style.willChange = 'transform';
            
            if (settings.desktop.autoPlay) {
                startDesktopInfiniteScroll(track, images.length, singleSetWidth);
            }
            
            console.log(`Десктоп карусель ${carouselId}: ${images.length} картинок, ширина: ${singleSetWidth}px`);
        };
        
        requestAnimationFrame(() => {
            requestAnimationFrame(checkAndStart);
        });
    }
    
    function startDesktopInfiniteScroll(track, imagesCount, singleSetWidth) {
        let position = 0;
        let animationId = null;
        let isScrolling = true;
        const direction = -1;
        const speed = settings.desktop.speed / 60;
        
        track.style.transition = 'none';
        track.style.willChange = 'transform';
        track.style.transform = 'translateX(0px)';
        track.style.backfaceVisibility = 'hidden';
        track.style.perspective = '1000px';
        
        function animate() {
            if (!isScrolling) {
                animationId = null;
                return;
            }
            
            position += direction * speed;
            
            if (position <= -singleSetWidth) {
                position = position + singleSetWidth;
            }
            
            track.style.transform = `translateX(${position}px)`;
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        // На мобилках убираем остановку при наведении
        if (!isMobile()) {
            track.addEventListener('mouseenter', () => {
                isScrolling = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
            
            track.addEventListener('mouseleave', () => {
                isScrolling = true;
                track.style.transition = 'none';
                if (!animationId) {
                    animate();
                }
            });
        }
        
        track._stopAnimation = () => {
            isScrolling = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };
    }
    
    // ===== МОБИЛЬНАЯ КАРУСЕЛЬ (тоже бесконечная, но проще) =====
    function initMobileCarousel(track, carouselId) {
        const images = carouselImages[carouselId] || getDefaultImages(carouselId);
        
        track.innerHTML = '';
        const totalCopies = 3; // Три копии для бесконечного эффекта
        
        for (let copy = 0; copy < totalCopies; copy++) {
            images.forEach((src, imgIndex) => {
                const imgElement = createImageElement(src, carouselId, imgIndex + 1);
                track.appendChild(imgElement);
            });
        }
        
        startMobileInfiniteScroll(track, images.length);
    }
    
    function startMobileInfiniteScroll(track, imagesCount) {
        // Рассчитываем ширину одного набора картинок
        const checkAndStart = () => {
            const firstImage = track.querySelector('.carousel-image');
            const lastImageInSet = track.children[imagesCount - 1];
            
            if (!firstImage || !lastImageInSet) {
                requestAnimationFrame(checkAndStart);
                return;
            }
            
            const firstSetImages = Array.from(track.children).slice(0, imagesCount);
            const allLoaded = firstSetImages.every(el => {
                const img = el.querySelector('img');
                return img && img.complete && img.naturalHeight > 0;
            });
            
            if (!allLoaded) {
                setTimeout(checkAndStart, 50);
                return;
            }
            
            const firstRect = firstImage.getBoundingClientRect();
            const lastRect = lastImageInSet.getBoundingClientRect();
            let singleSetWidth = lastRect.right - firstRect.left;
            
            if (singleSetWidth <= 0 || singleSetWidth < settings.mobile.imageWidth) {
                const computedStyle = window.getComputedStyle(track);
                const realGap = parseFloat(computedStyle.gap) || settings.mobile.gap;
                
                singleSetWidth = 0;
                for (let i = 0; i < imagesCount; i++) {
                    const imgEl = track.children[i];
                    singleSetWidth += imgEl.offsetWidth || settings.mobile.imageWidth;
                    if (i < imagesCount - 1) {
                        singleSetWidth += realGap;
                    }
                }
            }
            
            let position = 0;
            let animationId = null;
            const direction = -1;
            const speed = settings.mobile.speed / 60; // Медленнее чем на десктопе
            
            track.style.transition = 'none';
            track.style.willChange = 'transform';
            track.style.transform = 'translateX(0px)';
            
            function animate() {
                position += direction * speed;
                
                // Когда проскроллили один набор картинок - возвращаемся к началу
                if (position <= -singleSetWidth) {
                    position = position + singleSetWidth;
                }
                
                track.style.transform = `translateX(${position}px)`;
                animationId = requestAnimationFrame(animate);
            }
            
            if (settings.mobile.autoPlay) {
                animate();
            }
            
            // Сохраняем функцию остановки
            track._stopAnimation = () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            };
            
            console.log(`Мобильная карусель: ${imagesCount} картинок, ширина набора: ${singleSetWidth}px`);
        };
        
        requestAnimationFrame(() => {
            requestAnimationFrame(checkAndStart);
        });
    }
    
    // СОЗДАНИЕ ЭЛЕМЕНТА КАРТИНКИ
    function createImageElement(src, carouselId, index) {
        const div = document.createElement('div');
        div.className = 'carousel-image';
        
        // На мобилках отключаем все взаимодействия
        if (isMobile()) {
            div.style.cssText = `
                -webkit-tap-highlight-color: transparent;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                pointer-events: none;
            `;
        }
        
        const img = document.createElement('img');
        
        // Используем кэш предзагрузки
        if (preloadedImagesCache[carouselId] && preloadedImagesCache[carouselId][index - 1]) {
            const cached = preloadedImagesCache[carouselId][index - 1];
            if (cached.element && cached.loaded) {
                img.src = cached.element.src;
            } else {
                img.src = cached.src || src;
            }
        } else {
            img.src = src;
        }
        
        img.alt = `Проект ${index}`;
        img.loading = 'eager';
        img.decoding = 'async';
        
        // Для плавной загрузки
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
        };
        
        img.onerror = () => {
            img.src = `https://via.placeholder.com/306x306/404040/FFFFFF?text=Проект+${index}`;
            img.style.opacity = '1';
        };
        
        div.appendChild(img);
        return div;
    }
    
    function getDefaultImages(carouselId) {
        const categories = ['landscape', 'implementation', 'interior', 'interior-impl'];
        const category = categories[carouselId - 1] || 'landscape';
        
        return Array.from({length: 6}, (_, i) => 
            `https://via.placeholder.com/306x306/404040/FFFFFF?text=${category}+${i+1}`
        );
    }
    
    // ПЕРЕИНИЦИАЛИЗАЦИЯ ПРИ ИЗМЕНЕНИИ РАЗМЕРА
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Останавливаем все анимации
            document.querySelectorAll('.carousel-track').forEach(track => {
                if (track._stopAnimation) {
                    track._stopAnimation();
                }
            });
            
            // Переинициализируем
            initCarousels();
        }, 250);
    });
    
    // ДОБАВЛЯЕМ ОПТИМИЗАЦИИ
    function addOptimizationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .carousel-track {
                will-change: transform;
                backface-visibility: hidden;
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
            }
            
            .carousel-image {
                will-change: transform;
                backface-visibility: hidden;
            }
            
            .carousel-image img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
            }
            
            /* Для мобилок - отключаем все взаимодействия */
            @media (max-width: 767px) {
                .carousel-container {
                    overflow: hidden;
                    -webkit-overflow-scrolling: touch;
                }
                
                .carousel-track {
                    display: flex;
                    gap: 24px;
                    height: 306px;
                    will-change: transform;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                .carousel-image {
                    width: 306px;
                    min-width: 306px;
                    height: 306px;
                    flex-shrink: 0;
                    -webkit-tap-highlight-color: transparent;
                    -webkit-touch-callout: none;
                    pointer-events: none !important;
                }
                
                /* Убираем все hover эффекты и взаимодействия */
                .carousel-image:hover,
                .carousel-image:hover img {
                    transform: none !important;
                }
                
                .carousel-image,
                .carousel-track {
                    cursor: default !important;
                }
                
                /* Отключаем выделение текста */
                * {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            }
            
            /* На десктопе оставляем hover эффекты */
            @media (min-width: 768px) {
                .carousel-image:hover {
                    transform: scale(1.08);
                    border-radius: 10px;
                    z-index: 100;
                }
                
                .carousel-image:hover img {
                    transform: scale(1.1);
                    border-radius: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ЗАПУСК
    addOptimizationStyles();
    initCarousels();
    
    console.log('Карусели: инициализация завершена');
});