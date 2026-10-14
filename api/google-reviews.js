'use strict';

// This endpoint is opt-in. No key or fetched review is sent to logs or storage.
const windows = new Map();
function permit(client, now) {
  for (const [key, value] of windows) if (now - value.start >= 60000) windows.delete(key);
  for (const key of ['all', `client:${client}`]) {
    const slot = windows.get(key) || { start: now, count: 0 };
    if (slot.count >= (key === 'all' ? 30 : 5)) return false;
  }
  for (const key of ['all', `client:${client}`]) {
    const slot = windows.get(key) || { start: now, count: 0 };
    slot.count++; windows.set(key, slot);
  }
  return true;
}
module.exports = async function googleReviews(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ status: 'unavailable' }); }
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (process.env.FR_GOOGLE_REVIEWS_ENABLED !== 'true' || !key || !/^[A-Za-z0-9_-]{10,200}$/.test(placeId || '')) {
    return res.status(200).json({ status: 'not_configured' });
  }
  if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ status: 'unavailable' });
  const client = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (!permit(client, Date.now())) { res.setHeader('Retry-After', '60'); return res.status(429).json({ status: 'unavailable' }); }
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR`, {
      signal: controller.signal,
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri,attributions' }
    });
    if (!response.ok) return res.status(503).json({ status: 'unavailable' });
    const data = await response.json();
    if (!/franco\s*romeu/i.test(data.displayName?.text || '')) return res.status(503).json({ status: 'unavailable' });
    return res.status(200).json({
      status: 'ok',
      rating: Number.isFinite(data.rating) ? data.rating : null,
      userRatingCount: Number.isFinite(data.userRatingCount) ? data.userRatingCount : null,
      attributions: Array.isArray(data.attributions) ? data.attributions.map(a => ({ provider: a.provider, providerUri: a.providerUri })) : [],
      reviews: Array.isArray(data.reviews) ? data.reviews.slice(0, 5).map(review => ({
        rating: review.rating,
        text: review.originalText?.text || review.text?.text || '',
        relativePublishTimeDescription: review.relativePublishTimeDescription || '',
        googleMapsUri: review.googleMapsUri || data.googleMapsUri || '',
        author: { displayName: review.authorAttribution?.displayName || '', uri: review.authorAttribution?.uri || '', photoUri: review.authorAttribution?.photoUri || '' }
      })) : []
    });
  } catch (error) {
    return res.status(503).json({ status: 'unavailable' });
  } finally { clearTimeout(timer); }
};
