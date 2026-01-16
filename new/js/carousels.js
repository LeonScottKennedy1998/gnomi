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
            swipeThreshold: 50,
            swipeVelocity: 0.3,
            bounceEffect: true,
            bounceDuration: 300,
            autoScrollSpeed: 2600, // Медленная авто-прокрутка (больше = медленнее)
            autoScrollDelay: 2000 // Пауза после свайпа
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
                        cursor: grab;
                        user-select: none;
                        -webkit-user-select: none;
                    }
                    
                    .carousel-image:active {
                        cursor: grabbing;
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
    
    // ===== ДЕСКТОПНАЯ КАРУСЕЛЬ =====
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
        
        track._stopAnimation = () => {
            isScrolling = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };
    }
    
    // ===== МОБИЛЬНАЯ КАРУСЕЛЬ С СВАЙПОМ =====
    function initMobileCarousel(track, carouselId) {
        const images = carouselImages[carouselId] || getDefaultImages(carouselId);
        track.innerHTML = '';
        
        // Добавляем 3 копии для бесконечного эффекта
        const copies = 3;
        for (let copy = 0; copy < copies; copy++) {
            images.forEach((src, imgIndex) => {
                const imgElement = createImageElement(src, carouselId, imgIndex + 1);
                track.appendChild(imgElement);
            });
        }
        
        initMobileSwipeCarousel(track, images.length);
    }
    
    function initMobileSwipeCarousel(track, originalCount) {
        const container = track.parentElement;
        const imageWidth = settings.mobile.imageWidth;
        const gap = settings.mobile.gap;
        const cardWidth = imageWidth + gap;
        
        let currentIndex = originalCount; // Начинаем с середины (2-я копия)
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let autoScrollTimer = null;
        let isAutoScrolling = false;
        let isAnimating = false;
        let lastTouchTime = 0;
        let lockAxis = null;
        let startY = 0;
        
        // Проверяем валидность картинок
        const totalItems = track.children.length;
        if (totalItems === 0 || originalCount === 0) return;
        
        // Устанавливаем начальную позицию
        function setPosition(index, animate = true) {
            if (isAnimating) return;
            
            const position = -index * cardWidth;
            
            if (animate) {
                isAnimating = true;
                track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(${position}px)`;
            
            if (animate) {
                // Сбрасываем флаг анимации после завершения
                setTimeout(() => {
                    isAnimating = false;
                }, 350);
            }
        }
        
        // Проверяем границы и делаем "тихий" переход
        function checkBoundaries() {
            if (isAnimating) return;
            
            // Если в третьей копии (индекс >= originalCount * 2)
            if (currentIndex >= originalCount * 2) {
                // Прыгаем на соответствующую позицию во второй копии
                currentIndex = currentIndex - originalCount;
                setPosition(currentIndex, false);
            }
            // Если в первой копии (индекс < originalCount)
            else if (currentIndex < originalCount) {
                // Прыгаем на соответствующую позицию во второй копии
                currentIndex = currentIndex + originalCount;
                setPosition(currentIndex, false);
            }
        }
        
        // Автоскролл
        function startAutoScroll() {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
            
            isAutoScrolling = true;
            autoScrollTimer = setInterval(() => {
                // Не автоскроллим если:
                // 1. Драгаем пальцем
                // 2. В процессе анимации
                // 3. Недавно был свайп
                if (isDragging || isAnimating || (Date.now() - lastTouchTime < settings.mobile.autoScrollDelay)) {
                    return;
                }
                
                currentIndex++;
                setPosition(currentIndex, true);
                
                // Проверяем границы после анимации
                setTimeout(checkBoundaries, 350);
                
            }, settings.mobile.autoScrollSpeed);
        }
        
        function stopAutoScroll() {
            if (autoScrollTimer) {
                clearInterval(autoScrollTimer);
                autoScrollTimer = null;
            }
            isAutoScrolling = false;
        }
        
        // Обработчики свайпа (исправлено для iOS)
        function handleTouchStart(e) {
            if (!isMobile()) return;
            
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            currentX = startX;
            isDragging = true;
            lockAxis = null;
            lastTouchTime = Date.now();
            
            // Останавливаем автоскролл
            stopAutoScroll();
            
            // Отключаем анимацию для плавного драга
            track.style.transition = 'none';
            
            // Предотвращаем стандартное поведение чтобы не скроллилась страница
            if (e.cancelable) {
                e.preventDefault();
            }
        }
        
        function handleTouchMove(e) {
            if (!isDragging || !isMobile()) return;
            
            const touch = e.touches ? e.touches[0] : e;
            const moveX = touch.clientX;
            const moveY = touch.clientY;
            
            // Определяем направление жеста
            if (!lockAxis) {
                const deltaX = Math.abs(moveX - startX);
                const deltaY = Math.abs(moveY - startY);
                
                // Если жест больше горизонтальный, чем вертикальный
                if (deltaX > deltaY && deltaX > 5) {
                    lockAxis = 'horizontal';
                    // Блокируем вертикальный скролл страницы
                    e.preventDefault();
                } else if (deltaY > deltaX && deltaY > 5) {
                    lockAxis = 'vertical';
                    // Разрешаем вертикальный скролл
                    return;
                }
            }
            
            // Если жест горизонтальный - обрабатываем свайп
            if (lockAxis === 'horizontal') {
                e.preventDefault();
                
                const deltaX = moveX - currentX;
                currentX = moveX;
                
                // Вычисляем новую позицию
                const currentPosition = -currentIndex * cardWidth;
                const newPosition = currentPosition + deltaX;
                
                track.style.transform = `translateX(${newPosition}px)`;
            }
        }
        
        function handleTouchEnd(e) {
            if (!isDragging || !isMobile()) return;
            
            isDragging = false;
            const endX = currentX;
            const deltaX = endX - startX;
            const absDeltaX = Math.abs(deltaX);
            
            // Определяем был ли это свайп
            if (lockAxis === 'horizontal' && absDeltaX > settings.mobile.swipeThreshold) {
                // Меняем индекс в зависимости от направления
                const direction = deltaX > 0 ? -1 : 1;
                currentIndex += direction;
                
                // Устанавливаем новую позицию с анимацией
                setPosition(currentIndex, true);
                
                // Проверяем границы после анимации
                setTimeout(checkBoundaries, 350);
            } else {
                // Возвращаем на текущую позицию
                setPosition(currentIndex, true);
            }
            
            // Сбрасываем lockAxis
            lockAxis = null;
            
            // Возобновляем автоскролл с задержкой
            setTimeout(() => {
                if (!isDragging) {
                    startAutoScroll();
                }
            }, settings.mobile.autoScrollDelay);
        }
        
        // Подписка на события
        // Для iOS: используем passive: false на touchmove чтобы можно было предотвратить скролл страницы
        track.addEventListener('touchstart', handleTouchStart, { passive: false });
        track.addEventListener('touchmove', handleTouchMove, { passive: false });
        track.addEventListener('touchend', handleTouchEnd);
        track.addEventListener('touchcancel', handleTouchEnd);
        
        // Для тестирования на десктопе
        track.addEventListener('mousedown', (e) => {
            if (isMobile()) return;
            handleTouchStart(e);
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !isMobile()) return;
            handleTouchMove(e);
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging || !isMobile()) return;
            handleTouchEnd(e);
        });
        
        // Для iOS добавляем специальные стили
        container.style.cssText += `
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y pinch-zoom;
        `;
        
        track.style.cssText += `
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-tap-highlight-color: transparent;
        `;
        
        // Устанавливаем начальную позицию
        setPosition(currentIndex, false);
        
        // Запускаем автоскролл
        setTimeout(() => {
            startAutoScroll();
        }, 1000);
        
        // Сохраняем функцию очистки
        track._cleanup = function() {
            stopAutoScroll();
        };
    }
    
    // СОЗДАНИЕ ЭЛЕМЕНТА КАРТИНКИ
    function createImageElement(src, carouselId, index) {
        const div = document.createElement('div');
        div.className = 'carousel-image';
        
        // Стили для предотвращения выделения на iOS
        div.style.cssText = `
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
        `;
        
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
                if (track._cleanup) {
                    track._cleanup();
                }
            });
            
            // Переинициализируем
            initCarousels();
        }, 250);
    });
    
    // ДОБАВЛЯЕМ ОПТИМИЗАЦИИ ДЛЯ iOS
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
            
            /* Для iOS и мобилок */
            @media (max-width: 767px) {
                .carousel-container {
                    overflow: hidden;
                    -webkit-overflow-scrolling: touch;
                    touch-action: pan-y pinch-zoom;
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
                }
                
                /* Убираем все hover эффекты на мобилках */
                .carousel-image:hover,
                .carousel-image:hover img {
                    transform: none !important;
                }
                
                /* Отключаем выделение текста на iOS */
                * {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                /* Разрешаем выделение только для инпутов и текстовых областей */
                input, textarea {
                    -webkit-user-select: text;
                    -moz-user-select: text;
                    -ms-user-select: text;
                    user-select: text;
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