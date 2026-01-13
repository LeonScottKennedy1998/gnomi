document.addEventListener('DOMContentLoaded', function() {
    console.log('Проекты: скрипт запущен');
    
    // Элементы DOM
    const projectsTrack = document.querySelector('.projects-track');
    const projectCards = document.querySelectorAll('.project-card');
    const toggleButtons = document.querySelectorAll('.project-toggle-btn');
    const featuredCards = document.querySelectorAll('.featured-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Проверяем что всё найдено
    console.log('Найдено карточек:', projectCards.length);
    console.log('Найдено кнопок:', toggleButtons.length);
    console.log('Найдено больших карточек:', featuredCards.length);
    
    // Настройки
    let currentPosition = 0;
    let currentProjectId = 1;
    
    // Проверка на мобильное устройство
    function isMobile() {
        return window.innerWidth <= 767;
    }
    
    // Рассчитываем сколько карточек видно
    function getVisibleCards() {
        if (isMobile()) {
            return 1; // На мобилках показываем 1 карточку
        }
        
        const container = document.querySelector('.projects-container');
        if (!container) return 4;
        
        const containerWidth = container.clientWidth;
        const cardWidth = isMobile() ? containerWidth : 306;
        const gap = isMobile() ? 20 : 24;
        
        // Сколько карточек помещается
        const cards = Math.floor((containerWidth + gap) / (cardWidth + gap));
        return Math.max(1, cards); // Минимум 1 карточка
    }
    
    // Рассчитываем максимальную позицию
    function getMaxPosition() {
        if (isMobile()) {
        const cardWidth = getCardWidthMobile();
        return (projectCards.length - 1) * cardWidth;
    }
        
        const visibleCards = getVisibleCards();
        const totalCards = 6;
        const cardWidth = 306;
        const gap = 24;
        
        // Если все карточки помещаются, не даём скроллить
        if (visibleCards >= totalCards) return 0;
        
        // Максимальная позиция = (общее кол-во - видимое) * (ширина + отступ)
        return (totalCards - visibleCards) * (cardWidth + gap);
    }

    function getCardWidthMobile() {
    // Получаем актуальную ширину карточки на мобилке
    if (!isMobile()) return 306;
    
    const container = document.querySelector('.projects-container');
    if (!container) return window.innerWidth - 40; // По умолчанию
    
    // Рассчитываем ширину карточки как ширину контейнера
    // (которая уже учитывает отступы родительского контейнера)
    return container.offsetWidth;
}
    
    // Обновляем карусель
    function updateCarousel() {
        if (isMobile()) {
            // Для мобилок
            updateCarouselMobile();
            return;
        }
        
        // Для десктопа
        const maxPosition = getMaxPosition();
        
        // Ограничиваем позицию
        if (currentPosition < 0) currentPosition = 0;
        if (currentPosition > maxPosition) currentPosition = maxPosition;
        
        // Применяем трансформацию
        projectsTrack.style.transform = `translateX(-${currentPosition}px)`;
        
        // Обновляем кнопки
        updateButtons(maxPosition);
        
        console.log('Позиция:', currentPosition, 'Макс:', maxPosition);
    }
    
    // Для мобильной версии
    function updateCarouselMobile() {
        const maxPosition = getMaxPosition();
        
        // Ограничиваем позицию
        if (currentPosition < 0) currentPosition = 0;
        if (currentPosition > maxPosition) currentPosition = maxPosition;
        
        // Применяем трансформацию
        projectsTrack.style.transform = `translateX(-${currentPosition}px)`;
        
        // Обновляем кнопки
        updateButtonsMobile(maxPosition);
    }
    
    // Обновляем состояние кнопок для десктопа
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
    
    // Обновляем состояние кнопок для мобилок
    function updateButtonsMobile(maxPosition) {
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
                // На мобилке - листаем по одной карточке (актуальная ширина)
                const cardWidth = getCardWidthMobile();
                currentPosition = Math.max(0, currentPosition - cardWidth);
            } else {
                // На десктопе
                const visibleCards = getVisibleCards();
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
                // На мобилке - листаем по одной карточке (актуальная ширина)
                const cardWidth = getCardWidthMobile();
                const maxPosition = getMaxPosition();
                currentPosition = Math.min(maxPosition, currentPosition + cardWidth);
            } else {
                // На десктопе
                const visibleCards = getVisibleCards();
                const maxPosition = getMaxPosition();
                const step = (306 + 24) * Math.min(2, visibleCards);
                currentPosition = Math.min(maxPosition, currentPosition + step);
            }
            updateCarousel();
        }
    });
}
    
    // ===== ОТКРЫТИЕ ОПИСАНИЯ - РАБОЧИЙ ВАРИАНТ =====
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по кнопке раскрытия');
            
            const card = this.closest('.project-card');
            const description = card.querySelector('.project-card-description');
            const arrowLeft = card.querySelector('.arrow-left');
            const arrowDown = card.querySelector('.arrow-down');
            
            // Проверяем элементы
            console.log('Описание найдено:', !!description);
            console.log('Стрелка влево:', !!arrowLeft);
            console.log('Стрелка вниз:', !!arrowDown);
            
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
                console.log('Описание закрыто');
            } else {
                // Открываем
                description.classList.add('show');
                if (arrowLeft) arrowLeft.classList.add('hidden');
                if (arrowDown) arrowDown.classList.remove('hidden');
                console.log('Описание открыто');
                
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
    
    // Клик по самой карточке (кроме кнопки)
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
            updateCarousel();
        }, 250);
    });
    
    // Инициализация
    updateCarousel();
    selectProject(currentProjectId);
    
    // Для отладки - показываем первый проект
    const firstCard = document.querySelector('.project-card[data-project-id="1"]');
    if (firstCard) {
        firstCard.querySelector('.project-toggle-btn')?.click();
    }
    
    console.log('Проекты: инициализация завершена');
});