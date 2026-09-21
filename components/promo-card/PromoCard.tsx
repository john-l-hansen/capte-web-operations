import React, { useEffect, useState } from 'react';
import styles from './PromoCard.module.css';

export interface PromoCardProps {
  campaignId: string;
  countries: string;
  startISO: string;
  endISO: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  ctaLabel: string;
  ctaLink?: { type: string; url: string };
  showMedia?: boolean;
  mediaImage?: { src: string; alt?: string };
}

export const PromoCard: React.FC<PromoCardProps> = ({
  campaignId = 'apta-2026-transform-expo',
  countries = 'US, CA',
  startISO = '2026-09-21T05:00:00Z',
  endISO = '2026-10-09T04:59:59Z',
  eyebrow = 'Live Event',
  heading = 'Join Capte at APTA Expo 2026',
  description = 'Connect with our team October 5-7, 2026 to see advanced transit positioning & IoT in action.',
  ctaLabel = 'Request a meeting',
  ctaLink = { type: 'url', url: '/events/apta-expo-2026' },
  showMedia = false,
  mediaImage,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const debug = params.get('promoDebug') === '1';
    const countryOverride = params.get('promoCountry');

    if (debug) {
      setIsVisible(true);
      return;
    }

    const now = Date.now();
    const start = Date.parse(startISO);
    const end = Date.parse(endISO);
    if (!isNaN(start) && !isNaN(end) && (now < start || now > end)) {
      return;
    }

    const storageKey = `capte:promo:${campaignId}`;
    try {
      if (sessionStorage.getItem(storageKey) === '1') {
        setIsDismissed(true);
        return;
      }
    } catch (e) {
      // Ignore private storage restrictions
    }

    const allowed = countries
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    const checkCountry = async () => {
      let code: string | null = null;
      if (countryOverride) {
        code = countryOverride.toUpperCase();
      } else {
        try {
          const res = await fetch('/cdn-cgi/trace');
          if (res.ok) {
            const text = await res.text();
            const match = /loc=([A-Z]{2})/.exec(text);
            code = match ? match[1] : null;
          }
        } catch (e) {
          code = null;
        }
      }

      if (code && allowed.includes(code)) {
        setIsVisible(true);
      }
    };

    checkCountry();
  }, [campaignId, countries, startISO, endISO]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(`capte:promo:${campaignId}`, '1');
    } catch (e) {
      // Ignore
    }
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div
      className={`${styles.promoCard} ${isVisible ? styles.isVisible : ''}`}
      role="region"
      aria-label={heading || 'Promotion'}
    >
      <button
        type="button"
        className={styles.closeBtn}
        onClick={handleDismiss}
        aria-label="Dismiss promotion"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {showMedia && mediaImage?.src && (
        <div className={styles.mediaSlot}>
          <img
            className={styles.mediaImage}
            src={mediaImage.src}
            alt={mediaImage.alt || ''}
            width="64"
            height="64"
            loading="lazy"
          />
        </div>
      )}

      <div className={styles.body}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        {heading && <h4 className={styles.heading}>{heading}</h4>}
        {description && <p className={styles.description}>{description}</p>}
        <a className={styles.cta} href={ctaLink?.url || '#'}>
          <span>{ctaLabel}</span>
          <svg className={styles.ctaIcon} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PromoCard;
