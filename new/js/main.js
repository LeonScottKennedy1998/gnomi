document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let isHovering = false;
    let hideTimeout;
    let showTimeout;
    
    // Настройки
    const SCROLL_THRESHOLD = 50; // На сколько нужно проскроллить чтобы скрыть
    const HIDE_DELAY = 300; // Задержка перед скрытием (мс)
    const SHOW_DELAY = 100; // Задержка перед показом (мс)
    const TOP_ZONE_HEIGHT = 100; // Зона вверху где хедер появляется
    
    // Функция скрытия хедера
    function hideHeader() {
        if (!isHovering) {
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
            header.style.pointerEvents = 'none';
        }
    }
    
    // Функция показа хедера
    function showHeader() {
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
    }
    
    // ===== ОБРАБОТКА СКРОЛЛА =====
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Если мы в самом верху страницы - показываем хедер
        if (scrollTop <= 10) {
            showHeader();
            return;
        }
        
        // Определяем направление скролла
        if (scrollTop > lastScrollTop) {
            // Скроллим ВНИЗ - скрываем хедер
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(hideHeader, HIDE_DELAY);
        } 
        // НЕ показываем хедер при скролле вверх!
        // Хедер появляется ТОЛЬКО при наведении
        
        lastScrollTop = scrollTop;
    });
    
    // ===== ПОКАЗ ХЕДЕРА ПРИ НАВЕДЕНИИ НА ВЕРХ ЭКРАНА =====
    // Создаем невидимую зону вверху экрана
    const topZone = document.createElement('div');
    topZone.style.position = 'fixed';
    topZone.style.top = '0';
    topZone.style.left = '0';
    topZone.style.width = '100%';
    topZone.style.height = TOP_ZONE_HEIGHT + 'px';
    topZone.style.zIndex = '999';
    topZone.style.backgroundColor = 'transparent';
    topZone.style.pointerEvents = 'auto';
    document.body.appendChild(topZone);
    
    // При наведении на верхнюю зону - показываем хедер
    topZone.addEventListener('mouseenter', function() {
        isHovering = true;
        clearTimeout(hideTimeout);
        showTimeout = setTimeout(showHeader, SHOW_DELAY);
    });
    
    // При уходе курсора из верхней зоны - скрываем хедер
    topZone.addEventListener('mouseleave', function() {
        isHovering = false;
        clearTimeout(showTimeout);
        
        // Не скрываем сразу, даём время чтобы переместиться на хедер
        setTimeout(() => {
            if (!isHovering) {
                hideTimeout = setTimeout(hideHeader, 300);
            }
        }, 100);
    });
    
    // Также наводим на сам хедер
    header.addEventListener('mouseenter', function() {
        isHovering = true;
        clearTimeout(hideTimeout);
    });
    
    header.addEventListener('mouseleave', function() {
        isHovering = false;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Если не в самом верху страницы - скрываем хедер
        if (scrollTop > 10) {
            hideTimeout = setTimeout(hideHeader, 500);
        }
    });
    
    // ===== ПЛАВНЫЕ ПЕРЕХОДЫ ДЛЯ ХЕДЕРА =====
    header.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
    
    // Инициализация - показываем хедер
    showHeader();
    
    console.log('Хедер: интерактивный режим включен');
});