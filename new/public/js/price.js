document.addEventListener('DOMContentLoaded', () => {
    console.log('Pricing: Initializing...');
    
    const pricingArrows = document.querySelectorAll('.pricing-arrow');
    
    pricingArrows.forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.getAttribute('href') === '#contacts') {
                scrollToContacts();
            }
        });
    });
    
    function scrollToContacts() {
        const contactsSection = document.getElementById('contacts');
        const header = document.querySelector('.header');
        
        if (!contactsSection) {
            console.warn('Contacts section not found');
            return;
        }
        
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = contactsSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        console.log('Scrolling to contacts, position:', targetPosition);
    }
    
    console.log('Pricing: Initialization complete');
});