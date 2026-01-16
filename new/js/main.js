document.addEventListener('DOMContentLoaded', () => {
    console.log('Header: Initializing interactive mode...');
    
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let isHovering = false;
    let hideTimeout;
    let showTimeout;
    
    const TOP_ZONE_HEIGHT = 100;
    const HIDE_DELAY = 300;
    const SHOW_DELAY = 100;
    
    const topZone = document.createElement('div');
    topZone.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: ${TOP_ZONE_HEIGHT}px;
        z-index: 999;
        background: transparent;
        pointer-events: auto;
    `;
    document.body.appendChild(topZone);
    
    function hideHeader() {
        if (!isHovering) {
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
            header.style.pointerEvents = 'none';
        }
    }
    
    function showHeader() {
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
    }
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop <= 10) {
            showHeader();
            return;
        }
        
        if (scrollTop > lastScrollTop) {
            clearTimeout(showTimeout);
            hideTimeout = setTimeout(hideHeader, HIDE_DELAY);
        }
        
        lastScrollTop = scrollTop;
    });
    
    topZone.addEventListener('mouseenter', () => {
        isHovering = true;
        clearTimeout(hideTimeout);
        showTimeout = setTimeout(showHeader, SHOW_DELAY);
    });
    
    topZone.addEventListener('mouseleave', () => {
        isHovering = false;
        clearTimeout(showTimeout);
        
        setTimeout(() => {
            if (!isHovering) {
                hideTimeout = setTimeout(hideHeader, 300);
            }
        }, 100);
    });
    
    header.addEventListener('mouseenter', () => {
        isHovering = true;
        clearTimeout(hideTimeout);
    });
    
    header.addEventListener('mouseleave', () => {
        isHovering = false;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 10) {
            hideTimeout = setTimeout(hideHeader, 500);
        }
    });
    
    header.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
    
    showHeader();
    
    console.log('Header: Interactive mode active');
});