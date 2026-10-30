/**
 * Capte Icon Explorer & Marketing Operations Engine
 * 
 * Google Fonts / Material Symbols style interactive catalog, inspect drawer,
 * URL deep-linking, and multi-format export suite (SVG, PNG @1x/@2x/@3x, raw code).
 * 
 * Single Source of Truth: john-l-hansen/capte-icons (60 icons, 720 templates)
 */

(function () {
  'use strict';

  // Constants & Enums
  const SIZES = [20, 24, 40, 48];
  const WEIGHTS = ['thin', 'medium', 'heavy'];
  const GRADES = ['dark-theme', 'normal', 'emphasis'];
  const STYLES = ['outline', 'filled', 'duotone'];
  const THEMES = ['light', 'dark'];

  const GRADE_LABELS = {
    'dark-theme': 'Dark Theme',
    'normal': 'Normal',
    'emphasis': 'Emphasis'
  };

  const WEIGHT_LABELS = {
    'thin': 'Thin',
    'medium': 'Medium',
    'heavy': 'Heavy'
  };

  const STYLE_LABELS = {
    'outline': 'Outline',
    'filled': 'Filled',
    'duotone': 'Duotone'
  };

  const BRAND_COLORS = [
    { label: 'Default Palette', value: 'palette' },
    { label: 'Primary Blue', value: '#001384' },
    { label: 'Accent Blue', value: '#093AEC' },
    { label: 'Accent Orange', value: '#FC5522' },
    { label: 'Dark Body', value: '#111523' },
    { label: 'Slate Muted', value: '#626A7A' },
    { label: 'Pure White', value: '#FFFFFF' },
    { label: 'CSS CurrentColor', value: 'currentColor' }
  ];

  // State
  let catalog = null;
  let activeState = {
    iconId: 'search',
    size: 24,
    weight: 'medium',
    grade: 'normal',
    style: 'duotone',
    theme: 'light',
    colorMode: 'palette',
    customHex: '#001384',
    pngScale: 2,
    codeFormat: 'svg' // 'svg' or 'webflow'
  };

  let searchQuery = '';
  let activeCategory = 'all';
  let canvasBg = 'light'; // 'light', 'white', 'dark', 'navy'
  let drawerOpen = false;

  // DOM Elements cache
  const el = {};

  // Utility helpers
  const escapeXml = (str) => String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  }[c] || c));

  const num = (n) => Number(Number(n).toFixed(6));

  const colorHex = (color) => {
    if (!color || typeof color !== 'object') return '#000000';
    const r = Math.round((color.r ?? 0) * 255).toString(16).padStart(2, '0');
    const g = Math.round((color.g ?? 0) * 255).toString(16).padStart(2, '0');
    const b = Math.round((color.b ?? 0) * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  function strokeWidth(options, detail = false) {
    const key = `icon/stroke/${options.size}/${options.weight}${detail ? '/detail' : ''}`;
    const gradeName = { 'dark-theme': 'Dark theme', normal: 'Normal', emphasis: 'Emphasis' }[options.grade] || 'Normal';
    const val = catalog?.profiles?.[key]?.[gradeName];
    return typeof val === 'number' && Number.isFinite(val) ? val : 2;
  }

  /**
   * Render pure SVG string from catalog definitions
   */
  function renderSvg(options, colorOverride = null) {
    if (!catalog) return '';
    const icon = catalog.icons.find(i => i.id === options.iconId);
    if (!icon) return '';

    const template = icon.templates.find(t => t.size === options.size && t.style === options.style);
    if (!template) return '';

    const palette = catalog.palettes?.[options.theme] || catalog.palettes?.light || {};

    const resolvePaint = (p) => {
      if (p === null) return 'none';

      // Custom color override
      if (colorOverride && colorOverride !== 'palette') {
        if (typeof p === 'string') {
          if (p === 'stroke' || p === 'signal') return colorOverride;
          if (p === 'fill' || p === 'container') {
            if (options.style === 'duotone') {
              // Soft tint for duotone container
              return colorOverride === 'currentColor' ? 'currentColor' : colorOverride;
            }
            return colorOverride;
          }
          if (p === 'surface') {
            if (typeof colorOverride === 'string' && colorOverride.toLowerCase() === '#ffffff') {
              return '#001384'; // Match Primary Blue tile background for surface cutouts
            }
            return options.theme === 'dark' ? '#111523' : '#FFFFFF';
          }
        }
        return colorOverride;
      }

      // Default catalog palette
      if (typeof p === 'string') {
        const rgb = palette[p];
        return rgb ? colorHex(rgb) : '#000000';
      }
      return colorHex(p);
    };

    const shapes = template.parts.map(part => {
      const t = part.transform || [[1, 0, 0], [0, 1, 0]];
      const matrix = [t[0][0], t[1][0], t[0][1], t[1][1], t[0][2], t[1][2]].map(num).join(' ');
      const strokeVal = resolvePaint(part.stroke);
      const fillVal = resolvePaint(part.fill);
      const sw = num(strokeWidth(options, part.detail));
      const cap = part.cap === 'ROUND' ? 'round' : part.cap === 'SQUARE' ? 'square' : 'butt';
      const join = (part.join || 'round').toLowerCase();
      const dash = Array.isArray(part.dash) && part.dash.length ? ` stroke-dasharray="${part.dash.map(num).join(' ')}"` : '';
      
      // Duotone fill opacity handling if using custom color
      let opacity = part.opacity ?? 1;
      if (colorOverride && colorOverride !== 'palette' && options.style === 'duotone' && (part.fill === 'fill' || part.fill === 'container')) {
        opacity = Math.min(opacity, 0.28);
      }

      const attrs = `transform="matrix(${matrix})" fill="${fillVal}" stroke="${strokeVal}" stroke-width="${sw}" stroke-linecap="${cap}" stroke-linejoin="${join}" opacity="${opacity}"${dash}`;

      if (part.type === 'ELLIPSE') {
        const rx = num(part.width / 2);
        const ry = num(part.height / 2);
        return `<ellipse data-part="${escapeXml(part.name)}" cx="${rx}" cy="${ry}" rx="${rx}" ry="${ry}" ${attrs}/>`;
      }

      return (part.paths || []).map(path =>
        `<path data-part="${escapeXml(part.name)}" d="${escapeXml(path.data)}" fill-rule="${path.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}" ${attrs}/>`
      ).join('');
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${options.size}" height="${options.size}" viewBox="0 0 ${options.size} ${options.size}" fill="none" class="capte-icon" data-icon="${escapeXml(options.iconId)}">${shapes}</svg>`;
  }

  /**
   * HTML / Webflow Embed Snippet Generator
   */
  function generateCodeSnippet(options, format, colorVal) {
    const rawSvg = renderSvg(options, colorVal);
    if (format === 'svg') {
      return rawSvg;
    }
    // Webflow Client-First semantic wrapper
    return `<!-- Capte Icon: ${options.iconId} (${options.size}dp / ${options.style} / ${options.weight}) -->\n<div class="capte-icon-embed is-${options.size}dp" aria-hidden="true">\n  ${rawSvg}\n</div>`;
  }

  /**
   * In-memory High-DPI PNG Rasterizer
   */
  function exportPngBlob(svgString, size, scale = 2) {
    return new Promise((resolve, reject) => {
      const pixelSize = size * scale;
      const canvas = document.createElement('canvas');
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        ctx.clearRect(0, 0, pixelSize, pixelSize);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas rasterization failed'));
        }, 'image/png');
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    });
  }

  /**
   * Trigger direct browser download
   */
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /**
   * Toast notification system
   */
  function showToast(message, isError = false) {
    const toast = el.toast;
    toast.textContent = message;
    toast.className = `toast visible ${isError ? 'error' : ''}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.className = 'toast';
    }, 2800);
  }

  /**
   * Parse & apply URL query parameters
   */
  function parseUrlState() {
    const params = new URLSearchParams(window.location.search);
    let changed = false;

    if (params.has('icon')) {
      activeState.iconId = params.get('icon');
      changed = true;
    }
    if (params.has('size')) {
      const s = parseInt(params.get('size'), 10);
      if (SIZES.includes(s)) activeState.size = s;
    }
    if (params.has('weight') && WEIGHTS.includes(params.get('weight'))) {
      activeState.weight = params.get('weight');
    }
    if (params.has('grade') && GRADES.includes(params.get('grade'))) {
      activeState.grade = params.get('grade');
    }
    if (params.has('style') && STYLES.includes(params.get('style'))) {
      activeState.style = params.get('style');
    }
    if (params.has('theme') && THEMES.includes(params.get('theme'))) {
      activeState.theme = params.get('theme');
    }
    if (params.has('color')) {
      const c = params.get('color');
      if (c === 'palette' || c === 'currentColor' || c.startsWith('#')) {
        activeState.colorMode = c;
        if (c.startsWith('#')) activeState.customHex = c;
      }
    }
    if (params.has('category')) {
      activeCategory = params.get('category');
    }
    if (params.has('search')) {
      searchQuery = params.get('search');
    }
    if (params.has('bg')) {
      canvasBg = params.get('bg');
    }

    if (params.has('drawer')) {
      drawerOpen = params.get('drawer') === '1' || params.get('drawer') === 'true';
    } else if (params.has('icon')) {
      drawerOpen = true; // Auto-open drawer if an icon is directly targeted
    }

    return changed;
  }

  /**
   * Sync active state to URL query params
   */
  function syncUrlState() {
    const params = new URLSearchParams();
    params.set('icon', activeState.iconId);
    params.set('size', String(activeState.size));
    params.set('weight', activeState.weight);
    params.set('grade', activeState.grade);
    params.set('style', activeState.style);
    params.set('theme', activeState.theme);

    if (activeState.colorMode !== 'palette') {
      params.set('color', activeState.colorMode);
    }
    if (activeCategory !== 'all') {
      params.set('category', activeCategory);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (canvasBg !== 'light') {
      params.set('bg', canvasBg);
    }
    if (drawerOpen) {
      params.set('drawer', '1');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }

  /**
   * Get active color string value
   */
  function getActiveColorValue() {
    if (activeState.colorMode === 'palette') return 'palette';
    if (activeState.colorMode === 'custom') return activeState.customHex;
    return activeState.colorMode;
  }

  function isWhitePresetActive() {
    const val = getActiveColorValue();
    return typeof val === 'string' && val.toLowerCase() === '#ffffff';
  }

  /**
   * Render the icon grid
   */
  function renderGrid() {
    if (!catalog) return;
    const query = searchQuery.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);

    const matches = catalog.icons.filter(icon => {
      const categoryMatch = activeCategory === 'all' || icon.category.toLowerCase() === activeCategory.toLowerCase();
      if (!categoryMatch) return false;
      if (!terms.length) return true;

      const haystack = [icon.name, icon.id, icon.category, ...(icon.tags || [])].join(' ').toLowerCase();
      return terms.every(t => haystack.includes(t));
    });

    el.iconCountBadge.textContent = `${matches.length} ${matches.length === 1 ? 'icon' : 'icons'}`;
    el.iconGrid.innerHTML = '';

    const isWhite = isWhitePresetActive();
    document.documentElement.dataset.whitePreset = isWhite ? 'true' : 'false';

    if (!matches.length) {
      el.emptyState.hidden = false;
      return;
    }
    el.emptyState.hidden = true;

    const frag = document.createDocumentFragment();
    const currentColorVal = getActiveColorValue();

    matches.forEach(icon => {
      const isSelected = icon.id === activeState.iconId;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `icon-card ${isSelected ? 'is-selected' : ''} ${isWhite ? 'is-white-preset' : ''}`;
      card.dataset.id = icon.id;
      card.setAttribute('aria-pressed', String(isSelected));
      card.setAttribute('aria-label', `${icon.name} (${icon.category})`);

      // Icon preview container
      const preview = document.createElement('div');
      preview.className = 'icon-card-preview';
      
      // Render svg for grid item
      const itemOptions = {
        iconId: icon.id,
        size: activeState.size,
        weight: activeState.weight,
        grade: activeState.grade,
        style: activeState.style,
        theme: activeState.theme
      };
      preview.innerHTML = renderSvg(itemOptions, currentColorVal);

      // Icon label
      const name = document.createElement('span');
      name.className = 'icon-card-name';
      name.textContent = icon.name;

      card.appendChild(preview);
      card.appendChild(name);

      card.addEventListener('click', () => {
        selectIcon(icon.id);
      });

      frag.appendChild(card);
    });

    el.iconGrid.appendChild(frag);
  }

  /**
   * Select icon and update drawer
   */
  function selectIcon(id) {
    activeState.iconId = id;
    drawerOpen = true;
    updateSelectionHighlight();
    renderDrawer();
    syncUrlState();
  }

  /**
   * Update card highlight without re-rendering entire grid
   */
  function updateSelectionHighlight() {
    const isWhite = isWhitePresetActive();
    document.documentElement.dataset.whitePreset = isWhite ? 'true' : 'false';
    const cards = el.iconGrid.querySelectorAll('.icon-card');
    cards.forEach(c => {
      const isSelected = c.dataset.id === activeState.iconId;
      c.classList.toggle('is-selected', isSelected);
      c.classList.toggle('is-white-preset', isWhite);
      c.setAttribute('aria-pressed', String(isSelected));
    });
  }

  /**
   * Render drawer contents and update preview
   */
  function renderDrawer() {
    if (!catalog) return;
    const icon = catalog.icons.find(i => i.id === activeState.iconId) || catalog.icons[0];
    if (!icon) return;

    el.drawer.classList.toggle('is-open', drawerOpen);
    el.drawerBackdrop.classList.toggle('is-open', drawerOpen);
    document.body.classList.toggle('drawer-open', drawerOpen);

    const isWhite = isWhitePresetActive();
    document.documentElement.dataset.whitePreset = isWhite ? 'true' : 'false';
    const heroBox = el.drawerHeroPreview?.closest('.hero-preview-box');
    if (heroBox) {
      heroBox.classList.toggle('is-white-preset', isWhite);
    }

    if (!drawerOpen) return;

    // Header info
    el.drawerIconName.textContent = icon.name;
    el.drawerCategoryBadge.textContent = icon.category;
    el.drawerIdBadge.textContent = icon.id;

    // Large Hero Preview
    const currentColorVal = getActiveColorValue();
    const heroOptions = {
      iconId: icon.id,
      size: activeState.size,
      weight: activeState.weight,
      grade: activeState.grade,
      style: activeState.style,
      theme: activeState.theme
    };

    // Render 1:1 SVG into hero
    el.drawerHeroPreview.innerHTML = renderSvg(heroOptions, currentColorVal);
    el.drawerHeroDims.textContent = `${activeState.size} × ${activeState.size} px (1:1)`;

    // Update Segmented Button States
    updateSegmentButtons(el.sizeSegments, String(activeState.size));
    updateSegmentButtons(el.weightSegments, activeState.weight);
    updateSegmentButtons(el.gradeSegments, activeState.grade);
    updateSegmentButtons(el.styleSegments, activeState.style);
    updateSegmentButtons(el.themeSegments, activeState.theme);

    // Update Color Swatch selection
    updateColorSwatches();

    // Update Code Snippet
    updateCodeSnippet();
  }

  function updateSegmentButtons(container, activeVal) {
    if (!container) return;
    const buttons = container.querySelectorAll('.seg-btn');
    buttons.forEach(btn => {
      const isActive = btn.dataset.value === activeVal;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function updateColorSwatches() {
    const swatches = el.colorSwatches.querySelectorAll('.swatch-btn');
    swatches.forEach(btn => {
      const isCustom = btn.dataset.custom === 'true';
      let isActive = false;
      if (isCustom) {
        isActive = activeState.colorMode === 'custom' || activeState.colorMode === activeState.customHex;
      } else {
        isActive = btn.dataset.value === activeState.colorMode;
      }
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    if (el.customColorInput) {
      el.customColorInput.value = activeState.customHex;
    }
  }

  function updateCodeSnippet() {
    const currentColorVal = getActiveColorValue();
    const code = generateCodeSnippet(activeState, activeState.codeFormat, currentColorVal);
    el.codeOutput.textContent = code;
  }

  /**
   * Bind event listeners
   */
  function bindEvents() {
    // Search input
    el.searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      el.searchClear.hidden = !searchQuery;
      renderGrid();
      syncUrlState();
    });

    el.searchClear.addEventListener('click', () => {
      el.searchInput.value = '';
      searchQuery = '';
      el.searchClear.hidden = true;
      el.searchInput.focus();
      renderGrid();
      syncUrlState();
    });

    // Keyboard shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== el.searchInput) {
        e.preventDefault();
        el.searchInput.focus();
      } else if (e.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    });

    // Category filter pills
    el.categoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-chip');
      if (!btn) return;
      el.categoryFilters.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderGrid();
      syncUrlState();
    });

    // Canvas Background toggles
    el.canvasBgToggles.addEventListener('click', (e) => {
      const btn = e.target.closest('.bg-toggle-btn');
      if (!btn) return;
      el.canvasBgToggles.querySelectorAll('.bg-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      canvasBg = btn.dataset.bg;
      document.documentElement.dataset.canvasBg = canvasBg;
      syncUrlState();
    });

    // Drawer close buttons
    el.drawerClose.addEventListener('click', closeDrawer);
    el.drawerBackdrop.addEventListener('click', closeDrawer);

    // Segmented button delegations
    setupSegmentGroup(el.sizeSegments, (val) => {
      activeState.size = parseInt(val, 10);
      renderDrawer();
      renderGrid();
      syncUrlState();
    });

    setupSegmentGroup(el.weightSegments, (val) => {
      activeState.weight = val;
      renderDrawer();
      renderGrid();
      syncUrlState();
    });

    setupSegmentGroup(el.gradeSegments, (val) => {
      activeState.grade = val;
      renderDrawer();
      renderGrid();
      syncUrlState();
    });

    setupSegmentGroup(el.styleSegments, (val) => {
      activeState.style = val;
      renderDrawer();
      renderGrid();
      syncUrlState();
    });

    setupSegmentGroup(el.themeSegments, (val) => {
      activeState.theme = val;
      renderDrawer();
      renderGrid();
      syncUrlState();
    });

    // Color swatch clicks
    el.colorSwatches.addEventListener('click', (e) => {
      const btn = e.target.closest('.swatch-btn');
      if (!btn) return;
      const isCustom = btn.dataset.custom === 'true';
      if (isCustom) {
        activeState.colorMode = 'custom';
        el.customColorInput.click();
      } else {
        activeState.colorMode = btn.dataset.value;
      }
      renderDrawer();
      renderGrid();
      syncUrlState();
    });

    el.customColorInput.addEventListener('input', (e) => {
      activeState.customHex = e.target.value;
      activeState.colorMode = e.target.value;
      renderDrawer();
      renderGrid();
      syncUrlState();
    });

    // Export: Download SVG
    el.btnDownloadSvg.addEventListener('click', () => {
      const currentColorVal = getActiveColorValue();
      const svg = renderSvg(activeState, currentColorVal);
      const filename = `capte-${activeState.iconId}-${activeState.size}dp-${activeState.style}-${activeState.weight}.svg`;
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      downloadBlob(blob, filename);
      showToast(`Downloaded ${filename}`);
    });

    // Export: Copy SVG
    el.btnCopySvg.addEventListener('click', async () => {
      const currentColorVal = getActiveColorValue();
      const svg = renderSvg(activeState, currentColorVal);
      try {
        await navigator.clipboard.writeText(svg);
        showToast('SVG code copied to clipboard!');
      } catch (err) {
        showToast('Could not access clipboard', true);
      }
    });

    // Export: Download PNG
    el.btnDownloadPng.addEventListener('click', async () => {
      const currentColorVal = getActiveColorValue();
      const svg = renderSvg(activeState, currentColorVal);
      const scale = activeState.pngScale;
      const filename = `capte-${activeState.iconId}-${activeState.size}dp-${activeState.style}-@${scale}x.png`;
      try {
        const blob = await exportPngBlob(svg, activeState.size, scale);
        downloadBlob(blob, filename);
        showToast(`Downloaded PNG (${activeState.size * scale}×${activeState.size * scale}px)`);
      } catch (err) {
        showToast('PNG rasterization failed', true);
      }
    });

    // PNG Scale selector
    el.pngScaleSelect.addEventListener('change', (e) => {
      activeState.pngScale = parseInt(e.target.value, 10);
    });

    // Code Format toggle (SVG vs Webflow)
    el.codeFormatTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.code-tab-btn');
      if (!btn) return;
      el.codeFormatTabs.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeState.codeFormat = btn.dataset.format;
      updateCodeSnippet();
    });

    // Copy Code button
    el.btnCopyCode.addEventListener('click', async () => {
      const code = el.codeOutput.textContent;
      try {
        await navigator.clipboard.writeText(code);
        showToast('Code snippet copied to clipboard!');
      } catch (err) {
        showToast('Could not access clipboard', true);
      }
    });

    // Copy Share Link button
    el.btnShareLink.addEventListener('click', async () => {
      syncUrlState();
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Direct link copied to clipboard!');
      } catch (err) {
        showToast('Could not access clipboard', true);
      }
    });

    // Popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      parseUrlState();
      renderGrid();
      renderDrawer();
    });
  }

  function setupSegmentGroup(container, onSelect) {
    if (!container) return;
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      container.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onSelect(btn.dataset.value);
    });
  }

  function closeDrawer() {
    drawerOpen = false;
    el.drawer.classList.remove('is-open');
    el.drawerBackdrop.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    syncUrlState();
  }

  /**
   * Cache DOM elements
   */
  function cacheElements() {
    el.searchInput = document.getElementById('search-input');
    el.searchClear = document.getElementById('search-clear');
    el.iconCountBadge = document.getElementById('icon-count');
    el.categoryFilters = document.getElementById('category-filters');
    el.canvasBgToggles = document.getElementById('canvas-bg-toggles');
    el.iconGrid = document.getElementById('icon-grid');
    el.emptyState = document.getElementById('empty-state');
    
    // Drawer
    el.drawer = document.getElementById('inspect-drawer');
    el.drawerBackdrop = document.getElementById('drawer-backdrop');
    el.drawerClose = document.getElementById('drawer-close');
    el.drawerIconName = document.getElementById('drawer-icon-name');
    el.drawerCategoryBadge = document.getElementById('drawer-category-badge');
    el.drawerIdBadge = document.getElementById('drawer-id-badge');
    el.drawerHeroPreview = document.getElementById('drawer-hero-preview');
    el.drawerHeroDims = document.getElementById('drawer-hero-dims');

    // Controls
    el.sizeSegments = document.getElementById('size-segments');
    el.weightSegments = document.getElementById('weight-segments');
    el.gradeSegments = document.getElementById('grade-segments');
    el.styleSegments = document.getElementById('style-segments');
    el.themeSegments = document.getElementById('theme-segments');
    el.colorSwatches = document.getElementById('color-swatches');
    el.customColorInput = document.getElementById('custom-color-input');

    // Actions & Outputs
    el.btnDownloadSvg = document.getElementById('btn-download-svg');
    el.btnCopySvg = document.getElementById('btn-copy-svg');
    el.btnDownloadPng = document.getElementById('btn-download-png');
    el.pngScaleSelect = document.getElementById('png-scale-select');
    el.codeFormatTabs = document.getElementById('code-format-tabs');
    el.codeOutput = document.getElementById('code-output');
    el.btnCopyCode = document.getElementById('btn-copy-code');
    el.btnShareLink = document.getElementById('btn-share-link');
    el.toast = document.getElementById('toast');
  }

  /**
   * Initialize App
   */
  async function init() {
    cacheElements();
    bindEvents();

    try {
      // Load minified catalog.json from same directory
      const response = await fetch('./catalog.json');
      if (!response.ok) throw new Error(`HTTP ${response.status} loading catalog.json`);
      catalog = await response.json();

      parseUrlState();

      // Apply initial canvas background
      document.documentElement.dataset.canvasBg = canvasBg;
      const activeBgBtn = el.canvasBgToggles.querySelector(`[data-bg="${canvasBg}"]`);
      if (activeBgBtn) {
        el.canvasBgToggles.querySelectorAll('.bg-toggle-btn').forEach(b => b.classList.remove('active'));
        activeBgBtn.classList.add('active');
      }

      // Populate Category Filter Chips dynamically
      const categories = ['all', ...new Set(catalog.icons.map(i => i.category))];
      el.categoryFilters.innerHTML = categories.map(cat => {
        const isActive = cat.toLowerCase() === activeCategory.toLowerCase();
        return `<button type="button" class="cat-chip ${isActive ? 'active' : ''}" data-category="${cat}">${cat === 'all' ? 'All Icons' : cat}</button>`;
      }).join('');

      renderGrid();
      if (drawerOpen) {
        renderDrawer();
      }
    } catch (err) {
      console.error('Failed to initialize Capte Icon Explorer:', err);
      el.iconGrid.innerHTML = `
        <div class="load-error">
          <h3>Failed to load icon catalog</h3>
          <p>${escapeXml(err.message)}</p>
          <button type="button" onclick="location.reload()" class="btn-card-primary" style="margin-top:12px;">Retry</button>
        </div>
      `;
    }
  }

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
