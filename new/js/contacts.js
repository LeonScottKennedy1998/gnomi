document.addEventListener('DOMContentLoaded', function() {
    console.log('Контакты: настраиваем выделение текста и клики');
    
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const href = item.getAttribute('href');
        const textElement = item.querySelector('.contact-text');
        const icon = item.querySelector('.contact-icon');
        
        if (!href || !textElement) return;
        
        textElement.style.userSelect = 'text';
        textElement.style.webkitUserSelect = 'text';
        textElement.style.MozUserSelect = 'text';
        textElement.style.msUserSelect = 'text';
        
        textElement.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                return;
            }
            
            if ('ontouchstart' in window) {
                e.preventDefault();
                
                if (this.dataset.lastTap && (Date.now() - this.dataset.lastTap) < 300) {
                    openLink(href);
                    delete this.dataset.lastTap;
                } else {
                    this.dataset.lastTap = Date.now();
                    
                    try {
                        const range = document.createRange();
                        range.selectNodeContents(this);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } catch(err) {
                    }
                }
            }
        });
        
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.style.pointerEvents = 'auto';
            
            icon.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                openLink(href);
            });
            
            icon.addEventListener('touchend', function(e) {
                e.stopPropagation();
                e.preventDefault();
                openLink(href);
            });
        }
        
        item.style.cursor = 'default';
        
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            item.addEventListener('click', function(e) {
                if (e.target === item) {
                    e.preventDefault();

                }
            });
        }
    });
    
    function openLink(href) {
        console.log('Открываем ссылку:', href);
        
        if (href.startsWith('tel:')) {
            window.location.href = href;
        } else if (href.startsWith('mailto:')) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                window.location.href = href;
            } else {
                window.open(href, '_self');
            }
        } else if (href.startsWith('http')) {
            window.open(href, '_blank');
        }
    }
    
    contactItems.forEach(item => {
        const textElement = item.querySelector('.contact-text');
        if (!textElement) return;
        
        let pressTimer;
        
        textElement.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
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
        
        const touch = event.touches[0] || event.changedTouches[0];
        menu.style.left = (touch.pageX - 50) + 'px';
        menu.style.top = (touch.pageY - 50) + 'px';
        
        document.body.appendChild(menu);
        
        menu.querySelector('button').addEventListener('click', function() {
            navigator.clipboard.writeText(text).then(() => {
                alert('Скопировано: ' + text);
                document.body.removeChild(menu);
            });
        });
        
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