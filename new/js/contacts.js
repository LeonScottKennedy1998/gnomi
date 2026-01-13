// ИСПРАВЛЕННЫЙ СКРИПТ ДЛЯ КОНТАКТОВ С РАБОЧЕЙ ПОЧТОЙ
document.addEventListener('DOMContentLoaded', function() {
    console.log('Контакты: настраиваем выделение текста и клики');
    
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const href = item.getAttribute('href');
        const textElement = item.querySelector('.contact-text');
        const icon = item.querySelector('.contact-icon');
        
        if (!href || !textElement) return;
        
        // 1. Разрешаем выделение текста
        textElement.style.userSelect = 'text';
        textElement.style.webkitUserSelect = 'text';
        textElement.style.MozUserSelect = 'text';
        textElement.style.msUserSelect = 'text';
        
        // 2. Обработчик для текста - только выделение, без перехода по ссылке
        textElement.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Если текст уже выделен - ничего не делаем
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                return;
            }
            
            // На мобильных устройствах делаем задержку
            if ('ontouchstart' in window) {
                e.preventDefault();
                
                // Даем время для двойного тапа
                if (this.dataset.lastTap && (Date.now() - this.dataset.lastTap) < 300) {
                    // Двойной тап - открываем ссылку
                    openLink(href);
                    delete this.dataset.lastTap;
                } else {
                    // Одиночный тап - просто выделяем
                    this.dataset.lastTap = Date.now();
                    
                    // Пытаемся выделить текст программно
                    try {
                        const range = document.createRange();
                        range.selectNodeContents(this);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } catch(err) {
                        // Если не получилось выделить - ничего страшного
                    }
                }
            }
        });
        
        // 3. Обработчик для иконки - сразу открываем ссылку
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.style.pointerEvents = 'auto';
            
            icon.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                openLink(href);
            });
            
            // Для мобилок добавляем touch-события
            icon.addEventListener('touchend', function(e) {
                e.stopPropagation();
                e.preventDefault();
                openLink(href);
            });
        }
        
        // 4. Оставляем ссылку кликабельной, но с обработкой
        item.style.cursor = 'default';
        
        // Для почты и телефона делаем отдельную обработку
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            item.addEventListener('click', function(e) {
                // Если кликнули не на текст и не на иконку
                if (e.target === item) {
                    e.preventDefault();
                    // Можно ничего не делать или открыть ссылку
                    // openLink(href);
                }
            });
        }
    });
    
    // Функция открытия ссылки
    function openLink(href) {
        console.log('Открываем ссылку:', href);
        
        if (href.startsWith('tel:')) {
            // Для телефона - сразу звоним
            window.location.href = href;
        } else if (href.startsWith('mailto:')) {
            // Для почты - особенно важно на мобилках
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // На мобильном устройстве
                window.location.href = href;
            } else {
                // На десктопе
                window.open(href, '_self');
            }
        } else if (href.startsWith('http')) {
            // Для внешних ссылок
            window.open(href, '_blank');
        }
    }
    
    // Дополнительно: добавляем возможность быстрого копирования при долгом нажатии
    contactItems.forEach(item => {
        const textElement = item.querySelector('.contact-text');
        if (!textElement) return;
        
        let pressTimer;
        
        textElement.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                // Долгое нажатие - предлагаем скопировать
                showCopyMenu(this.textContent, e);
            }, 500);
        });
        
        textElement.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });
        
        textElement.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });
    });
    
    function showCopyMenu(text, event) {
        // Создаем меню для копирования
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.background = 'white';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '5px';
        menu.style.padding = '10px';
        menu.style.zIndex = '10000';
        menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        
        menu.innerHTML = `
            <button style="display: block; width: 100%; padding: 8px; margin: 5px 0; border: none; background: #f0f0f0; border-radius: 3px;">
                Скопировать: ${text}
            </button>
        `;
        
        // Позиционируем меню
        const touch = event.touches[0] || event.changedTouches[0];
        menu.style.left = (touch.pageX - 50) + 'px';
        menu.style.top = (touch.pageY - 50) + 'px';
        
        document.body.appendChild(menu);
        
        // Обработчик копирования
        menu.querySelector('button').addEventListener('click', function() {
            navigator.clipboard.writeText(text).then(() => {
                alert('Скопировано: ' + text);
                document.body.removeChild(menu);
            });
        });
        
        // Закрытие меню при клике вне
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    document.body.removeChild(menu);
                    document.removeEventListener('click', closeMenu);
                    document.removeEventListener('touchstart', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
            document.addEventListener('touchstart', closeMenu);
        }, 100);
    }
});