// ПРЕДЗАГРУЗКА (оставляем без изменений)
const carouselImages = {
    1: [
        'assets/images/carousels/landscape-projects/1.webp',
        'assets/images/carousels/landscape-projects/2.webp',
        'assets/images/carousels/landscape-projects/3.webp',
        'assets/images/carousels/landscape-projects/4.webp',
        'assets/images/carousels/landscape-projects/5.webp',
        'assets/images/carousels/landscape-projects/6.webp',
        'assets/images/carousels/landscape-projects/7.webp',
        'assets/images/carousels/landscape-projects/8.webp',
        'assets/images/carousels/landscape-projects/9.webp',
        'assets/images/carousels/landscape-projects/10.webp',
        'assets/images/carousels/landscape-projects/11.webp',
        'assets/images/carousels/landscape-projects/12.webp'
    ],
    2: [
        'assets/images/carousels/landscape-implementation/1.webp',
        'assets/images/carousels/landscape-implementation/2.webp',
        'assets/images/carousels/landscape-implementation/3.webp',
        'assets/images/carousels/landscape-implementation/4.webp',
        'assets/images/carousels/landscape-implementation/5.webp',
        'assets/images/carousels/landscape-implementation/6.webp'
    ],
    3: [
        'assets/images/carousels/interior-projects/1.webp',
        'assets/images/carousels/interior-projects/2.webp',
        'assets/images/carousels/interior-projects/3.webp',
        'assets/images/carousels/interior-projects/4.webp',
        'assets/images/carousels/interior-projects/5.webp',
        'assets/images/carousels/interior-projects/6.webp',
        'assets/images/carousels/interior-projects/7.webp',
        'assets/images/carousels/interior-projects/8.webp'
    ],
    4: [
        'assets/images/carousels/interior-implementation/1.webp',
        'assets/images/carousels/interior-implementation/2.webp',
        'assets/images/carousels/interior-implementation/3.webp',
        'assets/images/carousels/interior-implementation/4.webp',
        'assets/images/carousels/interior-implementation/5.webp',
        'assets/images/carousels/interior-implementation/6.webp',
        'assets/images/carousels/interior-implementation/7.webp',
        'assets/images/carousels/interior-implementation/8.webp'
    ]
};

const preloadedImagesCache = {};

(function optimizedPreload() {
    console.log('🖼️ Оптимизированная предзагрузка каруселей...');
    
    // ПРЕДЗАГРУЖАЕМ ТОЛЬКО ПЕРВЫЕ 2-3 КАРТИНКИ КАЖДОЙ КАРУСЕЛИ
    Object.keys(carouselImages).forEach(carouselId => {
        const images = carouselImages[carouselId];
        
        if (!preloadedImagesCache[carouselId]) {
            preloadedImagesCache[carouselId] = [];
        }
        
        // Предзагружаем только первые 3 картинки каждой карусели
        const imagesToPreload = Math.min(3, images.length);
        
        for (let i = 0; i < imagesToPreload; i++) {
            const src = images[i];
            const img = new Image();
            
            // Устанавливаем низкий приоритет для всех кроме первых
            img.fetchPriority = i === 0 ? 'high' : 'low';
            img.decoding = 'async';
            img.loading = i === 0 ? 'eager' : 'lazy';
            
            // Добавляем таймаут для предотвращения зависания
            const timeoutId = setTimeout(() => {
                console.warn(`⏰ Таймаут загрузки: ${src}`);
                img.src = ''; // Останавливаем загрузку
            }, 5000);
            
            img.src = src;
            
            img.onload = () => {
                clearTimeout(timeoutId);
                preloadedImagesCache[carouselId][i] = {
                    src: src,
                    element: img,
                    loaded: true
                };
                console.log(`✅ Загружено: ${src}`);
            };
            
            img.onerror = () => {
                clearTimeout(timeoutId);
                console.warn(`⚠️ Ошибка загрузки: ${src}`);
                preloadedImagesCache[carouselId][i] = {
                    src: src,
                    loaded: false
                };
            };
        }
    });
})();

