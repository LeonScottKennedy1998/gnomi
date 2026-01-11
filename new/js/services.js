document.addEventListener('DOMContentLoaded', function() {
    console.log('Блок "Что мы делаем": скрипт запущен');
    
    // Элементы DOM
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImage = document.getElementById('service-image');
    const serviceImageContainer = document.querySelector('.service-image');
    const serviceDescription = document.getElementById('service-description');

    const servicesData = {
        1: {
            image: 'assets/images/services/1.png',
            description: 'Планировка, подбор материалов, цветов и мебели — создание гармоничного и функционального пространств'
        },
        2: {
            image: 'assets/images/services/2.png',
            description: 'Разработка индивидуальных проектов садов и приусадебных участков — от концепции до 3D-визуализации.'
        },
        3: {
            image: 'assets/images/services/3.png',
            description: 'Комплексное озеленение, укладка газона, мощение дорожек и установка декоративных элементов.'
        },
        4: {
            image: 'assets/images/services/4.png',
            description: 'Подбор растений, расстановка по композиции и посадка многолетников, кустарников и декоративных трав.'
        },
        5: {
            image: 'assets/images/services/5.png',
            description: 'Создание природных композиций из камней и растений для стильного ландшафтного акцента.'
        },
        6: {
            image: 'assets/images/services/6.png',
            description: 'Проектирование и установка систем автополива, капельного орошения и водоотвода.'
        },
        7: {
            image: 'assets/images/services/7.png',
            description: 'Создаём декоративные пруды, ручьи и фонтанные композиции, которые наполняют сад живой энергией и атмосферой уюта.'
        },
        8: {
            image: 'assets/images/services/8.png',
            description: 'Обрезка, удобрение, пересадка и защита растений — регулярное обслуживание вашего участка.'
        }
    };
    
     const preloadedImages = {};
    
    function preloadImages() {
        Object.keys(servicesData).forEach(key => {
            const img = new Image();
            img.src = servicesData[key].image;
            
            // Сохраняем загруженные картинки
            img.onload = function() {
                preloadedImages[key] = img;
                console.log(`Картинка для услуги ${key} предзагружена`);
            };
            
            // Обработка ошибок
            img.onerror = function() {
                console.warn(`Не удалось загрузить картинку: ${servicesData[key].image}`);
                // Создаём placeholder
                const placeholder = new Image();
                placeholder.src = `https://via.placeholder.com/526x358/404040/FFFFFF?text=Услуга+${key}`;
                preloadedImages[key] = placeholder;
            };
        });
    }
    
    // Функция выбора услуги - БЕЗ ЗАДЕРЖКИ
    function selectService(serviceId) {
        console.log('Выбрана услуга:', serviceId);
        
        // Убираем активный класс и скрываем ВСЕ стрелки
        serviceItems.forEach(item => {
            item.classList.remove('active');
            const arrow = item.querySelector('.service-arrow');
            if (arrow) {
                arrow.classList.add('hidden');
            }
        });
        
        // Активируем выбранный пункт
        const selectedItem = document.querySelector(`.service-item[data-service="${serviceId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            const arrow = selectedItem.querySelector('.service-arrow');
            if (arrow) {
                arrow.classList.remove('hidden');
            }
        }
        
        // Обновляем картинку и описание МГНОВЕННО
        if (servicesData[serviceId]) {
            const data = servicesData[serviceId];
            
            // 1. Показываем прелоадер
            if (serviceImageContainer) {
                serviceImageContainer.classList.add('loading');
            }
            
            // 2. Проверяем, есть ли предзагруженная картинка
            if (preloadedImages[serviceId]) {
                // Используем предзагруженную картинку
                serviceImage.src = preloadedImages[serviceId].src;
                serviceImage.alt = selectedItem?.querySelector('.service-text')?.textContent || 'Услуга';
                
                // Убираем прелоадер когда картинка готова
                if (serviceImage.complete) {
                    serviceImageContainer.classList.remove('loading');
                    serviceImage.classList.add('loaded');
                } else {
                    serviceImage.onload = function() {
                        serviceImageContainer.classList.remove('loading');
                        serviceImage.classList.add('loaded');
                    };
                }
            } else {
                // Загружаем новую картинку
                serviceImage.src = data.image;
                serviceImage.alt = selectedItem?.querySelector('.service-text')?.textContent || 'Услуга';
                serviceImage.classList.remove('loaded');
                
                // Ждём загрузки
                const img = new Image();
                img.src = data.image;
                img.onload = function() {
                    serviceImageContainer.classList.remove('loading');
                    serviceImage.classList.add('loaded');
                };
            }
            
            // 3. Обновляем описание (мгновенно)
            if (serviceDescription) {
                serviceDescription.style.opacity = '0';
                setTimeout(() => {
                    serviceDescription.textContent = data.description;
                    serviceDescription.style.opacity = '1';
                }, 10); // Минимальная задержка для анимации
            }
        }
    }
    
    // Обработчики кликов по пунктам
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceId = this.dataset.service;
            if (serviceId) {
                selectService(serviceId);
            }
        });
    });
    
    // Предзагрузка при наведении на пункт
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const serviceId = this.dataset.service;
            if (serviceId && !preloadedImages[serviceId]) {
                const img = new Image();
                img.src = servicesData[serviceId].image;
                img.onload = function() {
                    preloadedImages[serviceId] = img;
                };
            }
        });
    });
    
    // Инициализация
    preloadImages(); // Предзагружаем все картинки
    selectService(1); // Активируем первую услугу
    
    // Обработка ошибок загрузки
    if (serviceImage) {
        serviceImage.onerror = function() {
            console.warn('Не удалось загрузить картинку:', this.src);
            // Используем темный placeholder
            this.src = 'https://via.placeholder.com/526x358/404040/FFFFFF?text=Изображение+услуги';
            serviceImageContainer.classList.remove('loading');
        };
    }
    
    console.log('Блок "Что мы делаем": инициализация завершена');
});