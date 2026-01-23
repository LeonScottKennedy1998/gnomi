(function() {
    'use strict';

    function getContent() {
        return window.__CONTENT__ || null;
    }

    function buildSchemas(content) {
        const contacts = content && content.contacts ? content.contacts : {};
        const site = content && content.site ? content.site : {};

        const companyName = contacts.companyName || 'ООО «Четыре гнома»';
        const description = site.description || 'Профессиональное благоустройство участков под ключ в Москве и Московской области. Ландшафтный дизайн, озеленение, мощение дорожек, автополив.';
        const phone = contacts.phone || '+79099000032';
        const email = contacts.email || 'vasiliyduvalka04@gmail.com';
        const address = contacts.address || 'ул. Клубная, 5, офис 127';
        const logo = contacts.logoImage || 'assets/images/logo.png';
        const telegramUrl = contacts.telegramUrl || 'https://t.me/alenabagryanova';

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "LandscapingBusiness",
            "name": companyName,
            "description": description,
            "url": window.location.origin,
            "telephone": phone,
            "email": email,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": address,
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
            "image": window.location.origin + "/" + logo,
            "sameAs": [
                telegramUrl
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
            "name": companyName,
            "image": window.location.origin + "/" + logo,
            "telephone": phone,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": address,
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

        return { schemaData, localBusinessSchema, breadcrumbSchema };
    }

    function addSchemaToHead(schema, type) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-schema', type);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    function renderSchemas(content) {
        document.querySelectorAll('script[data-seo-schema]').forEach((el) => el.remove());
        const schemas = buildSchemas(content);
        addSchemaToHead(schemas.schemaData, 'landscaping-business');
        addSchemaToHead(schemas.localBusinessSchema, 'local-business');
        addSchemaToHead(schemas.breadcrumbSchema, 'breadcrumb');
        console.log('✓ SEO схемы загружены');
    }

    document.addEventListener('content:loaded', function(event) {
        renderSchemas(event.detail);
    });

    document.addEventListener('DOMContentLoaded', function() {
        renderSchemas(getContent());
    });

})();
