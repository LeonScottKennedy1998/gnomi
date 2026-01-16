document.addEventListener('DOMContentLoaded', () => {
    console.log('Services: Initializing...');
    
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImage = document.getElementById('service-image');
    const serviceDescription = document.getElementById('service-description');

    const servicesData = {
        1: {
            image: 'assets/images/services/1.webp',
            description: 'Планировка, подбор материалов, цветов и мебели — создание гармоничного и функционального пространства'
        },
        2: {
            image: 'assets/images/services/2.webp',
            description: 'Разработка индивидуальных проектов садов и приусадебных участков — от концепции до 3D-визуализации.'
        },
        3: {
            image: 'assets/images/services/3.webp',
            description: 'Комплексное озеленение, укладка газона, мощение дорожек и установка декоративных элементов.'
        },
        4: {
            image: 'assets/images/services/4.webp',
            description: 'Подбор растений, расстановка по композиции и посадка многолетников, кустарников и декоративных трав.'
        },
        5: {
            image: 'assets/images/services/5.webp',
            description: 'Создание природных композиций из камней и растений для стильного ландшафтного акцента.'
        },
        6: {
            image: 'assets/images/services/6.webp',
            description: 'Проектирование и установка систем автополива, капельного орошения и водоотвода.'
        },
        7: {
            image: 'assets/images/services/7.webp',
            description: 'Создаём декоративные пруды, ручьи и фонтанные композиции, которые наполняют сад живой энергией.'
        },
        8: {
            image: 'assets/images/services/8.webp',
            description: 'Обрезка, удобрение, пересадка и защита растений — регулярное обслуживание вашего участка.'
        }
    };
    
    (function preloadCriticalImages() {
        console.log('Preloading service images...');
        
        Object.keys(servicesData).slice(0, 3).forEach(key => {
            const img = new Image();
            img.src = servicesData[key].image;
            img.decoding = 'async';
            servicesData[key].preloaded = img;
        });
    })();
    
    function selectService(serviceId) {
        serviceItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`.service-item[data-service="${serviceId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        if (serviceDescription && servicesData[serviceId]) {
            serviceDescription.textContent = servicesData[serviceId].description;
        }
        
        if (serviceImage && servicesData[serviceId]) {
            const data = servicesData[serviceId];
            
            if (data.preloaded && data.preloaded.complete) {
                serviceImage.src = data.preloaded.src;
            } else {
                serviceImage.src = data.image;
            }
            
            serviceImage.alt = `Услуга ${serviceId}`;
        }
    }
    
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceId = this.dataset.service;
            selectService(serviceId);
        });
    });
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const serviceId = this.dataset.service;
            if (serviceId && servicesData[serviceId] && !servicesData[serviceId].preloaded) {
                const img = new Image();
                img.src = servicesData[serviceId].image;
                img.decoding = 'async';
                servicesData[serviceId].preloaded = img;
            }
        });
    });
    
    selectService(1);
    
    const style = document.createElement('style');
    style.textContent = `
        .service-image, .service-image img, .service-description, .service-item {
            transition: none;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Services: Initialization complete');
});