// ОСНОВНОЙ КОД С БЕСКОНЕЧНОЙ КАРУСЕЛЬЮ
document.addEventListener('DOMContentLoaded', function() {
    console.log('Карусели: скрипт запущен');
    
    // Храним состояние каруселей
    const carouselsState = new Map();
    
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
            speed: 80,
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
    
    // Проверяем, была ли уже инициализирована карусель
    function isCarouselInitialized(track) {
        return carouselsState.has(track) && carouselsState.get(track).initialized;
    }
    
    // ИНИЦИАЛИЗАЦИЯ ВСЕХ КАРУСЕЛЕЙ
    function initCarousels() {
        const carousels = document.querySelectorAll('.carousel-track');
        
        carousels.forEach((track, index) => {
            const carouselId = track.dataset.carousel || (index + 1);
            
            // Проверяем, не была ли уже инициализирована эта карусель
            if (isCarouselInitialized(track)) {
                console.log(`Карусель ${carouselId} уже инициализирована, пропускаем`);
                return;
            }
            
            if (isMobile()) {
                initMobileCarousel(track, carouselId);
            } else {
                initDesktopCarousel(track, carouselId);
            }
            
            // Помечаем карусель как инициализированную
            carouselsState.set(track, { initialized: true, carouselId: carouselId });
        });
        
        disableHoverOnMobile();
    }
    
    // ===== ДЕСКТОПНАЯ КАРУСЕЛЬ (бесконечная) =====
    function initDesktopCarousel(track, carouselId) {
        const images = carouselImages[carouselId] || getDefaultImages(carouselId);
        
        // Очищаем только если еще не было картинок
        if (track.children.length === 0) {
            track.innerHTML = '';
            const totalCopies = 3;
            
            for (let copy = 0; copy < totalCopies; copy++) {
                images.forEach((src, imgIndex) => {
                    const imgElement = createImageElement(src, carouselId, imgIndex + 1);
                    track.appendChild(imgElement);
                });
            }
        }
        
        const checkAndStart = () => {
            const firstImage = track.querySelector('.carousel-image');
            const lastImageInSet = track.children[images.length - 1];
            
            if (!firstImage || !lastImageInSet) {
                requestAnimationFrame(checkAndStart);
                return;
            }
            
            // Проверяем загрузку только первый раз
            if (!carouselsState.get(track)?.imagesLoaded) {
                const firstSetImages = Array.from(track.children).slice(0, images.length);
                const allLoaded = firstSetImages.every(el => {
                    const img = el.querySelector('img');
                    return img && img.complete && img.naturalHeight > 0;
                });
                
                if (!allLoaded) {
                    setTimeout(checkAndStart, 50);
                    return;
                }
                
                // Помечаем что картинки загружены
                const state = carouselsState.get(track);
                carouselsState.set(track, { ...state, imagesLoaded: true });
            }
            
            // Если уже есть анимация, не создаем новую
            if (carouselsState.get(track)?.animationRunning) {
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
            
            if (settings.desktop.autoPlay && !carouselsState.get(track)?.animationRunning) {
                startDesktopInfiniteScroll(track, images.length, singleSetWidth);
            }
            
            console.log(`Десктоп карусель ${carouselId}: ${images.length} картинок, ширина: ${singleSetWidth}px`);
        };
        
        requestAnimationFrame(() => {
            requestAnimationFrame(checkAndStart);
        });
    }
    
    function startDesktopInfiniteScroll(track, imagesCount, singleSetWidth) {
        // Если анимация уже запущена, не создаем новую
        if (carouselsState.get(track)?.animationRunning) {
            return;
        }
        
        let position = 0;
        let animationId = null;
        let isScrolling = true;
        const direction = -1;
        const speed = settings.desktop.speed / 60;
        
        track.style.transition = 'none';
        track.style.willChange = 'transform';
        
        // Если уже есть позиция из состояния, восстанавливаем ее
        const savedState = carouselsState.get(track);
        if (savedState?.position !== undefined) {
            position = savedState.position;
        }
        
        track.style.transform = `translateX(${position}px)`;
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
        
        // Сохраняем состояние анимации
        const state = carouselsState.get(track);
        carouselsState.set(track, { 
            ...state, 
            animationRunning: true,
            position: position,
            animationId: animationId,
            stopAnimation: () => {
                isScrolling = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                carouselsState.set(track, { 
                    ...carouselsState.get(track), 
                    animationRunning: false,
                    position: position 
                });
            }
        });
        
        // На мобилках убираем остановку при наведении
        if (!isMobile()) {
            track.addEventListener('mouseenter', () => {
                isScrolling = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                carouselsState.set(track, { 
                    ...carouselsState.get(track), 
                    animationRunning: false,
                    position: position 
                });
            });
            
            track.addEventListener('mouseleave', () => {
                isScrolling = true;
                track.style.transition = 'none';
                if (!animationId) {
                    animate();
                    carouselsState.set(track, { 
                        ...carouselsState.get(track), 
                        animationRunning: true 
                    });
                }
            });
        }
        
        track._stopAnimation = () => {
            isScrolling = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            carouselsState.set(track, { 
                ...carouselsState.get(track), 
                animationRunning: false,
                position: position 
            });
        };
    }
    
    // ===== МОБИЛЬНАЯ КАРУСЕЛЬ (тоже бесконечная, но проще) =====
    function initMobileCarousel(track, carouselId) {
        const images = carouselImages[carouselId] || getDefaultImages(carouselId);
        
        // Очищаем только если еще не было картинок
        if (track.children.length === 0) {
            track.innerHTML = '';
            const totalCopies = 3; // Три копии для бесконечного эффекта
            
            for (let copy = 0; copy < totalCopies; copy++) {
                images.forEach((src, imgIndex) => {
                    const imgElement = createImageElement(src, carouselId, imgIndex + 1);
                    track.appendChild(imgElement);
                });
            }
        }
        
        startMobileInfiniteScroll(track, images.length);
    }
    
    function startMobileInfiniteScroll(track, imagesCount) {
        // Если анимация уже запущена, не создаем новую
        if (carouselsState.get(track)?.mobileAnimationRunning) {
            return;
        }
        
        // Рассчитываем ширину одного набора картинок
        const checkAndStart = () => {
            const firstImage = track.querySelector('.carousel-image');
            const lastImageInSet = track.children[imagesCount - 1];
            
            if (!firstImage || !lastImageInSet) {
                requestAnimationFrame(checkAndStart);
                return;
            }
            
            // Проверяем загрузку только первый раз
            if (!carouselsState.get(track)?.mobileImagesLoaded) {
                const firstSetImages = Array.from(track.children).slice(0, imagesCount);
                const allLoaded = firstSetImages.every(el => {
                    const img = el.querySelector('img');
                    return img && img.complete && img.naturalHeight > 0;
                });
                
                if (!allLoaded) {
                    setTimeout(checkAndStart, 50);
                    return;
                }
                
                // Помечаем что картинки загружены
                const state = carouselsState.get(track);
                carouselsState.set(track, { ...state, mobileImagesLoaded: true });
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
            const speed = settings.mobile.speed / 60;
            
            // Восстанавливаем позицию из состояния если есть
            const savedState = carouselsState.get(track);
            if (savedState?.mobilePosition !== undefined) {
                position = savedState.mobilePosition;
            }
            
            track.style.transition = 'none';
            track.style.willChange = 'transform';
            track.style.transform = `translateX(${position}px)`;
            
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
                
                // Сохраняем состояние анимации
                const state = carouselsState.get(track);
                carouselsState.set(track, { 
                    ...state, 
                    mobileAnimationRunning: true,
                    mobilePosition: position,
                    mobileAnimationId: animationId
                });
            }
            
            // Сохраняем функцию остановки
            track._stopAnimation = () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                carouselsState.set(track, { 
                    ...carouselsState.get(track), 
                    mobileAnimationRunning: false,
                    mobilePosition: position 
                });
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
        
        // Используем кэш предзагрузки, но сохраняем ссылку на оригинальный Image объект
        if (preloadedImagesCache[carouselId] && preloadedImagesCache[carouselId][index - 1]) {
            const cached = preloadedImagesCache[carouselId][index - 1];
            if (cached.element && cached.loaded) {
                // Используем оригинальный Image объект из кэша
                img.src = cached.element.src;
                // Если изображение уже загружено, сразу показываем его
                if (cached.element.complete) {
                    img.style.opacity = '1';
                }
            } else {
                img.src = cached.src || src;
            }
        } else {
            img.src = src;
        }
        
        img.alt = `Проект ${index}`;
        img.loading = 'eager';
        img.decoding = 'async';
        
        // Для плавной загрузки - только если изображение еще не загружено
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
        } else {
            img.style.opacity = '1';
        }
        
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
    
    // ПЕРЕИНИЦИАЛИЗАЦИЯ ПРИ ИЗМЕНЕНИИ РАЗМЕРА (только если действительно изменился режим)
    let lastIsMobile = isMobile();
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const currentIsMobile = isMobile();
            
            // Переинициализируем только если изменился режим (мобильный/десктопный)
            if (currentIsMobile !== lastIsMobile) {
                console.log('Режим изменился, переинициализируем карусели');
                
                // Останавливаем все анимации
                document.querySelectorAll('.carousel-track').forEach(track => {
                    if (track._stopAnimation) {
                        track._stopAnimation();
                    }
                });
                
                // Очищаем состояние
                carouselsState.clear();
                
                // Переинициализируем
                initCarousels();
                
                lastIsMobile = currentIsMobile;
            }
        }, 250);
    });
    
    // ДОБАВЛЯЕМ ОПТИМИЗАЦИИ
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
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            transform-origin: center center !important;
        }
        
        .carousel-image img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            transition: transform 0.4s ease !important;
            transform-origin: center center !important;
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
                cursor: default !important;
            }
            
            /* Убираем все hover эффекты и взаимодействия на мобилках */
            .carousel-image:hover,
            .carousel-image:hover img {
                transform: none !important;
            }
            
            .carousel-image,
            .carousel-track {
                cursor: default !important;
            }
            
            /* Отключаем выделение текста на мобилках */
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
                transform: scale(1.08) !important;
                border-radius: 10px;
                z-index: 100;
            }
            
            .carousel-image:hover img {
                transform: scale(1.1) !important;
                border-radius: 10px;
            }
            
            /* Оставляем курсор pointer на десктопе */
            .carousel-image {
                cursor: pointer !important;
            }
        }
        
        /* Разрешаем выделение только для инпутов и текстовых областей */
        input, textarea {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
        }
    `;
    document.head.appendChild(style);
}
    
    // ЗАПУСК ТОЛЬКО ОДИН РАЗ
    addOptimizationStyles();
    initCarousels();
    
    console.log('Карусели: инициализация завершена');
});