(function () {
  function setMeta(name, content) {
    var tag = document.querySelector('meta[name="' + name + '"]');
    if (tag && content) {
      tag.setAttribute('content', content);
    }
  }

  function setCanonical(href) {
    var link = document.querySelector('link[rel="canonical"]');
    if (link && href) {
      link.setAttribute('href', href);
    }
  }

  function setHeroTitle(lines) {
    var hero = document.querySelector('.hero-title');
    if (!hero || !Array.isArray(lines)) return;
    hero.innerHTML = '';
    lines.forEach(function (line, index) {
      hero.appendChild(document.createTextNode(line));
      if (index < lines.length - 1) {
        hero.appendChild(document.createElement('br'));
      }
    });
  }

  function updateNav(navItems) {
    if (!Array.isArray(navItems)) return;
    var links = document.querySelectorAll('.nav .nav-link');
    navItems.forEach(function (item, index) {
      var link = links[index];
      if (!link) return;
      link.textContent = item.label || '';
      if (item.href) link.setAttribute('href', item.href);
    });
  }

  function createArrowLeftSvg() {
    return `
      <svg class="arrow-left" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.8612 34.8418L19.1387 24.5L30.8612 14.1582V34.8418ZM29.4518 36.4655L17.7314 26.1237C17.5017 25.9213 17.3176 25.6717 17.1914 25.3917C17.0653 25.1116 17 24.8076 17 24.5C17 24.1924 17.0653 23.8884 17.1914 23.6083C17.3176 23.3283 17.5017 23.0787 17.7314 22.8763L29.4518 12.5345C29.7611 12.2613 30.1419 12.0838 30.5486 12.0232C30.9554 11.9626 31.3708 12.0215 31.7452 12.1928C32.1196 12.3641 32.4371 12.6406 32.6596 12.9892C32.8822 13.3378 33.0004 13.7436 33 14.1582V34.8418C33.0004 35.2564 32.8822 35.6622 32.6596 36.0108C32.4371 36.3594 32.1196 36.6359 31.7452 36.8072C31.3708 36.9785 30.9554 37.0374 30.5486 36.9768C30.1419 36.9162 29.7611 36.7387 29.4518 36.4655Z" fill="#E2E2E2"/>
      </svg>
    `;
  }

  function createArrowDownSvg() {
    return `
      <svg class="arrow-down hidden" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M34.8418 19.1388L24.5 30.8613L14.1582 19.1388L34.8418 19.1388ZM36.4655 20.5482L26.1237 32.2686C25.9213 32.4983 25.6717 32.6824 25.3917 32.8086C25.1116 32.9347 24.8076 33 24.5 33C24.1924 33 23.8884 32.9347 23.6083 32.8086C23.3283 32.6824 23.0787 32.4983 22.8763 32.2686L12.5345 20.5482C12.2613 20.2389 12.0838 19.8581 12.0232 19.4514C11.9626 19.0446 12.0215 18.6292 12.1928 18.2548C12.3641 17.8804 12.6406 17.5629 12.9892 17.3404C13.3378 17.1178 13.7436 16.9996 14.1582 17L34.8418 17C35.2564 16.9996 35.6622 17.1178 36.0108 17.3404C36.3594 17.5629 36.6359 17.8804 36.8072 18.2548C36.9785 18.6292 37.0374 19.0446 36.9768 19.4514C36.9162 19.8581 36.7387 20.2389 36.4655 20.5482Z" fill="#E2E2E2"/>
      </svg>
    `;
  }

  function renderProjects(projects) {
    var track = document.querySelector('.projects-track');
    var featured = document.querySelector('.featured-projects');
    if (!track || !featured || !Array.isArray(projects)) return;

    track.innerHTML = '';
    featured.innerHTML = '';

    projects
      .slice()
      .sort(function (a, b) { return a.sort - b.sort; })
      .forEach(function (project, index) {
        var card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = String(project.id);

        var imageWrapper = document.createElement('div');
        imageWrapper.className = 'project-card-image';
        var img = document.createElement('img');
        img.src = project.smallImage;
        img.alt = project.title;
        img.width = 306;
        img.height = 306;
        imageWrapper.appendChild(img);

        var content = document.createElement('div');
        content.className = 'project-card-content';
        var title = document.createElement('h3');
        title.className = 'project-card-title';
        title.textContent = project.title;
        var button = document.createElement('button');
        button.className = 'project-toggle-btn';
        button.setAttribute('aria-label', 'Показать описание');
        button.innerHTML = createArrowLeftSvg() + createArrowDownSvg();
        content.appendChild(title);
        content.appendChild(button);

        var description = document.createElement('div');
        description.className = 'project-card-description';
        var descP = document.createElement('p');
        descP.textContent = project.description;
        description.appendChild(descP);

        card.appendChild(imageWrapper);
        card.appendChild(content);
        card.appendChild(description);
        track.appendChild(card);

        var featuredCard = document.createElement('div');
        featuredCard.className = 'featured-card' + (index === 0 ? ' active' : '');
        featuredCard.dataset.projectId = String(project.id);

        var large1 = document.createElement('img');
        large1.src = project.featuredImages[0];
        large1.alt = project.title + ' - вид 1';
        large1.width = 623;
        large1.height = 341;
        var large2 = document.createElement('img');
        large2.src = project.featuredImages[1];
        large2.alt = project.title + ' - вид 2';
        large2.width = 623;
        large2.height = 341;

        featuredCard.appendChild(large1);
        featuredCard.appendChild(large2);
        featured.appendChild(featuredCard);
      });
  }

  function renderServices(services) {
    var list = document.querySelector('.services-list');
    var image = document.getElementById('service-image');
    var description = document.getElementById('service-description');
    if (!list || !Array.isArray(services)) return;

    var sorted = services.slice().sort(function (a, b) { return a.order - b.order; });
    list.innerHTML = '';

    sorted.forEach(function (service, index) {
      var item = document.createElement('div');
      item.className = 'service-item' + (index === 0 ? ' active' : '');
      item.dataset.service = String(service.id);
      item.dataset.image = service.image;

      var content = document.createElement('div');
      content.className = 'service-item-content';
      content.innerHTML =
        '<svg class="service-arrow" width="50" height="50" viewBox="0 0 50 50" fill="none">' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.1388 34.8418L30.8613 24.5L19.1388 14.1582V34.8418ZM20.5482 36.4655L32.2686 26.1237C32.4983 25.9213 32.6824 25.6717 32.8086 25.3917C32.9347 25.1116 33 24.8076 33 24.5C33 24.1924 32.9347 23.8884 32.8086 23.6083C32.6824 23.3283 32.4983 23.0787 32.2686 22.8763L20.5482 12.5345C20.2389 12.2613 19.8581 12.0838 19.4514 12.0232C19.0446 11.9626 18.6292 12.0215 18.2548 12.1928C17.8804 12.3641 17.5629 12.6406 17.3404 12.9892C17.1178 13.3378 16.9996 13.7436 17 14.1582V34.8418C16.9996 35.2564 17.1178 35.6622 17.3404 36.0108C17.5629 36.3594 17.8804 36.6359 18.2548 36.8072C18.6292 36.9785 19.0446 37.0374 19.4514 36.9768C19.8581 36.9162 20.2389 36.7387 20.5482 36.4655Z" fill="#E2E2E2"/></svg>' +
        '<span class="service-text"></span>';

      content.querySelector('.service-text').textContent = service.title;
      item.appendChild(content);
      list.appendChild(item);
    });

    if (sorted[0]) {
      if (image) image.src = sorted[0].image;
      if (description) description.textContent = sorted[0].description;
    }
  }

  function formatPrice(price, currency) {
    if (currency === 'RUB') return price + ' ₽';
    return price + ' ' + currency;
  }

  function renderPricing(pricing) {
    if (!pricing) return;
    var blocks = document.querySelectorAll('.pricing-block');
    var mainTitle = document.querySelector('.main-pricing-title');
    if (mainTitle && window.__CONTENT__ && window.__CONTENT__.site && window.__CONTENT__.site.sections) {
      mainTitle.textContent = window.__CONTENT__.site.sections.pricingTitle;
    }

    var landscape = blocks[0];
    var interior = blocks[1];

    function renderBlock(block, table, showHeader) {
      if (!block || !table) return;
      var mobileTitle = block.querySelector('.mobile-table-title');
      var title = block.querySelector('.pricing-title');
      if (mobileTitle) mobileTitle.textContent = table.mobileTitle || '';
      if (title) title.textContent = table.title || '';

      var tableEl = block.querySelector('.pricing-table');
      if (!tableEl) return;

      var headerClass = showHeader ? 'table-header' : 'table-header hidden';
      var headerHtml =
        '<div class="' + headerClass + '">' +
        '<div class="table-cell header-cell">Наименование работы</div>' +
        '<div class="table-cell header-cell">Цена от *</div>' +
        '<div class="table-cell header-cell">Ед. изм.</div>' +
        '</div>';

      var rowsHtml = (table.rows || [])
        .slice()
        .sort(function (a, b) { return a.order - b.order; })
        .map(function (row) {
          return (
            '<div class="table-row">' +
            '<div class="table-cell">' + row.name + '</div>' +
            '<div class="table-cell">' + formatPrice(row.price, row.currency) + '</div>' +
            '<div class="table-cell">' + row.unit + '</div>' +
            '</div>'
          );
        })
        .join('');

      tableEl.innerHTML = headerHtml + rowsHtml;
    }

    renderBlock(landscape, pricing.landscape, true);
    renderBlock(interior, pricing.interior, false);

    document.querySelectorAll('.pricing-note').forEach(function (note) {
      note.textContent = pricing.note || '';
    });
  }

  function renderContacts(contacts) {
    if (!contacts) return;

    var title = document.querySelector('.contacts-title');
    if (title && window.__CONTENT__ && window.__CONTENT__.site && window.__CONTENT__.site.sections) {
      title.textContent = window.__CONTENT__.site.sections.contactsTitle;
    }

    document.querySelectorAll('.contacts-logo img').forEach(function (img) {
      img.setAttribute('src', contacts.logoImage);
      img.setAttribute('alt', contacts.companyName);
    });

    document.querySelectorAll('.about-title').forEach(function (el) {
      el.textContent = contacts.aboutTitle;
    });

    document.querySelectorAll('.about-description').forEach(function (el) {
      el.textContent = contacts.aboutText;
    });

    var phoneLink = document.querySelector('.contacts-info a[href^="tel:"]');
    if (phoneLink) {
      phoneLink.setAttribute('href', 'tel:' + contacts.phone);
      var phoneText = phoneLink.querySelector('.contact-text');
      if (phoneText) phoneText.textContent = contacts.displayPhone;
    }

    var mailLink = document.querySelector('.contacts-info a[href^="mailto:"]');
    if (mailLink) {
      mailLink.setAttribute('href', 'mailto:' + contacts.email);
      var mailText = mailLink.querySelector('.contact-text');
      if (mailText) mailText.textContent = contacts.email;
    }

    var mapLink = document.querySelector('.contacts-info a[href*="maps.google"]');
    if (mapLink) {
      mapLink.setAttribute('href', contacts.mapUrl);
      var mapText = mapLink.querySelector('.contact-text');
      if (mapText) mapText.textContent = contacts.address;
    }

    var tgLink = document.querySelector('.contacts-info a[href*="t.me"]');
    if (tgLink) {
      tgLink.setAttribute('href', contacts.telegramUrl);
      var tgText = tgLink.querySelector('.contact-text');
      if (tgText) tgText.textContent = contacts.telegramHandle;
    }
  }

  function applyContent(content) {
    if (!content) return;
    document.title = content.site.title;
    setMeta('description', content.site.description);
    setMeta('keywords', content.site.keywords);
    setCanonical(content.site.canonical);

    if (content.site.yandexVerification) {
      var verification = document.querySelector('meta[name="yandex-verification"]');
      if (verification) verification.setAttribute('content', content.site.yandexVerification);
    }

    var projectsTitle = document.querySelector('.projects-title');
    if (projectsTitle) projectsTitle.textContent = content.site.sections.projectsTitle;

    var servicesTitle = document.querySelector('.services-title');
    if (servicesTitle) servicesTitle.textContent = content.site.sections.servicesTitle;

    var footerText = document.querySelector('.footer-text');
    if (footerText) footerText.textContent = content.site.footerText;

    updateNav(content.site.nav);
    setHeroTitle(content.site.heroTitleLines);

    renderProjects(content.projects);

    var carouselTitles = document.querySelectorAll('.carousel-title');
    content.carousels.slice().sort(function (a, b) { return a.id - b.id; }).forEach(function (carousel, index) {
      if (carouselTitles[index]) {
        carouselTitles[index].textContent = carousel.title;
      }
    });

    renderServices(content.services);
    renderPricing(content.pricing);
    renderContacts(content.contacts);
  }

  var contentPromise = fetch('/api/content', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to load content');
      return response.json();
    })
    .then(function (content) {
      window.__CONTENT__ = content;
      applyContent(content);
      document.dispatchEvent(new CustomEvent('content:loaded', { detail: content }));
      return content;
    })
    .catch(function (error) {
      console.warn('Content: failed to load', error);
    });

  window.__CONTENT_READY__ = contentPromise;
})();
