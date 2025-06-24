export function createPageUrl(page, params = {}) {
  const url = new URLSearchParams(params).toString();
  return url ? `/${page}?${url}` : `/${page}`;
}