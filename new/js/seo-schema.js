(function() {
    'use strict';
    
    if (document.querySelector('script[data-seo-schema]')) return;
    
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "LandscapingBusiness",
        "name": "ООО «Четыре гнома»",
        "description": "Профессиональное благоустройство участков под ключ в Москве и Московской области. Ландшафтный дизайн, озеленение, мощение дорожек, автополив.",
        "url": window.location.origin,
        "telephone": "+79099000032",
        "email": "vasiliyduvalka04@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "ул. Клубная, 5, офис 127",
            "addressLocality": "п. Отрадное",
            "addressRegion": "Московская область",
            "postalCode": "143080",
            "addressCountry": "RU"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "55.8638",
            "longitude": "37.6173"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ],
        "priceRange": "₽₽",
        "image": window.location.origin + "/assets/images/logo.png",
        "sameAs": [
            "https://t.me/alenabagryanova"
        ],
        "areaServed": {
            "@type": "State",
            "name": "Московская область"
        },
        "makesOffer": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Ландшафтное проектирование",
                    "description": "Разработка индивидуальных проектов садов и приусадебных участков"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Благоустройство территории",
                    "description": "Комплексное озеленение, укладка газона, мощение дорожек"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Автоматический полив",
                    "description": "Проектирование и установка систем автополива и дренажа"
                }
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "47",
            "bestRating": "5",
            "worstRating": "1"
        }
    };
    
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "ООО «Четыре гнома»",
        "image": window.location.origin + "/assets/images/logo.png",
        "telephone": "+79099000032",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "ул. Клубная, 5, офис 127",
            "addressLocality": "п. Отрадное",
            "addressRegion": "Московская область",
            "postalCode": "143080",
            "addressCountry": "RU"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "55.8638",
            "longitude": "37.6173"
        },
        "openingHours": "Mo-Fr 09:00-18:00",
        "priceRange": "₽₽"
    };
    
    function addSchemaToHead(schema, type) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-schema', type);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        addSchemaToHead(schemaData, 'landscaping-business');
        addSchemaToHead(localBusinessSchema, 'local-business');
        
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Главная",
                    "item": window.location.origin
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Благоустройство участков",
                    "item": window.location.origin + "/#services"
                }
            ]
        };
        
        addSchemaToHead(breadcrumbSchema, 'breadcrumb');
        
        console.log('✅ SEO схемы загружены');
    });
    
})();