document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Блок "Что мы делаем": запускаем оптимизированную версию');
    
    // Элементы DOM
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImage = document.getElementById('service-image');
    const serviceImageContainer = document.querySelector('.service-image');
    const serviceDescription = document.getElementById('service-description');

    // Данные с предзагруженными изображениями
    const servicesData = {
        1: {
            image: 'assets/images/services/1.webp',
            description: 'Планировка, подбор материалов, цветов и мебели — создание гармоничного и функционального пространства',
            preloaded: null
        },
        2: {
            image: 'assets/images/services/2.webp',
            description: 'Разработка индивидуальных проектов садов и приусадебных участков — от концепции до 3D-визуализации.',
            preloaded: null
        },
        3: {
            image: 'assets/images/services/3.webp',
            description: 'Комплексное озеленение, укладка газона, мощение дорожек и установка декоративных элементов.',
            preloaded: null
        },
        4: {
            image: 'assets/images/services/4.webp',
            description: 'Подбор растений, расстановка по композиции и посадка многолетников, кустарников и декоративных трав.',
            preloaded: null
        },
        5: {
            image: 'assets/images/services/5.webp',
            description: 'Создание природных композиций из камней и растений для стильного ландшафтного акцента.',
            preloaded: null
        },
        6: {
            image: 'assets/images/services/6.webp',
            description: 'Проектирование и установка систем автополива, капельного орошения и водоотвода.',
            preloaded: null
        },
        7: {
            image: 'assets/images/services/7.webp',
            description: 'Создаём декоративные пруды, ручьи и фонтанные композиции, которые наполняют сад живой энергией.',
            preloaded: null
        },
        8: {
            image: 'assets/images/services/8.webp',
            description: 'Обрезка, удобрение, пересадка и защита растений — регулярное обслуживание вашего участка.',
            preloaded: null
        }
    };
    
    // ===== УБИРАЕМ ВСЕ ЗАДЕРЖКИ =====
    
    // ПРЕДЗАГРУЗКА ВСЕХ ИЗОБРАЖЕНИЙ МГНОВЕННО
    (function preloadAllImages() {
        console.log('🔍 Предзагружаем ВСЕ изображения услуг...');
        
        Object.keys(servicesData).forEach(key => {
            const img = new Image();
            img.src = servicesData[key].image;
            
            // Сохраняем в объект для мгновенного доступа
            servicesData[key].preloaded = img;
            
            img.onload = () => {
                servicesData[key].loaded = true;
                console.log(`✅ Изображение ${key} загружено`);
            };
            
            img.onerror = () => {
                console.warn(`⚠️ Не удалось загрузить: ${servicesData[key].image}`);
                // Создаём placeholder
                const placeholder = new Image();
                placeholder.src = `https://via.placeholder.com/526x358/404040/FFFFFF?text=Услуга+${key}`;
                servicesData[key].preloaded = placeholder;
                servicesData[key].loaded = true;
            };
        });
    })();
    
    // Функция выбора услуги - АБСОЛЮТНО МГНОВЕННО
    function selectService(serviceId) {
        const startTime = performance.now();
        
        // 1. Обновляем активный пункт (мгновенно)
        serviceItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`.service-item[data-service="${serviceId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        // 2. Обновляем описание (мгновенно, без анимаций)
        if (serviceDescription && servicesData[serviceId]) {
            serviceDescription.textContent = servicesData[serviceId].description;
            serviceDescription.style.opacity = '1'; // Убираем анимацию
        }
        
        // 3. Обновляем картинку (УЛЬТРА-БЫСТРО)
        if (serviceImage && servicesData[serviceId]) {
            const data = servicesData[serviceId];
            
            // Убираем любые анимации/переходы у картинки
            serviceImage.style.transition = 'none';
            
            // Используем предзагруженное изображение если оно уже загружено
            if (data.preloaded && data.preloaded.complete) {
                serviceImage.src = data.preloaded.src;
                serviceImage.alt = `Услуга ${serviceId}`;
                console.log(`⚡ Изображение ${serviceId} установлено мгновенно`);
            } else {
                // Если еще не загружено, загружаем обычным способом
                serviceImage.src = data.image;
                serviceImage.alt = `Услуга ${serviceId}`;
                
                // Но не показываем лоадер - сразу показываем картинку
                if (serviceImageContainer) {
                    serviceImageContainer.classList.remove('loading');
                }
            }
        }
        
        const endTime = performance.now();
        console.log(`🎯 Услуга ${serviceId} переключена за ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ =====
    
    // Клики по пунктам - без задержек
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceId = this.dataset.service;
            selectService(serviceId);
        });
    });
    
    // Предзагрузка при наведении (дополнительная)
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const serviceId = this.dataset.service;
            if (serviceId && servicesData[serviceId] && !servicesData[serviceId].loaded) {
                // Тихая предзагрузка
                const img = new Image();
                img.src = servicesData[serviceId].image;
                img.onload = () => {
                    servicesData[serviceId].loaded = true;
                    servicesData[serviceId].preloaded = img;
                };
            }
        });
    });
    
    // Активируем первую услугу сразу
    setTimeout(() => {
        selectService(1);
    }, 100);
    
    // Убираем все CSS анимации которые могут тормозить
    function disableAnimations() {
        const style = document.createElement('style');
        style.id = 'no-transitions';
        style.textContent = `
            .service-image,
            .service-image img,
            .service-description,
            .service-item {
                transition: none !important;
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    disableAnimations();
    
    console.log('✅ Блок "Что мы делаем": оптимизация завершена');
});