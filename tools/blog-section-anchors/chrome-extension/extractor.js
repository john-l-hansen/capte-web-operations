/**
 * Capte Blog Section-Anchor Link Extractor & Shortener (v1.2.1)
 * 
 * Extracts heading anchors (H2, H3) from published Capte blog posts and
 * automatically generates compact, branded shortened links for each section.
 * 
 * Includes:
 * - High-speed parallel shortening (TinyURL Pro or zero-config fallback)
 * - Bulletproof clipboard copy with automatic in-page modal HUD
 * - Drag vs Click detection on installation pages
 * 
 * Repository: https://github.com/john-l-hansen/capte-web-operations
 */

(async function extractAndShortenBlogSectionAnchors() {
  // If accidentally clicked on the installation page itself:
  if (location.pathname.endsWith('bookmarklet.html')) {
    alert("👉 Drag this button up into your browser's Bookmarks Bar to install it!\n\nOnce installed in your bookmarks bar, visit any published blog post on capte.co/blog and click it there.");
    return;
  }

  const base = location.origin + location.pathname;
  
  // Query H2 and H3 headings inside article scope if available, or fall back to document body
  const articleScope = document.querySelector('article, .blog-post, .w-richtext, main') || document.body;
  const headings = [...articleScope.querySelectorAll('h2, h3')];

  if (headings.length === 0) {
    const msg = '⚠️ No H2 or H3 headings found on this page.\n\nMake sure you are viewing a published blog post on capte.co/blog.';
    console.warn(msg);
    if (typeof alert === 'function') alert(msg);
    return;
  }

  // Helper to generate clean slug ID if h.id is missing
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Filter valid headings
  const items = headings.map(h => {
    const text = (h.textContent || '').trim().replace(/\s+/g, ' ');
    const id = h.id ? h.id.trim() : slugify(text);
    return { text, id };
  });

  const validCount = items.filter(item => item.id).length;

  // Retrieve configuration from localStorage or global window scope
  const tinyUrlToken = (typeof localStorage !== 'undefined' && localStorage.getItem('capte_tinyurl_token')) ||
                       (typeof window !== 'undefined' && window.CAPTE_TINYURL_TOKEN);
  const tinyUrlDomain = (typeof localStorage !== 'undefined' && localStorage.getItem('capte_tinyurl_domain')) ||
                        (typeof window !== 'undefined' && window.CAPTE_TINYURL_DOMAIN) ||
                        'tinyurl.com';

  const engineLabel = tinyUrlToken 
    ? (tinyUrlDomain !== 'tinyurl.com' ? `TinyURL (${tinyUrlDomain})` : 'TinyURL')
    : 'Default Zero-Config Engine';

  showToast(`⏳ Shortening ${validCount} section links via ${engineLabel}...`, 10000);

  /**
   * Shorten a deep-link URL preserving the #fragment anchor
   */
  async function shorten(targetUrl) {
    try {
      // 1. TinyURL API (Token configured -> uses custom domain if set)
      if (tinyUrlToken) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        const res = await fetch('https://api.tinyurl.com/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tinyUrlToken}`
          },
          body: JSON.stringify({
            url: targetUrl,
            domain: tinyUrlDomain
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data?.data?.tiny_url) return data.data.tiny_url;
        }
      }

      // 2. Default Zero-Config Engine: is.gd JSON API (CORS enabled, fragment preservation)
      const encoded = encodeURIComponent(targetUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`https://is.gd/create.php?format=json&url=${encoded}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.shorturl) return data.shorturl;
      }
    } catch (err) {
      console.warn('Shortening request failed for ' + targetUrl + ', falling back to raw anchor:', err);
    }

    // 3. Fail-Safe Fallback: Return raw anchor link if network/API fails
    return targetUrl;
  }

  // Count duplicate IDs
  const idCounts = {};
  items.forEach(item => {
    if (item.id) idCounts[item.id] = (idCounts[item.id] || 0) + 1;
  });

  // Shorten all section anchors in parallel
  const shortenedUrls = await Promise.all(
    items.map(item => item.id ? shorten(`${base}#${item.id}`) : Promise.resolve(null))
  );

  const lines = [];
  items.forEach((item, idx) => {
    if (!item.id) {
      lines.push(`⚠️ NO ID: ${item.text} — (no id assigned)`);
      return;
    }

    const prefix = idCounts[item.id] > 1 ? '⚠️ DUPLICATE: ' : '';
    const url = shortenedUrls[idx] || `${base}#${item.id}`;
    lines.push(`${prefix}${item.text} — ${url}`);
  });

  const fullOutput = lines.join('\n');
  console.log('--- Capte Blog Section Shortlinks ---\n' + fullOutput);

  // Attempt async clipboard copy
  let copied = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(fullOutput);
      copied = true;
    }
  } catch (e) {
    copied = false;
  }

  // Fallback copy using hidden textarea
  if (!copied) {
    try {
      const ta = document.createElement('textarea');
      ta.value = fullOutput;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      copied = document.execCommand('copy');
      ta.remove();
    } catch (e) {
      copied = false;
    }
  }

  if (copied) {
    showToast(`✅ Copied ${validCount} shortened links to clipboard!`, 4000);
  } else {
    // Show in-page modal HUD if browser strictly blocks clipboard API
    showModal(fullOutput, validCount);
  }

  /**
   * Non-intrusive HUD toast notification for bookmarklet users
   */
  function showToast(message, duration = 3500) {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('capte-anchor-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'capte-anchor-toast';
    toast.setAttribute('style', `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background-color: #001384;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0, 19, 132, 0.25);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(8px);
      pointer-events: none;
    `);
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Modal HUD fallback if clipboard is blocked by browser policy
   */
  function showModal(content, count) {
    const existing = document.getElementById('capte-anchor-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'capte-anchor-modal';
    modal.setAttribute('style', `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(17, 21, 35, 0.7);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `);

    modal.innerHTML = `
      <div style="background:#fff; border-radius:12px; width:100%; max-width:640px; padding:24px; box-shadow:0 8px 32px rgba(0,0,0,0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="margin:0; font-size:17px; color:#001384; font-weight:700;">✅ Generated ${count} Section Shortlinks</h3>
          <button id="close-capte-modal" style="background:none; border:none; font-size:20px; cursor:pointer; color:#626A7A;">✕</button>
        </div>
        <textarea id="capte-modal-text" readonly style="width:100%; height:200px; padding:12px; font-family:monospace; font-size:12px; border:1px solid #DDE2EE; border-radius:6px; background:#F2F4FC; color:#111523; resize:vertical; box-sizing:border-box;">${content}</textarea>
        <div style="margin-top:14px; display:flex; justify-content:flex-end; gap:8px;">
          <button id="capte-copy-btn" style="background:#FC5522; color:#fff; border:none; padding:10px 18px; border-radius:4px; font-size:13px; font-weight:600; cursor:pointer;">📋 Copy All to Clipboard</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-capte-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    document.getElementById('capte-copy-btn').addEventListener('click', () => {
      const ta = document.getElementById('capte-modal-text');
      ta.select();
      navigator.clipboard.writeText(ta.value).then(() => {
        document.getElementById('capte-copy-btn').textContent = '✅ Copied!';
        setTimeout(() => modal.remove(), 800);
      });
    });
  }
})();
