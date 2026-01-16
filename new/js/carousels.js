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
            swipeThreshold: 50, // Минимальное расстояние свайпа
            swipeVelocity: 0.3, // Чувствительность скорости свайпа
            bounceEffect: true,
            bounceDuration: 300
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
                        touch-action: pan-y;
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
    
    // ===== ДЕСКТОПНАЯ КАРУСЕЛЬ (старая логика) =====
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

    // 3 копии для бесконечного эффекта
    const allImages = [...images, ...images, ...images];

    allImages.forEach((src, i) => {
        const realIndex = i % images.length;
        track.appendChild(createImageElement(src, carouselId, realIndex + 1));
    });

    initSmoothInfiniteSwipe(track, images.length);
}
   

function initSmoothInfiniteSwipe(track, originalCount) {
    const imageWidth = settings.mobile.imageWidth;
    const gap = settings.mobile.gap;
    const cardWidth = imageWidth + gap;

    let index = originalCount; // Начинаем с середины (вторая копия)
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let animationStartTime = 0;
    let lastAutoScrollTime = 0;

    let autoScrollId = null;
    let isAutoScrolling = false;
    let touchStartTime = 0;
    
    // Для отслеживания реального индекса (для отладки)
    let realIndex = 0;

    function setPosition(i, animate = true) {
        track.style.transition = animate ? 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
        track.style.transform = `translateX(${-i * cardWidth}px)`;
        
        // Вычисляем реальный индекс для отладки
        realIndex = ((i % originalCount) + originalCount) % originalCount;
    }

    function silentJump(i) {
        requestAnimationFrame(() => {
            track.style.transition = 'none';
            track.style.transform = `translateX(${-i * cardWidth}px)`;
            
            // Микро-задержка для сброса transition
            requestAnimationFrame(() => {
                track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }

    // === АВТОСКРОЛЛ ===
    function startAutoScroll() {
        if (autoScrollId) return;
        
        isAutoScrolling = true;
        lastAutoScrollTime = Date.now();
        
        autoScrollId = setInterval(() => {
            // Не автоскроллим если:
            // 1. Драггинг активен
            // 2. Прошло меньше 2.5 секунд с последнего свайпа
            // 3. Карусель в процессе анимации
            if (dragging || 
                (Date.now() - touchStartTime < 2500) || 
                (Date.now() - animationStartTime < 350)) {
                return;
            }
            
            index++;
            animationStartTime = Date.now();
            setPosition(index, true);
            
        }, 2600); // Интервал между авто-прокрутками
    }

    function stopAutoScroll() {
        if (autoScrollId) {
            clearInterval(autoScrollId);
            autoScrollId = null;
        }
        isAutoScrolling = false;
    }

    // === ОБРАБОТЧИК ЗАВЕРШЕНИЯ АНИМАЦИИ ===
    track.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;
        
        // Проверяем границы и делаем "тихий" переход
        if (index >= originalCount * 2 - 1) {
            // Достигли конца третьей копии - прыгаем на начало второй
            index = originalCount;
            silentJump(index);
        } else if (index < originalCount) {
            // Достигли начала первой копии - прыгаем на конец второй
            index = originalCount * 2 - 2;
            silentJump(index);
        }
    });

    // === СВАЙП НА iPhone (исправленная версия) ===
    function onTouchStart(e) {
        if (!isMobile()) return;
        
        dragging = true;
        touchStartTime = Date.now();
        
        // Останавливаем автоскролл
        stopAutoScroll();
        
        // Получаем начальную позицию
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        currentX = startX;
        
        // Отключаем transition для плавного драга
        track.style.transition = 'none';
        
        // Для iPhone важно НЕ использовать preventDefault здесь
        // Используем passive: true для touchstart
    }

    function onTouchMove(e) {
        if (!dragging || !isMobile()) return;
        
        // Для iPhone ВАЖНО: не используем preventDefault на touchmove
        // если только действительно не нужно блокировать скролл страницы
        // В нашем случае используем passive: false но без preventDefault
        
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const delta = x - currentX;
        currentX = x;
        
        // Вычисляем новую позицию
        const offset = -index * cardWidth + delta;
        track.style.transform = `translateX(${offset}px)`;
        
        // Для плавности на iPhone
        e.stopPropagation();
    }

    function onTouchEnd(e) {
        if (!dragging || !isMobile()) return;
        dragging = false;
        
        const delta = currentX - startX;
        const absDelta = Math.abs(delta);
        
        // Определяем, был ли это свайп или просто тап
        if (absDelta > settings.mobile.swipeThreshold) {
            // Это был свайп - меняем индекс
            index += delta < 0 ? 1 : -1;
            setPosition(index, true);
        } else {
            // Просто отпустили - возвращаем на текущую позицию
            setPosition(index, true);
        }
        
        // Перезапускаем автоскролл через 2 секунды
        setTimeout(() => {
            startAutoScroll();
        }, 2000);
    }

    // === ПОДПИСКА НА СОБЫТИЯ (исправлено для iPhone) ===
    
    // Для touch событий на iPhone
    track.addEventListener('touchstart', onTouchStart, { passive: true }); // 🔥 passive: true
    track.addEventListener('touchmove', onTouchMove, { passive: false });  // 🔥 passive: false, но без preventDefault
    track.addEventListener('touchend', onTouchEnd);
    track.addEventListener('touchcancel', onTouchEnd);
    
    // Для мыши (тестирование на десктопе)
    track.addEventListener('mousedown', (e) => {
        if (isMobile()) return; // На мобилках используем только touch
        onTouchStart(e);
    });
    
    track.addEventListener('mousemove', (e) => {
        if (isMobile()) return;
        onTouchMove(e);
    });
    
    track.addEventListener('mouseup', (e) => {
        if (isMobile()) return;
        onTouchEnd(e);
    });
    
    track.addEventListener('mouseleave', (e) => {
        if (isMobile()) return;
        onTouchEnd(e);
    });
    
    // Предотвращаем контекстное меню на долгом тапе
    track.addEventListener('contextmenu', (e) => {
        if (isMobile()) {
            e.preventDefault();
            return false;
        }
    });
    
    // CSS стили для улучшения производительности на iOS
    track.style.cssText += `
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    `;
    
    // Для каждого изображения добавляем стили для iOS
    track.querySelectorAll('.carousel-image').forEach(img => {
        img.style.cssText += `
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
        `;
    });

    // === ИНИЦИАЛИЗАЦИЯ ===
    setPosition(index, false);
    
    // Запускаем автоскролл с задержкой
    setTimeout(() => {
        startAutoScroll();
    }, 1000);
    
    // Сохраняем функцию очистки для ресайза
    track._cleanup = function() {
        stopAutoScroll();
        track.style.transition = '';
        track.style.transform = '';
    };
}
    function initSwipeCarousel(track, totalImages) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let currentIndex = 0;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        
        const container = track.parentElement;
        const imageWidth = settings.mobile.imageWidth;
        const gap = settings.mobile.gap;
        const cardWidth = imageWidth + gap;
        
        // Рассчитываем максимальный индекс
        const maxIndex = totalImages - 1;
        
        // Функция обновления позиции
        function updatePosition(animate = true) {
            const offset = -currentIndex * cardWidth;
            
            if (animate) {
                track.style.transition = 'transform 0.3s ease';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(${offset}px)`;
        }
        
        // Функция для ограничения индекса
        function clampIndex(index) {
            return Math.max(0, Math.min(index, maxIndex));
        }
        
        // Обработчики для свайпа
        function handleTouchStart(e) {
            if (!isMobile()) return;
            
            isDragging = true;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            currentX = startX;
            lastX = startX;
            lastTime = Date.now();
            
            track.style.transition = 'none';
            track.style.cursor = 'grabbing';
            
            e.preventDefault();
        }
        
        function handleTouchMove(e) {
            if (!isDragging || !isMobile()) return;
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const deltaX = clientX - currentX;
            currentX = clientX;
            
            // Рассчитываем velocity
            const currentTime = Date.now();
            const timeDiff = currentTime - lastTime;
            
            if (timeDiff > 0) {
                velocity = (clientX - lastX) / timeDiff;
                lastX = clientX;
                lastTime = currentTime;
            }
            
            // Рассчитываем новую позицию с резиновым эффектом
            let newPosition = -currentIndex * cardWidth + deltaX;
            
            // Резиновый эффект на границах
            if (currentIndex === 0 && newPosition > 0) {
                newPosition = Math.log(deltaX + 1) * 10; // Мягкое сопротивление
            } else if (currentIndex === maxIndex && newPosition < -maxIndex * cardWidth) {
                newPosition = -maxIndex * cardWidth - Math.log(-deltaX + 1) * 10;
            }
            
            track.style.transform = `translateX(${newPosition}px)`;
            
            e.preventDefault();
        }
        
        function handleTouchEnd(e) {
            if (!isDragging || !isMobile()) return;
            
            isDragging = false;
            track.style.cursor = 'grab';
            
            const deltaX = currentX - startX;
            const absDeltaX = Math.abs(deltaX);
            
            // Определяем направление и силу свайпа
            let newIndex = currentIndex;
            
            if (absDeltaX > settings.mobile.swipeThreshold || Math.abs(velocity) > settings.mobile.swipeVelocity) {
                if (deltaX > 0 && currentIndex > 0) {
                    // Свайп вправо
                    newIndex = currentIndex - 1;
                } else if (deltaX < 0 && currentIndex < maxIndex) {
                    // Свайп влево
                    newIndex = currentIndex + 1;
                }
            }
            
            // Применяем новый индекс
            newIndex = clampIndex(newIndex);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updatePosition(true);
            } else {
                // Возвращаем на место с анимацией
                updatePosition(true);
            }
            
            // Сбрасываем
            velocity = 0;
        }
        
        // Добавляем обработчики событий
        track.addEventListener('touchstart', handleTouchStart, { passive: false });
        track.addEventListener('touchmove', handleTouchMove, { passive: false });
        track.addEventListener('touchend', handleTouchEnd);
        track.addEventListener('touchcancel', handleTouchEnd);
        
        // Также добавляем поддержку мыши для тестирования
        track.addEventListener('mousedown', handleTouchStart);
        track.addEventListener('mousemove', handleTouchMove);
        track.addEventListener('mouseup', handleTouchEnd);
        track.addEventListener('mouseleave', handleTouchEnd);
        
        // Предотвращаем выделение текста при перетаскивании
        track.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Устанавливаем начальную позицию
        updatePosition(false);
        
        // Добавляем индикаторы точек (опционально)
        addDotsIndicator(track.parentElement, totalImages, currentIndex, (index) => {
            currentIndex = clampIndex(index);
            updatePosition(true);
        });
    }
    
    // ДОБАВЛЯЕМ ИНДИКАТОР ТОЧЕК (опционально)
    function addDotsIndicator(container, totalDots, currentIndex, onDotClick) {
        if (totalDots <= 1) return;
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        dotsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 15px;
            padding: 10px 0;
        `;
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
            dot.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: none;
                padding: 0;
                background: ${i === currentIndex ? '#2B2B2B' : '#D9D9D9'};
                cursor: pointer;
                transition: background 0.3s ease;
            `;
            
            dot.addEventListener('click', () => {
                onDotClick(i);
                updateDots();
            });
            
            dot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onDotClick(i);
                updateDots();
            });
            
            dotsContainer.appendChild(dot);
        }
        
        function updateDots() {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.style.background = index === currentIndex ? '#2B2B2B' : '#D9D9D9';
            });
        }
        
        container.appendChild(dotsContainer);
    }
    
    // СОЗДАНИЕ ЭЛЕМЕНТА КАРТИНКИ (общая функция)
    function createImageElement(src, carouselId, index) {
    const div = document.createElement('div');
    div.className = 'carousel-image';

    const img = document.createElement('img');
    img.src = src;
    img.loading = 'eager'; // 🔥 не lazy
    img.decoding = 'async';
    img.style.opacity = '0';

    img.onload = () => {
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '1';
    };

    img.onerror = () => {
        img.style.opacity = '1';
        img.style.background = '#444';
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
            // Останавливаем десктопные анимации
            document.querySelectorAll('.carousel-track').forEach(track => {
                if (track._stopAnimation) {
                    track._stopAnimation();
                }
            });
            
            // Удаляем старые точки
            document.querySelectorAll('.carousel-dots').forEach(dots => dots.remove());
            
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
                pointer-events: none; /* Предотвращаем клики на картинке */
            }
            
            /* Для мобилок */
            @media (max-width: 767px) {
                .carousel-container {
                    overflow: hidden;
                    user-select: none;
                    -webkit-user-select: none;
                }
                
                .carousel-track {
                    display: flex;
                    gap: 24px;
                    height: 306px;
                    transition: transform 0.3s ease;
                    will-change: transform;
                }
                
                .carousel-image {
                    width: 306px;
                    min-width: 306px;
                    height: 306px;
                    flex-shrink: 0;
                    cursor: grab;
                }
                
                .carousel-image:active {
                    cursor: grabbing;
                }
                
                /* Убираем все hover эффекты */
                .carousel-image:hover,
                .carousel-image:hover img {
                    transform: none !important;
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