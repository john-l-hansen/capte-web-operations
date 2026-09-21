import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { PromoCard } from './PromoCard';

export default declareComponent(PromoCard, {
  name: 'Promo Card',
  description: 'Region-gated promotional card for campaigns, live events, and product announcements with Cloudflare IP detection.',
  group: 'Promotions & Overlays',
  props: {
    // 1. Campaign Identity & Geo-gating
    campaignId: props.Text({
      name: 'Campaign ID',
      tooltip: 'Unique identifier for dismissal memory in sessionStorage',
      defaultValue: 'apta-2026-transform-expo',
    }),
    countries: props.Text({
      name: 'Eligible Countries (ISO-2)',
      tooltip: 'Comma-separated ISO country codes (e.g. US, CA, GB)',
      defaultValue: 'US, CA',
    }),
    startISO: props.Text({
      name: 'Start Date (UTC ISO)',
      tooltip: 'Campaign start timestamp in UTC (e.g. 2026-09-21T05:00:00Z)',
      defaultValue: '2026-09-21T05:00:00Z',
    }),
    endISO: props.Text({
      name: 'End Date (UTC ISO)',
      tooltip: 'Campaign end timestamp in UTC (e.g. 2026-10-09T04:59:59Z)',
      defaultValue: '2026-10-09T04:59:59Z',
    }),

    // 2. Content & Copy
    eyebrow: props.Text({
      name: 'Eyebrow Tag',
      defaultValue: 'Live Event',
    }),
    heading: props.Text({
      name: 'Card Heading',
      defaultValue: 'Join Capte at APTA Expo 2026',
    }),
    description: props.Text({
      name: 'Description Copy',
      defaultValue: 'Connect with our team October 5-7, 2026 to see advanced transit positioning & IoT in action.',
    }),

    // 3. Action / CTA
    ctaLabel: props.Text({
      name: 'CTA Button Text',
      defaultValue: 'Request a meeting',
    }),
    ctaLink: props.Link({
      name: 'CTA Destination Link',
      tooltip: 'Link target for the primary action button',
    }),

    // 4. Media Options
    showMedia: props.Boolean({
      name: 'Show Thumbnail Image',
      defaultValue: false,
    }),
    mediaImage: props.Image({
      name: 'Thumbnail Asset',
    }),
  },
});
