document.addEventListener('DOMContentLoaded', function() {
    console.log('Блок прайсов: скрипт запущен');
    
    // Обработчики для стрелок - ОБНОВЛЁННЫЙ КОД
    const pricingArrows = document.querySelectorAll('.pricing-arrow');
    
    pricingArrows.forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#contacts') {
                // Ждём немного, чтобы все элементы загрузились
                setTimeout(() => {
                    const contactsSection = document.getElementById('contacts');
                    
                    if (contactsSection) {
                        // Вычисляем позицию с учётом фиксированного хедера
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 80;
                        const targetPosition = contactsSection.offsetTop - headerHeight;
                        
                        // Плавный скролл
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        console.log('Скролл к контактам, позиция:', targetPosition);
                        
                        setTimeout(() => {
                            contactsSection.style.boxShadow = 'none';
                        }, 1000);
                    } else {
                        console.warn('Блок контактов не найден. Проверьте:');
                        console.log('- Есть ли элемент с id="contacts" в HTML');
                        console.log('- Загружен ли блок контактов до этого скрипта');
                        
                        // Альтернатива: скролл к низу страницы
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100); // Небольшая задержка для гарантии загрузки DOM
            }
        });
    });
    
});