// ДОБАВЬ ЭТОТ КОД В НАЧАЛО ТВОЕГО JS ФАЙЛА (ПЕРЕД DOMContentLoaded)
(function optimizeImageLoading() {
    'use strict';
    
    console.log('🖼️ Оптимизация загрузки изображений проектов');
    
    // Список изображений для предзагрузки (только самые важные)
    const criticalImages = [
        // Первые 2 проекта (самое важное)
        'assets/images/projects/small/project1.jpg',
        'assets/images/projects/small/project2.jpg',
        'assets/images/projects/large/project1-1.png',
        'assets/images/projects/large/project1-2.png',
        
        // Остальные по приоритету
        'assets/images/projects/small/project3.jpg',
        'assets/images/projects/small/project4.png',
        'assets/images/projects/small/project5.png',
        'assets/images/projects/small/project6.png'
    ];
    
    // Предзагрузка критических изображений
    function preloadCriticalImages() {
        let loaded = 0;
        const total = criticalImages.length;
        
        console.log(`🔍 Предзагружаем ${total} критических изображений...`);
        
        criticalImages.forEach((src, index) => {
            const img = new Image();
            
            // Low priority для не критичных
            if (index > 3) {
                img.fetchPriority = 'low';
            }
            
            img.src = src;
            
            img.onload = () => {
                loaded++;
                if (loaded === total) {
                    console.log(`✅ Все ${total} критических изображений загружены`);
                }
            };
            
            img.onerror = () => {
                loaded++;
                console.warn(`⚠️ Не удалось загрузить: ${src}`);
            };
        });
    }
    
    // Lazy loading для остальных изображений
    function setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Браузер поддерживает native lazy loading
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.loading = 'lazy';
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
            console.log('📱 Используем native lazy loading');
        } else {
            // Fallback для старых браузеров
            console.log('📱 Используем Intersection Observer для lazy loading');
            setupIntersectionObserver();
        }
    }
    
    // Intersection Observer для старых браузеров
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
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
        }, {
            rootMargin: '50px 0px', // Начинаем загружать когда до картинки 50px
            threshold: 0.01
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }
    
    // Оптимизация загрузки по видимости
    function optimizeByVisibility() {
        // Предзагружаем только то что видно или скоро будет видно
        const viewportHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        // Предзагружаем проекты которые в ближайшей видимости
        document.querySelectorAll('.project-card').forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisibleSoon = rect.top < viewportHeight + 500; // 500px до видимости
            
            if (isVisibleSoon && index < 4) { // Только первые 4
                const img = card.querySelector('.project-card-image img');
                if (img && img.dataset.src && !img.src) {
                    img.src = img.dataset.src;
                }
            }
        });
    }
    
    // Запускаем когда DOM готов
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Предзагружаем критические изображения сразу
        preloadCriticalImages();
        
        // 2. Настраиваем lazy loading
        setupLazyLoading();
        
        // 3. Оптимизация при скролле
        window.addEventListener('scroll', function() {
            setTimeout(optimizeByVisibility, 100);
        });
        
        // 4. Первоначальная проверка видимости
        setTimeout(optimizeByVisibility, 500);
    });
    
    // Также запускаем предзагрузку сразу (не ждём DOMContentLoaded для критичных)
    if (document.readyState === 'loading') {
        // DOM ещё не загружен, предзагружаем самые важные
        const firstImg = new Image();
        firstImg.src = 'assets/images/projects/small/project1.jpg';
        firstImg.fetchPriority = 'high';
    }
})();
document.addEventListener('DOMContentLoaded', function() {
    console.log('Проекты: скрипт запущен - фиксированный размер');
    
    // Элементы DOM
    const projectsTrack = document.querySelector('.projects-track');
    const projectCards = document.querySelectorAll('.project-card');
    const toggleButtons = document.querySelectorAll('.project-toggle-btn');
    const featuredCards = document.querySelectorAll('.featured-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Настройки
    let currentPosition = 0;
    let currentProjectId = 1;
    
    // Проверка на мобильное устройство
    function isMobile() {
        return window.innerWidth <= 767;
    }
    
    // ФИКСИРОВАННАЯ ШИРИНА КАРТОЧКИ НА МОБИЛКЕ
    function getCardWidthMobile() {
        if (!isMobile()) return 306;
        
        // На мобилках всегда 306px (или 280px для узких экранов)
        if (window.innerWidth <= 360) {
            return 280; // Для очень узких экранов
        }
        return 306; // Для остальных мобилок
    }
    
    // Рассчитываем максимальную позицию
    function getMaxPosition() {
        if (isMobile()) {
            // На мобилке: (кол-во карточек - 1) * ширину карточки
            const cardWidth = getCardWidthMobile();
            return (projectCards.length - 1) * cardWidth;
        }
        
        // Десктопная логика
        const visibleCards = Math.floor((document.querySelector('.projects-container').clientWidth + 24) / (306 + 24));
        const totalCards = 6;
        if (visibleCards >= totalCards) return 0;
        
        return (totalCards - visibleCards) * (306 + 24);
    }
    
    // Обновляем карусель
    function updateCarousel() {
        const maxPosition = getMaxPosition();
        
        // Ограничиваем позицию
        if (currentPosition < 0) currentPosition = 0;
        if (currentPosition > maxPosition) currentPosition = maxPosition;
        
        // Применяем трансформацию
        projectsTrack.style.transform = `translateX(-${currentPosition}px)`;
        
        // Обновляем кнопки
        updateButtons(maxPosition);
        
        console.log('Позиция:', currentPosition, 'Макс:', maxPosition, 'Ширина карточки:', getCardWidthMobile());
    }
    
    // Обновляем состояние кнопок
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
    
    // ===== ЛИСТАНИЕ КАРТОЧЕК =====
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (!this.disabled) {
                if (isMobile()) {
                    // На мобилке - листаем ровно на одну карточку
                    const cardWidth = getCardWidthMobile();
                    currentPosition = Math.max(0, currentPosition - cardWidth);
                } else {
                    // На десктопе
                    const visibleCards = Math.floor((document.querySelector('.projects-container').clientWidth + 24) / (306 + 24));
                    const step = (306 + 24) * Math.min(2, visibleCards);
                    currentPosition = Math.max(0, currentPosition - step);
                }
                updateCarousel();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (!this.disabled) {
                if (isMobile()) {
                    // На мобилке - листаем ровно на одну карточку
                    const cardWidth = getCardWidthMobile();
                    const maxPosition = getMaxPosition();
                    currentPosition = Math.min(maxPosition, currentPosition + cardWidth);
                } else {
                    // На десктопе
                    const visibleCards = Math.floor((document.querySelector('.projects-container').clientWidth + 24) / (306 + 24));
                    const maxPosition = getMaxPosition();
                    const step = (306 + 24) * Math.min(2, visibleCards);
                    currentPosition = Math.min(maxPosition, currentPosition + step);
                }
                updateCarousel();
            }
        });
    }
    
    // ===== ОТКРЫТИЕ ОПИСАНИЯ =====
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.project-card');
            const description = card.querySelector('.project-card-description');
            const arrowLeft = card.querySelector('.arrow-left');
            const arrowDown = card.querySelector('.arrow-down');
            
            // Закрываем другие описания
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
            
            // Переключаем текущее описание
            if (description.classList.contains('show')) {
                // Закрываем
                description.classList.remove('show');
                if (arrowLeft) arrowLeft.classList.remove('hidden');
                if (arrowDown) arrowDown.classList.add('hidden');
            } else {
                // Открываем
                description.classList.add('show');
                if (arrowLeft) arrowLeft.classList.add('hidden');
                if (arrowDown) arrowDown.classList.remove('hidden');
                
                // Выбираем проект для больших карточек
                const projectId = card.dataset.projectId;
                if (projectId) {
                    selectProject(projectId);
                }
            }
        });
    });
    
    // ===== ВЫБОР ПРОЕКТА ДЛЯ БОЛЬШИХ КАРТОЧЕК =====
    function selectProject(projectId) {
        console.log('Выбран проект:', projectId);
        currentProjectId = parseInt(projectId);
        
        // Прячем все большие карточки
        featuredCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Показываем нужную
        const targetCard = document.querySelector(`.featured-card[data-project-id="${projectId}"]`);
        if (targetCard) {
            targetCard.classList.add('active');
        }
    }
    
    // Клик по самой карточке
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
    
    // ===== ОБРАБОТКА РЕСАЙЗА =====
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // При ресайзе сбрасываем позицию если нужно
            const maxPosition = getMaxPosition();
            if (currentPosition > maxPosition) {
                currentPosition = maxPosition;
            }
            updateCarousel();
        }, 250);
    });
    
    // Инициализация
    updateCarousel();
    selectProject(currentProjectId);
    
    // Автооткрытие первого проекта
    setTimeout(() => {
        const firstCard = document.querySelector('.project-card[data-project-id="1"]');
        if (firstCard && !firstCard.querySelector('.project-card-description').classList.contains('show')) {
            firstCard.querySelector('.project-toggle-btn')?.click();
        }
    }, 500);
    
    console.log('Проекты: инициализация завершена');
});