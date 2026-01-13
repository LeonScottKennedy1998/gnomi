// АДАПТАЦИЯ ЛОГО С ТОЧНЫМ ОТСТУПОМ 18px
document.addEventListener('DOMContentLoaded', function() {
    console.log('Контакты: адаптация лого с фиксированным отступом 18px');
    
    let isAdapting = false;
    let adaptationTimeout;
    
    function adaptLogoToText() {
        if (isAdapting) return;
        isAdapting = true;
        
        // Только для мобилок
        if (window.innerWidth > 767) {
            isAdapting = false;
            return;
        }
        
        const logoBlock = document.querySelector('.company-info-block .contacts-logo');
        const textBlock = document.querySelector('.company-text-block');
        const companyBlock = document.querySelector('.company-info-block');
        
        if (!logoBlock || !textBlock || !companyBlock) {
            isAdapting = false;
            return;
        }
        
        try {
            // 1. Устанавливаем ТОЧНЫЙ отступ 18px
            companyBlock.style.marginBottom = '18px';
            companyBlock.style.marginTop = '0';
            
            // 2. Убираем все лишние отступы у контейнера контактов
            const contactsLeft = document.querySelector('.contacts-left');
            if (contactsLeft) {
                contactsLeft.style.marginTop = '0';
                contactsLeft.style.paddingTop = '0';
            }
            
            const contactsInfo = document.querySelector('.contacts-info');
            if (contactsInfo) {
                contactsInfo.style.marginTop = '0';
                contactsInfo.style.paddingTop = '0';
            }
            
            // 3. Получаем реальную высоту текста
            const textHeight = textBlock.scrollHeight;
            
            // 4. Устанавливаем высоту лого
            logoBlock.style.height = textHeight + 'px';
            logoBlock.style.minHeight = textHeight + 'px';
            
            // 5. Центрируем лого
            logoBlock.style.display = 'flex';
            logoBlock.style.alignItems = 'center';
            logoBlock.style.justifyContent = 'center';
            
            // 6. Настраиваем изображение
            const logoImg = logoBlock.querySelector('img');
            if (logoImg) {
                // Автоматические размеры, но не больше 90% от высоты
                const maxLogoHeight = Math.min(textHeight * 0.9, 200); // 90% или максимум 200px
                logoImg.style.maxHeight = maxLogoHeight + 'px';
                logoImg.style.maxWidth = '90%';
                logoImg.style.height = 'auto';
                logoImg.style.width = 'auto';
                logoImg.style.objectFit = 'contain';
                logoImg.style.objectPosition = 'center';
            }
            
            console.log('✅ Лого адаптировано:', {
                высотаТекста: textHeight + 'px',
                отступДоКонтактов: '18px',
                ширинаЭкрана: window.innerWidth + 'px'
            });
            
        } catch (error) {
            console.error('Ошибка адаптации лого:', error);
        }
        
        // Сбрасываем флаг после небольшой задержки
        setTimeout(() => {
            isAdapting = false;
        }, 100);
    }
    
    // Оптимизированный обработчик ресайза
    function handleResize() {
        clearTimeout(adaptationTimeout);
        adaptationTimeout = setTimeout(adaptLogoToText, 150);
    }
    
    // Инициализация
    adaptLogoToText();
    
    // Запускаем после полной загрузки страницы
    window.addEventListener('load', function() {
        setTimeout(adaptLogoToText, 300);
    });
    
    // Запускаем с задержкой для загрузки шрифтов
    setTimeout(adaptLogoToText, 500);
    
    // Слушаем ресайз
    window.addEventListener('resize', handleResize);
    
    // Слушаем изменения в DOM (если контент динамический)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                handleResize();
            }
        });
    });
    
    // Наблюдаем за текстовым блоком
    const textBlock = document.querySelector('.company-text-block');
    if (textBlock) {
        observer.observe(textBlock, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // Также запускаем при изменении ориентации
    window.addEventListener('orientationchange', function() {
        setTimeout(adaptLogoToText, 300);
    });
});

// ДОПОЛНИТЕЛЬНЫЙ СКРИПТ ДЛЯ ГАРАНТИИ ОТСТУПА
(function() {
    'use strict';
    
    // Функция принудительной установки отступа
    function forceContactsMargin() {
        if (window.innerWidth > 767) return;
        
        const companyBlock = document.querySelector('.company-info-block');
        const contactsSection = document.querySelector('.contacts-info');
        
        if (companyBlock) {
            // Принудительно ставим 18px
            companyBlock.style.marginBottom = '18px';
            companyBlock.style.marginTop = '0';
        }
        
        if (contactsSection) {
            contactsSection.style.marginTop = '0';
            contactsSection.style.paddingTop = '0';
        }
    }
    
    // Запускаем несколько раз для гарантии
    document.addEventListener('DOMContentLoaded', forceContactsMargin);
    setTimeout(forceContactsMargin, 100);
    setTimeout(forceContactsMargin, 500);
    setTimeout(forceContactsMargin, 1000);
    
    window.addEventListener('load', forceContactsMargin);
    window.addEventListener('resize', function() {
        setTimeout(forceContactsMargin, 50);
    });
})();

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