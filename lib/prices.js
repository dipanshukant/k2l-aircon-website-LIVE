// Service prices, editable in the CMS. Pages mark each price number with
// <span data-price="key">; the middleware fills in the saved values.
export const PRICE_FIELDS = [
  { key: 'secondhand', label: 'Second-hand aircon, installed', unit: '' },
  { key: 'newunit', label: 'New aircon, supplied and installed', unit: '' },
  { key: 'repair', label: 'Aircon repair', unit: '' },
  { key: 'servicing', label: 'General servicing', unit: 'a unit' },
  { key: 'gas', label: 'Gas top-up', unit: 'a unit' },
  { key: 'chemical', label: 'Chemical overhaul', unit: 'a unit' },
];

export const DEFAULT_PRICES = { secondhand: 700, newunit: 1350, repair: 40, servicing: 50, gas: 80, chemical: 120 };

const KEY = 'settings:prices';

export async function getPrices(env, { fresh = false } = {}) {
  const saved = await env.KV.get(KEY, fresh ? { type: 'json' } : { type: 'json', cacheTtl: 60 });
  return { ...DEFAULT_PRICES, ...(saved || {}) };
}

export async function savePrices(env, input) {
  const clean = {};
  for (const { key } of PRICE_FIELDS) {
    const n = Number(String(input?.[key] ?? '').replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n) || n <= 0 || n > 100000) throw new Error(`Price for "${key}" must be a number above 0.`);
    clean[key] = Math.round(n);
  }
  await env.KV.put(KEY, JSON.stringify(clean));
  return clean;
}

export function formatPrice(n) {
  return Number(n).toLocaleString('en-US');
}
