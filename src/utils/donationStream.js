import { isCampaignVisible } from '@/utils/campaignVisibility';

// Destination comes only from the donation's own slug, never from a list or carousel index.
export const getCampaignHref = (donation) => {
  const slug = typeof donation?.campaignSlug === 'string' ? donation.campaignSlug.trim() : '';
  if (!slug || slug.includes('/') || !isCampaignVisible({ slug })) return null;
  return `/campaign/${encodeURIComponent(slug)}`;
};

const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['min', 60],
];

export const timeAgo = (dateStr, now = Date.now()) => {
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.max(0, Math.floor((now - then) / 1000));
  for (const [label, size] of UNITS) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${label}${n > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

export const formatTimestamp = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const SHORT = [['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]];

// Compact label for tight cards; the full wording stays available via timeAgo / title.
export const timeAgoShort = (dateStr, now = Date.now()) => {
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.max(0, Math.floor((now - then) / 1000));
  for (const [label, size] of SHORT) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n}${label}`;
  }
  return 'now';
};
