(function(){
  const cfg = window.SITE_CONFIG || {};
  const path = location.pathname.split('/').pop() || 'index.html';
  const rawEmail = ((cfg.emailHref || '').replace(/^mailto:/,'') || cfg.emailDisplay || '').trim();
  const validFormEmail = rawEmail && !/replace-with-email/i.test(rawEmail) && rawEmail.includes('@');

  function active(url){
    return path === (url || '').split('#')[0] ? 'style="background:rgba(255,255,255,.12)"' : '';
  }

  const catNav = (cfg.headerCategories || []).map(item => {
    const cls = item.accent ? 'accent' : '';
    return `<a class="${cls}" ${active(item.href)} href="${item.href}">${item.label}</a>`;
  }).join('');

  const utilityLinks = (cfg.quickLinks || []).map(item => `<a href="${item.href}">${item.label}</a>`).join('');
  const trustPrimary = cfg.trustLinePrimary || 'Official Dealers For';
  const dealerBrands = cfg.dealerBrands || ['Miele','Cana-Vac','Cyclo Vac','SEBO','Sanitaire','Kärcher','Hibbert','Trovac','Beam','Hoover','Dyson','Eureka','Kenmore','Filter Queen','Electrolux'];
  const brandSlogan = cfg.brandSlogan || 'Convenience you want and expertise you need';
  const brandSince = cfg.brandSinceLabel || `Since ${cfg.foundedYear || '1999'}`;
  const isHomePage = path === 'index.html' || path === '';
  const headerBadges = (cfg.headerNoticeBadges || []).map(label => `<span class="badge">${label}</span>`).join('');
  const headerNoticeTitle = cfg.headerNoticeTitle ? `<div class="notice-title">${cfg.headerNoticeTitle}</div>` : '';

  function slugifyDealerBrand(name){
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function buildDealerSequence(){
    const items = [
      `<span class="dealer-label">${trustPrimary}</span>`,
      ...dealerBrands.map((name, index) => {
        const pill = `<span class="dealer-pill dealer-pill--${slugifyDealerBrand(name)}">${name}</span>`;
        return index < dealerBrands.length - 1 ? `${pill}<span class="dealer-sep" aria-hidden="true">•</span>` : pill;
      })
    ];
    return items.join('');
  }

  const dealerMarkup = buildDealerSequence();

  const headerHtml = `
    <div class="topline trust-topline">
      <div class="container trust-topline-inner">
        <div class="trust-marquee-shell" aria-label="Official dealer brands">
          <div class="trust-marquee-track">
            <div class="trust-marquee-item">${dealerMarkup}</div>
            <div class="trust-marquee-item" aria-hidden="true">${dealerMarkup}</div>
          </div>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container brand-row">
        <a class="brand ${isHomePage ? 'brand--intro' : ''}" href="index.html" aria-label="${cfg.businessName}">
          <img class="brand-logo ${isHomePage ? 'brand-logo--intro' : ''}" src="logo4.png" alt="${cfg.businessName} logo">
          <div class="brand-copy ${isHomePage ? 'brand-copy--intro' : ''}">
            <div class="brand-name">${cfg.businessName}</div>
            <div class="brand-tagline">${brandSlogan}</div>
            <div class="brand-since">${brandSince}</div>
          </div>
        </a>
        <div class="header-actions header-actions-compact">
          <a class="btn btn-secondary" href="${cfg.phoneHref}">905-855-4948</a>
          <a class="btn btn-primary" href="request-quote.html">Request a Quote</a>
          <a class="btn btn-accent" data-reviews-link href="#" target="_blank" rel="noopener">Read Google Reviews</a>
        </div>
      </div>
      <nav class="category-nav" aria-label="Primary navigation">
        <div class="container">${catNav}</div>
      </nav>
      <div class="utility-nav utility-nav-simple">
        <div class="container utility-nav-simple-inner">
          ${utilityLinks ? `<div class="utility-links">${utilityLinks}</div>` : ''}
          ${headerNoticeTitle || `<div class="notice-badges">${headerBadges}</div>`}
        </div>
      </div>
    </header>
  `;

  const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand">
              <img src="logo4.png" alt="${cfg.businessName} logo">
              <div>
                <div class="brand-name">${cfg.businessName}</div>
                <div class="brand-sub">Serving Mississauga since ${cfg.foundedYear} with vacuum sales, repairs, parts, and central vacuum service.</div>
              </div>
            </div>
            <p class="mt-1">We help homeowners across ${cfg.serviceAreas.join(', ')} with Miele sales, Miele warranty repairs, all-brand service, parts and accessories, and complete central vacuum support for new and existing homes.</p>
          </div>
          <div>
            <h4>Browse</h4>
            <div class="footer-links">
              <a href="index.html">Home</a>
              <a href="vacuum-sales.html">Vacuums</a>
              <a href="sale.html">On Sale</a>
              <a href="parts-accessories.html">Parts & Accessories</a>
            </div>
          </div>
          <div>
            <h4>Service & Support</h4>
            <div class="footer-links">
              <a href="repairs-service.html">Services & Repairs</a>
              <a href="central-vacuum.html">Central Vacuum System</a>
              <a href="request-quote.html">Request a Quote</a>
              <a href="contact.html">Contact</a>
            </div>
          </div>
          <div>
            <h4>Visit Us</h4>
            <div class="footer-links">
              <a href="${cfg.phoneHref}">${cfg.phoneDisplay}</a>
              <a href="${cfg.emailHref}">${cfg.emailDisplay}</a>
              <a href="${cfg.googleMapsUrl}" target="_blank" rel="noopener">${cfg.addressLine1}<br>${cfg.addressLine2}</a>
              <span>${cfg.hours.weekdays}</span>
              <span>${cfg.hours.saturday}</span>
              <span>${cfg.hours.sunday}</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© <span id="year"></span> ${cfg.businessName}. All rights reserved.</div>
          <div>Serving ${cfg.serviceAreas.join(', ')}.</div>
        </div>
      </div>
    </footer>
  `;

  document.querySelectorAll('[data-site-header]').forEach(el => el.innerHTML = headerHtml);
  document.querySelectorAll('[data-site-footer]').forEach(el => el.innerHTML = footerHtml);

  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-phone]').forEach(el => { el.href = cfg.phoneHref; el.textContent = cfg.phoneDisplay; });
  document.querySelectorAll('[data-email]').forEach(el => { el.href = cfg.emailHref; el.textContent = cfg.emailDisplay; });
  document.querySelectorAll('[data-address-single]').forEach(el => el.textContent = cfg.addressSingleLine);
  document.querySelectorAll('[data-hours-weekdays]').forEach(el => el.textContent = cfg.hours.weekdays);
  document.querySelectorAll('[data-hours-saturday]').forEach(el => el.textContent = cfg.hours.saturday);
  document.querySelectorAll('[data-hours-sunday]').forEach(el => el.textContent = cfg.hours.sunday);
  document.querySelectorAll('[data-reviews-link]').forEach(el => el.href = cfg.googleReviewsUrl);
  document.querySelectorAll('[data-maps-link]').forEach(el => el.href = cfg.googleMapsUrl);
  document.querySelectorAll('[data-map-embed]').forEach(el => el.src = cfg.mapEmbedUrl);
  document.querySelectorAll('[data-founded-year]').forEach(el => el.textContent = cfg.foundedYear);

  document.querySelectorAll('[data-category-cards]').forEach(mount => {
    mount.innerHTML = (cfg.categoryCards || []).map(item => `
      <a class="category-tile" href="${item.link}">
        <div class="category-icon"><img src="${item.image}" alt="${item.title}"></div>
        <div>
          <div class="category-title">${item.title}</div>
          <div class="category-count">${item.count}</div>
        </div>
      </a>
    `).join('');
  });

  function getFilterCategory(product){
    if(product.filterCategory) return product.filterCategory;
    if(product.category === 'Handheld Vacuums') return 'handheld';
    if(product.category === 'Cordless Stick Vacuums') return 'stick';
    if(product.category === 'Canister Vacuums' || product.category === 'Bagless Vacuums') return 'canister';
    return 'all';
  }

  function renderProducts(products, mount){
    mount.innerHTML = products.map(p => {
      const isCentral = getFilterCategory(p) === 'central';
      const summaryText = p.summaryText || (isCentral ? 'View main features & system details' : 'View main features & included attachments');
      const featuresHeading = p.featuresHeading || 'Main features';
      const detailsHeading = p.detailHeading || (isCentral ? 'System details & install options' : 'Included attachments');
      const ctaLabel = p.ctaLabel || (isCentral ? 'Request Quote' : 'Call to Order');
      const bestForLabel = p.bestForLabel || 'Best for:';
      return `
      <article class="product-card" data-category="${getFilterCategory(p)}" data-brand="${p.brandSlug || p.brand}">
        <div class="product-media">
          <span class="product-badge">${p.category}</span>
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="product-body">
          <div class="product-brand">${p.brand}</div>
          <div class="product-title">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          ${p.bestFor ? `<div class="product-best"><strong>${bestForLabel}</strong> ${p.bestFor}</div>` : ''}
          <div class="product-tags">
            ${(p.tags||[]).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <details class="product-details">
            <summary>${summaryText}</summary>
            <div class="product-detail-copy">
              <div class="product-detail-section">
                <h4>${featuresHeading}</h4>
                <ul>${(p.features || []).map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
              <div class="product-detail-section">
                <h4>${detailsHeading}</h4>
                <ul>${(p.attachments || []).map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
            </div>
          </details>
          <div class="product-footer">
            <div class="price">${p.price}</div>
            <a class="btn btn-secondary" href="request-quote.html">${ctaLabel}</a>
          </div>
        </div>
      </article>
    `}).join('');
  }

  const q = new URLSearchParams(location.search).get('q');

  function getProductsByType(type){
    let items = cfg.featuredProducts || [];
    if(type === 'miele') items = items.filter(p => p.brand === 'Miele');
    if(type === 'featured') items = items.slice(0, 8);
    if(type === 'sale') items = items.slice(0, 4);
    if(type === 'canisters') items = items.filter(p => ['canister'].includes(getFilterCategory(p)));
    if(type === 'sticks') items = items.filter(p => getFilterCategory(p) === 'stick');
    if(type === 'handheld') items = items.filter(p => getFilterCategory(p) === 'handheld');
    if(type === 'catalog') items = items.slice();
    if(q){
      const term = q.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term) ||
        (p.tags || []).join(' ').toLowerCase().includes(term) ||
        (p.bestFor || '').toLowerCase().includes(term) ||
        (p.features || []).join(' ').toLowerCase().includes(term) ||
        (p.attachments || []).join(' ').toLowerCase().includes(term)
      );
    }
    return items;
  }

  function updateCatalogSummary(summaryEl, items, categoryKey, mieleOnly){
    if(!summaryEl) return;
    const labels = {all:'all vacuum types', canister:'canister vacuums', upright:'upright vacuums', stick:'stick vacuums', commercial:'commercial vacuums', handheld:'handheld vacuums'};
    let text = `Showing ${items.length} result${items.length === 1 ? '' : 's'} for ${labels[categoryKey] || labels.all}.`;
    if(mieleOnly) text += ' Miele-only filter is on.';
    summaryEl.textContent = text;
  }

  function renderCatalogWithFilters(mount){
    const chips = Array.from(document.querySelectorAll('[data-filter-chip]'));
    const mieleChip = document.querySelector('[data-filter-brand="miele"]');
    const resetBtn = document.querySelector('[data-filter-reset]');
    const summaryEl = document.querySelector('[data-filter-summary]');
    const emptyEl = document.querySelector('[data-filter-empty]');
    const params = new URLSearchParams(location.search);
    const state = {
      category: params.get('category') || 'all',
      mieleOnly: params.get('brand') === 'miele' || params.get('miele') === '1'
    };

    if(state.mieleOnly) state.category = 'all';

    function apply(){
      let items = getProductsByType('catalog');
      if(state.category !== 'all') items = items.filter(p => getFilterCategory(p) === state.category);
      if(state.mieleOnly) items = items.filter(p => (p.brandSlug || p.brand || '').toLowerCase() === 'miele');
      renderProducts(items, mount);
      if(emptyEl) emptyEl.classList.toggle('hidden', items.length > 0);
      updateCatalogSummary(summaryEl, items, state.category, state.mieleOnly);
      chips.forEach(btn => {
        const active = !state.mieleOnly && btn.dataset.filterChip === state.category;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if(mieleChip) {
        mieleChip.classList.toggle('is-active', state.mieleOnly);
        mieleChip.setAttribute('aria-pressed', state.mieleOnly ? 'true' : 'false');
      }

      const next = new URLSearchParams(location.search);
      if(state.category && state.category !== 'all') next.set('category', state.category); else next.delete('category');
      if(state.mieleOnly) next.set('brand', 'miele'); else next.delete('brand');
      const query = next.toString();
      const nextUrl = `${location.pathname}${query ? `?${query}` : ''}${location.hash || '#catalogue'}`;
      history.replaceState(null, '', nextUrl);
    }

    chips.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
      btn.addEventListener('click', () => {
        state.category = btn.dataset.filterChip || 'all';
        state.mieleOnly = false;
        apply();
      });
    });
    if(mieleChip) {
      mieleChip.setAttribute('aria-pressed', mieleChip.classList.contains('is-active') ? 'true' : 'false');
      mieleChip.addEventListener('click', () => {
        state.category = 'all';
        state.mieleOnly = true;
        apply();
      });
    }
    if(resetBtn) resetBtn.addEventListener('click', () => { state.category = 'all'; state.mieleOnly = false; apply(); });
    apply();
  }


  function getCentralAttachmentProducts(){
    let items = (cfg.centralAttachmentProducts || []).slice();
    if(q){
      const term = q.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term) ||
        (p.tags || []).join(' ').toLowerCase().includes(term) ||
        (p.bestFor || '').toLowerCase().includes(term) ||
        (p.features || []).join(' ').toLowerCase().includes(term) ||
        (p.attachments || []).join(' ').toLowerCase().includes(term)
      );
    }
    return items;
  }

  function matchesCentralAttachmentCategory(product, categoryKey){
    if(categoryKey === 'all') return true;
    const key = String(categoryKey).toLowerCase();
    const filters = Array.isArray(product.attachmentFilters) ? product.attachmentFilters : [product.filterCategory || product.category || ''];
    return filters.map(v => String(v).toLowerCase()).includes(key);
  }

  function updateCentralAttachmentSummary(summaryEl, items, categoryKey){
    if(!summaryEl) return;
    const labels = {
      all: 'all central vacuums and attachments',
      'central-vacuums': 'central vacuums',
      'tool-kits': 'tool kits',
      hoses: 'hoses',
      'power-heads': 'power heads',
      'turbo-heads': 'turbo heads',
      'hose-covers': 'hose covers',
      brushes: 'brushes',
      wands: 'wands'
    };
    summaryEl.textContent = `Showing ${items.length} result${items.length === 1 ? '' : 's'} for ${labels[categoryKey] || 'central vacuum attachments'}.`;
  }

  function renderCentralAttachmentCatalogWithFilters(mount){
    const chips = Array.from(document.querySelectorAll('[data-central-attachment-category]'));
    const resetBtn = document.querySelector('[data-central-attachment-reset]');
    const summaryEl = document.querySelector('[data-central-attachment-summary]');
    const emptyEl = document.querySelector('[data-central-attachment-empty]');
    const params = new URLSearchParams(location.search);
    const state = { category: params.get('cvAttachmentCategory') || 'all' };

    function apply(){
      let items = getCentralAttachmentProducts();
      if(state.category !== 'all') items = items.filter(p => matchesCentralAttachmentCategory(p, state.category));
      renderProducts(items, mount);
      if(emptyEl) emptyEl.classList.toggle('hidden', items.length > 0);
      updateCentralAttachmentSummary(summaryEl, items, state.category);
      chips.forEach(btn => {
        const active = btn.dataset.centralAttachmentCategory === state.category;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      const next = new URLSearchParams(location.search);
      if(state.category && state.category !== 'all') next.set('cvAttachmentCategory', state.category); else next.delete('cvAttachmentCategory');
      const query = next.toString();
      const nextUrl = `${location.pathname}${query ? `?${query}` : ''}${location.hash || '#central-attachments-catalogue'}`;
      history.replaceState(null, '', nextUrl);
    }

    chips.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
      btn.addEventListener('click', () => { state.category = btn.dataset.centralAttachmentCategory || 'all'; apply(); });
    });
    if(resetBtn) resetBtn.addEventListener('click', () => { state.category = 'all'; apply(); });
    apply();
  }

  function getAccessoryProducts(){
    let items = (cfg.partsProducts || []).slice();
    if(q){
      const term = q.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term) ||
        (p.tags || []).join(' ').toLowerCase().includes(term) ||
        (p.bestFor || '').toLowerCase().includes(term) ||
        (p.features || []).join(' ').toLowerCase().includes(term) ||
        (p.attachments || []).join(' ').toLowerCase().includes(term)
      );
    }
    return items;
  }

  function getAccessoryPrimaryCategory(product){
    const explicit = Array.isArray(product.partCategories)
      ? product.partCategories
      : (product.partCategory ? [product.partCategory] : []);
    const explicitCategory = explicit.map(v => String(v).toLowerCase()).find(Boolean);
    if(explicitCategory) return explicitCategory;

    const haystack = [
      product.name,
      product.brand,
      product.category,
      product.desc,
      (product.tags || []).join(' '),
      (product.features || []).join(' '),
      (product.attachments || []).join(' ')
    ].join(' ').toLowerCase();

    const isMotorFilter = /motor filter|pre-motor|post-motor/.test(haystack);
    const isBeltItem = /\bbelt\b|\bbelts\b/.test(haystack);
    const isTurboHead = /turbo ?head|turbohead|turbo brush|turbocat|stb\s?305|tk286/.test(haystack);
    const isPowerHead = (!isTurboHead) && (/power ?head|powerhead|electric power nozzle|electric nozzle|ebk\d+|et-1|et-2/.test(haystack));
    const isBrush = /\bbrush\b|\bbrushes\b|parquet|bare floor brush|combo carpet & floor tool|twister bare floor/.test(haystack) && !isTurboHead && !isPowerHead && !isBeltItem;

    if(isBeltItem) return 'belts';
    if(/\bbag\b|\bbags\b/.test(haystack)) return 'bags';
    if(/\bfilter\b|\bfilters\b|filtration|hepa|airclean|hyclean|pre-motor|post-motor|carbon dust/.test(haystack)) return 'filters';
    if(/electrical board|electronic board|control board|pc board|pcb/.test(haystack)) return 'electrical-boards';
    if(/\bswitch\b|\bswitches\b/.test(haystack)) return 'switches';
    if(/\bbattery\b|\bbatteries\b/.test(haystack)) return 'batteries';
    if(/\bhose\b|\bhoses\b/.test(haystack)) return 'hoses';
    if(/\bwand\b|telescopic wand|telescopic tube/.test(haystack)) return 'wands';
    if(isPowerHead) return 'power-heads';
    if(isTurboHead) return 'turbo-heads';
    if(isBrush) return 'brushes';
    if(/\bmotor\b|\bmotors\b/.test(haystack) && !isMotorFilter) return 'motors';
    return 'accessories';
  }

  function getAccessoryCategoryTokens(product){
    return [getAccessoryPrimaryCategory(product)];
  }

  function matchesMieleAccessoryType(product, mieleTypeKey){
    if(mieleTypeKey === 'all') return true;
    return getAccessoryPrimaryCategory(product) === String(mieleTypeKey).toLowerCase();
  }

  function matchesAccessoryCategory(product, categoryKey){
    if(categoryKey === 'all') return true;
    return getAccessoryPrimaryCategory(product) === String(categoryKey).toLowerCase();
  }

  function matchesAccessoryBrand(product, brandKey){
    if(brandKey === 'all') return true;
    const filters = Array.isArray(product.brandFilters) ? product.brandFilters : [product.brandSlug || (product.brand || '').toLowerCase()];
    return filters.map(v => String(v).toLowerCase()).includes(String(brandKey).toLowerCase());
  }

  function updateAccessorySummary(summaryEl, items, categoryKey, brandKey, mieleTypeKey){
    if(!summaryEl) return;
    const categoryLabels = {
      all: 'all parts, bags, and accessories',
      bags: 'bags',
      filters: 'filters',
      belts: 'belts',
      motors: 'motors',
      'electrical-boards': 'electrical boards',
      'miele-parts': 'Miele parts and accessories'
    };
    const brandLabels = {
      all: 'all brands',
      miele: 'Miele',
      hoover: 'Hoover',
      cyclovac: 'Cyclo Vac',
      beam: 'Beam',
      bosch: 'Bosch',
      dyson: 'Dyson',
      tristar: 'TriStar / Compact',
      filterqueen: 'Filter Queen',
      kirby: 'Kirby',
      kenmore: 'Kenmore',
      johnnyvac: 'Johnny Vac',
      husky: 'Husky',
      eureka: 'Eureka',
      sanitaire: 'Sanitaire',
      electrolux: 'Electrolux',
      sebo: 'SEBO'
    };
    const mieleLabels = {
      all: 'all Miele part types',
      belts: 'belts',
      wands: 'wands',
      hoses: 'hoses',
      'power-heads': 'power heads',
      'turbo-heads': 'turbo heads',
      batteries: 'batteries',
      brushes: 'brushes'
    };

    let text = `Showing ${items.length} result${items.length === 1 ? '' : 's'} for ${categoryLabels[categoryKey] || 'parts products'}`;
    if((categoryKey === 'bags' || categoryKey === 'filters') && brandKey !== 'all') {
      text += ` in ${brandLabels[brandKey] || brandKey}.`;
    } else if(categoryKey === 'miele-parts' && mieleTypeKey !== 'all') {
      text += ` in ${mieleLabels[mieleTypeKey] || mieleTypeKey}.`;
    } else {
      text += '.';
    }
    summaryEl.textContent = text;
  }

  function renderAccessoriesCatalogWithFilters(mount){
    const categoryChips = Array.from(document.querySelectorAll('[data-accessory-category]'));
    const brandWrap = document.querySelector('[data-accessory-brand-wrap]');
    const brandChips = Array.from(document.querySelectorAll('[data-accessory-brand]'));
    const mieleWrap = document.querySelector('[data-accessory-miele-wrap]');
    const mieleChips = Array.from(document.querySelectorAll('[data-accessory-miele]'));
    const resetBtn = document.querySelector('[data-accessory-reset]');
    const summaryEl = document.querySelector('[data-accessory-summary]');
    const emptyEl = document.querySelector('[data-accessory-empty]');
    const params = new URLSearchParams(location.search);
    const validCategories = new Set(['all','bags','filters','belts','motors','electrical-boards','miele-parts']);
    const validMieleTypes = new Set(['all','belts','wands','hoses','power-heads','turbo-heads','batteries','brushes']);
    const state = {
      category: validCategories.has(params.get('partCategory')) ? params.get('partCategory') : 'all',
      brand: params.get('bagBrand') || 'all',
      mieleType: validMieleTypes.has(params.get('mielePartType')) ? params.get('mielePartType') : 'all'
    };

    function shouldShowBrandFilter(){
      return state.category === 'bags' || state.category === 'filters';
    }

    function shouldShowMieleFilter(){
      return state.category === 'miele-parts';
    }

    function apply(){
      if(!shouldShowBrandFilter()) state.brand = 'all';
      if(!shouldShowMieleFilter()) state.mieleType = 'all';
      let items = getAccessoryProducts();
      if(state.category === 'miele-parts') {
        items = items.filter(p => String(p.brand || '').toLowerCase() === 'miele' && matchesMieleAccessoryType(p, state.mieleType));
      } else if(state.category !== 'all') {
        items = items.filter(p => matchesAccessoryCategory(p, state.category));
      }
      if(shouldShowBrandFilter() && state.brand !== 'all') items = items.filter(p => matchesAccessoryBrand(p, state.brand));
      renderProducts(items, mount);
      if(emptyEl) emptyEl.classList.toggle('hidden', items.length > 0);
      const showBrandFilter = shouldShowBrandFilter();
      const showMieleFilter = shouldShowMieleFilter();
      if(brandWrap) {
        brandWrap.classList.toggle('hidden', !showBrandFilter);
        brandWrap.setAttribute('aria-hidden', showBrandFilter ? 'false' : 'true');
      }
      if(mieleWrap) {
        mieleWrap.classList.toggle('hidden', !showMieleFilter);
        mieleWrap.setAttribute('aria-hidden', showMieleFilter ? 'false' : 'true');
      }
      brandChips.forEach(btn => {
        btn.disabled = !showBrandFilter;
      });
      mieleChips.forEach(btn => {
        btn.disabled = !showMieleFilter;
      });
      updateAccessorySummary(summaryEl, items, state.category, state.brand, state.mieleType);

      categoryChips.forEach(btn => {
        const active = btn.dataset.accessoryCategory === state.category;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      brandChips.forEach(btn => {
        const active = btn.dataset.accessoryBrand === state.brand;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      mieleChips.forEach(btn => {
        const active = btn.dataset.accessoryMiele === state.mieleType;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      const next = new URLSearchParams(location.search);
      if(state.category && state.category !== 'all') next.set('partCategory', state.category); else next.delete('partCategory');
      if(shouldShowBrandFilter() && state.brand && state.brand !== 'all') next.set('bagBrand', state.brand); else next.delete('bagBrand');
      if(shouldShowMieleFilter() && state.mieleType && state.mieleType !== 'all') next.set('mielePartType', state.mieleType); else next.delete('mielePartType');
      const query = next.toString();
      const nextUrl = `${location.pathname}${query ? `?${query}` : ''}${location.hash || '#bags-catalogue'}`;
      history.replaceState(null, '', nextUrl);
    }

    categoryChips.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
      btn.addEventListener('click', () => {
        state.category = btn.dataset.accessoryCategory || 'all';
        apply();
      });
    });
    brandChips.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
      btn.addEventListener('click', () => {
        state.brand = btn.dataset.accessoryBrand || 'all';
        apply();
      });
    });
    mieleChips.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
      btn.addEventListener('click', () => {
        state.mieleType = btn.dataset.accessoryMiele || 'all';
        apply();
      });
    });
    if(resetBtn) resetBtn.addEventListener('click', () => {
      state.category = 'all';
      state.brand = 'all';
      state.mieleType = 'all';
      apply();
    });
    apply();
  }

  document.querySelectorAll('[data-product-grid]').forEach(mount => {
    const type = mount.getAttribute('data-product-grid') || 'all';
    if(type === 'catalog') renderCatalogWithFilters(mount);
    else renderProducts(getProductsByType(type), mount);
  });

  document.querySelectorAll('[data-accessory-grid]').forEach(mount => {
    renderAccessoriesCatalogWithFilters(mount);
  });

  document.querySelectorAll('[data-central-attachment-grid]').forEach(mount => {
    renderCentralAttachmentCatalogWithFilters(mount);
  });

  document.querySelectorAll('[data-testimonials]').forEach(mount => {
    mount.innerHTML = (cfg.testimonials || []).map(item => `
      <article class="review-card">
        <div class="stars">★★★★★</div>
        <p>“${item.quote}”</p>
        <strong>${item.author}</strong>
      </article>
    `).join('');
  });

  const faqMount = document.querySelector('[data-faqs]');
  if(faqMount){
    faqMount.innerHTML = (cfg.faqs || []).map((item, idx) => `
      <article class="faq-item ${idx===0 ? 'open' : ''}">
        <button class="faq-q">${item.q}<span>+</span></button>
        <div class="faq-a"><p>${item.a}</p></div>
      </article>
    `).join('');
  }
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.faq-q');
    if(btn) btn.parentElement.classList.toggle('open');
  });

  document.querySelectorAll('form[data-mailto-form]').forEach(form => {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(form);
      const subject = fd.get('subject') || 'Website inquiry';
      const body = Array.from(fd.entries())
        .filter(([k]) => k !== 'subject')
        .map(([k,v]) => `${k}: ${v}`)
        .join('\n');
      window.location.href = `mailto:${rawEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });

  document.querySelectorAll('form[data-formsubmit-form]').forEach(form => {
    if(validFormEmail){
      form.setAttribute('action', `https://formsubmit.co/${rawEmail}`);
      form.setAttribute('method', 'POST');
      form.setAttribute('enctype', 'multipart/form-data');
      const nextInput = form.querySelector('input[name="_next"]');
      if(nextInput) nextInput.value = `${location.origin}${location.pathname.replace(/[^/]*$/, '')}thanks.html`;
    }
    form.addEventListener('submit', function(e){
      if(!validFormEmail){
        e.preventDefault();
        alert('Before the quote or contact form can send submissions, update the email address in site-config.js.');
      }
    });
  });

  document.querySelectorAll('input[type="file"]').forEach(input => {
    const output = input.closest('form')?.querySelector('[data-file-list]');
    input.addEventListener('change', () => {
      if(!output) return;
      const files = Array.from(input.files || []);
      output.textContent = files.length ? files.map(f => f.name).join(', ') : 'No files selected yet.';
    });
  });
})();
