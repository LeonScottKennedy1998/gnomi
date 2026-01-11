// ===== ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ - ЗАПУСКАЕТСЯ СРАЗУ ПРИ ЗАГРУЗКЕ СКРИПТА =====
// Данные для каруселей (вынесены наружу для ранней предзагрузки)
const carouselImages = {
    1: [ // Ландшафтные проекты
        'assets/images/carousels/landscape-projects/1.png',
        'assets/images/carousels/landscape-projects/2.png',
        'assets/images/carousels/landscape-projects/3.png',
        'assets/images/carousels/landscape-projects/4.png',
        'assets/images/carousels/landscape-projects/5.png',
        'assets/images/carousels/landscape-projects/6.png',
        'assets/images/carousels/landscape-projects/7.png',
        'assets/images/carousels/landscape-projects/8.png'
    ],
    2: [ // Реализация ландшафтных проектов
        'assets/images/carousels/landscape-implementation/1.jpg',
        'assets/images/carousels/landscape-implementation/2.jpg',
        'assets/images/carousels/landscape-implementation/3.jpg',
        'assets/images/carousels/landscape-implementation/4.jpg',
        'assets/images/carousels/landscape-implementation/5.jpg',
        'assets/images/carousels/landscape-implementation/6.jpg'
    ],
    3: [ // Интерьерные проекты
        'assets/images/carousels/interior-projects/1.png',
        'assets/images/carousels/interior-projects/2.png',
        'assets/images/carousels/interior-projects/3.png',
        'assets/images/carousels/interior-projects/4.png',
        'assets/images/carousels/interior-projects/5.png',
        'assets/images/carousels/interior-projects/6.png',
        'assets/images/carousels/interior-projects/7.jpg',
        'assets/images/carousels/interior-projects/8.jpg'
    ],
    4: [ // Реализация интерьерных проектов
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

// Кэш предзагруженных изображений
const preloadedImagesCache = {};

// АГРЕССИВНАЯ ПРЕДЗАГРУЗКА - запускается СРАЗУ при загрузке скрипта
(function aggressivePreload() {
    console.log('🚀 Начинаем агрессивную предзагрузку всех изображений каруселей...');
    
    let loadedCount = 0;
    let totalCount = 0;
    
    // Подсчитываем общее количество
    Object.values(carouselImages).forEach(images => {
        totalCount += images.length;
    });
    
    // Загружаем ВСЕ изображения СРАЗУ через Image объекты
    // Это самый надежный и быстрый способ предзагрузки
    Object.keys(carouselImages).forEach(carouselId => {
        const images = carouselImages[carouselId];
        
        if (!preloadedImagesCache[carouselId]) {
            preloadedImagesCache[carouselId] = [];
        }
        
        images.forEach((src, index) => {
            const img = new Image();
            
            // Устанавливаем src - браузер начнет загрузку немедленно
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Карусели: скрипт запущен');
    
    // Настройки каруселей
    const settings = {
        speed: 60, // Пикселей в секунду
        gap: 24,
        imageWidth: 306,
        autoPlay: true,
        infinite: true
    };
    
    function applyHoverFix() {
        const images = document.querySelectorAll('.carousel-image');
        
        images.forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.borderRadius = '10px';
                this.style.overflow = 'hidden';
                
                const innerImg = this.querySelector('img');
                if (innerImg) {
                    innerImg.style.borderRadius = '10px';
                }
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.borderRadius = '';
                this.style.overflow = '';
                
                const innerImg = this.querySelector('img');
                if (innerImg) {
                    innerImg.style.borderRadius = '';
                }
            });
        });
    }
    
    // Инициализация всех каруселей
    function initCarousels() {
        const carousels = document.querySelectorAll('.carousel-track');
        
        carousels.forEach((track, index) => {
            const carouselId = track.dataset.carousel || (index + 1);
            initCarousel(track, carouselId);
        });
        
        setTimeout(() => {
            applyHoverFix();
        }, 100);
    }
    
    // Инициализация одной карусели
    function initCarousel(track, carouselId) {
        const images = carouselImages[carouselId] || getDefaultImages(carouselId);
        
        // Очищаем трек
        track.innerHTML = '';
        
        // Дублируем картинки МИНИМУМ 3 раза для абсолютно бесшовной прокрутки
        const totalCopies = 3;
        
        // Добавляем картинки (дублируем несколько раз)
        for (let copy = 0; copy < totalCopies; copy++) {
            images.forEach((src, imgIndex) => {
                const imgElement = createImageElement(src, carouselId, imgIndex + 1);
                track.appendChild(imgElement);
            });
        }
        
        // Ждем пока DOM обновится и все изображения загрузятся
        // Затем измеряем РЕАЛЬНУЮ ширину одного набора
        const checkAndStart = () => {
            const firstImage = track.querySelector('.carousel-image');
            const lastImageInSet = track.children[images.length - 1];
            
            if (!firstImage || !lastImageInSet) {
                requestAnimationFrame(checkAndStart);
                return;
            }
            
            // Проверяем что все изображения в первом наборе загружены
            const firstSetImages = Array.from(track.children).slice(0, images.length);
            const allLoaded = firstSetImages.every(el => {
                const img = el.querySelector('img');
                return img && img.complete && img.naturalHeight > 0;
            });
            
            if (!allLoaded) {
                // Ждем еще немного
                setTimeout(checkAndStart, 50);
                return;
            }
            
            // Измеряем реальную ширину одного набора картинок
            // Используем getBoundingClientRect для точного измерения с учетом всех CSS стилей
            const firstRect = firstImage.getBoundingClientRect();
            const lastRect = lastImageInSet.getBoundingClientRect();
            
            // Ширина = расстояние от левого края первой до правого края последней картинки
            let singleSetWidth = lastRect.right - firstRect.left;
            
            // Если измерение не удалось, используем расчетный метод
            if (singleSetWidth <= 0 || singleSetWidth < settings.imageWidth) {
                // Получаем реальный gap из computed styles
                const computedStyle = window.getComputedStyle(track);
                const realGap = parseFloat(computedStyle.gap) || settings.gap;
                
                // Рассчитываем ширину
                singleSetWidth = 0;
                for (let i = 0; i < images.length; i++) {
                    const imgEl = track.children[i];
                    singleSetWidth += imgEl.offsetWidth || settings.imageWidth;
                    if (i < images.length - 1) {
                        singleSetWidth += realGap;
                    }
                }
            }
            
            // Убираем все transition для мгновенного сброса позиции
            track.style.transition = 'none';
            track.style.willChange = 'transform';
            
            // Запускаем анимацию с РЕАЛЬНОЙ шириной
            if (settings.autoPlay) {
                startPerfectInfiniteScroll(track, images.length, singleSetWidth);
            }
            
            console.log(`Карусель ${carouselId} инициализирована: ${images.length} картинок, ширина набора: ${singleSetWidth}px`);
        };
        
        // Запускаем проверку после обновления DOM
        requestAnimationFrame(() => {
            requestAnimationFrame(checkAndStart);
        });
    }
    
    // Создаём элемент картинки
    function createImageElement(src, carouselId, index) {
        const div = document.createElement('div');
        div.className = 'carousel-image';
        
        const img = document.createElement('img');
        
        // Используем предзагруженное изображение если есть
        if (preloadedImagesCache[carouselId] && preloadedImagesCache[carouselId][index - 1]) {
            const cached = preloadedImagesCache[carouselId][index - 1];
            if (cached.element && cached.loaded) {
                // Используем уже загруженное изображение
                img.src = cached.element.src;
            } else {
                // Используем src из кэша
                img.src = cached.src || src;
            }
        } else {
            // Если еще не загружено, используем обычный способ
            img.src = src;
        }
        
        img.alt = `Проект ${index}`;
        img.loading = 'eager'; // Всегда eager, так как предзагружаем
        
        // Если картинка не загрузится
        img.onerror = function() {
            this.src = `https://via.placeholder.com/306x306/404040/FFFFFF?text=Проект+${index}`;
        };
        
        div.appendChild(img);
        return div;
    }
    
    // ИДЕАЛЬНАЯ БЕСКОНЕЧНАЯ ПРОКРУТКА БЕЗ ВИДИМЫХ СКЛЕЕК
    function startPerfectInfiniteScroll(track, imagesCount, singleSetWidth) {
        let position = 0;
        let animationId = null;
        let isScrolling = true;
        const direction = -1;
        const speed = settings.speed / 60; // пикселей за кадр (при 60fps)
        
        // КРИТИЧЕСКИ ВАЖНО: убираем ВСЕ transition навсегда и настраиваем оптимизацию
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
            
            // Двигаем позицию
            position += direction * speed;
            
            // КРИТИЧЕСКИ ВАЖНО: сбрасываем позицию когда она достигает границы
            // Для движения влево (direction = -1) position будет отрицательным
            if (position <= -singleSetWidth) {
                // Сбрасываем позицию - добавляем singleSetWidth
                // Например: position = -2640, singleSetWidth = 2640
                // Результат: position = 0 (невидимо для пользователя, так как картинки дублированы)
                position = position + singleSetWidth;
            }
            
            // Применяем transform (всегда, один раз)
            // Используем requestAnimationFrame для гарантии плавности
            track.style.transform = `translateX(${position}px)`;
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Запускаем анимацию
        animate();
        
        // Останавливаем при наведении
        track.addEventListener('mouseenter', () => {
            isScrolling = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
        
        // Возобновляем при уходе курсора
        track.addEventListener('mouseleave', () => {
            isScrolling = true;
            // Убеждаемся что transition все еще отключен
            track.style.transition = 'none';
            if (!animationId) {
                animate();
            }
        });
        
        // Сохраняем функцию остановки
        track._stopAnimation = () => {
            isScrolling = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };
    }
    
    // Получаем картинки по умолчанию
    function getDefaultImages(carouselId) {
        const categories = ['landscape', 'implementation', 'interior', 'interior-impl'];
        const category = categories[carouselId - 1] || 'landscape';
        
        return Array.from({length: 6}, (_, i) => 
            `https://via.placeholder.com/306x306/404040/FFFFFF?text=${category}+${i+1}`
        );
    }
    
    // Останавливаем все анимации
    function stopAllAnimations() {
        document.querySelectorAll('.carousel-track').forEach(track => {
            if (track._stopAnimation) {
                track._stopAnimation();
            }
        });
    }
    
    // Переинициализация при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            stopAllAnimations();
            initCarousels();
        }, 250);
    });
    
    // Добавляем CSS для оптимизации производительности
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
            }
        `;
        document.head.appendChild(style);
    }
    
    // Инициализация
    addOptimizationStyles();
    initCarousels();
    
    console.log('Карусели: инициализация завершена');
});
