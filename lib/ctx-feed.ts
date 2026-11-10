export const PUBLIC_STORE_ORIGIN = "https://thehandlefactory.uk";

function originOf(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function bareHost(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function hostOf(value: string) {
  try {
    return bareHost(new URL(value).hostname);
  } catch {
    return "";
  }
}

/** WordPress may be http while the feed writes https, or wp.thehandlefactory.uk. */
export function isWordPressHost(hostname: string, wpOrigin: string, storeOrigin: string) {
  const host = bareHost(hostname);
  const wpHost = hostOf(wpOrigin);
  const storeHost = hostOf(storeOrigin);
  if (wpHost && host === wpHost) return true;
  if (storeHost && host === `wp.${storeHost}`) return true;
  return host === "wp.droviia.us";
}

/** Use the public storefront. A site URL that still points at WordPress must not win. */
export function feedStoreOrigin(wpOrigin: string, configured?: string) {
  const site = originOf(configured?.trim() || "");
  if (!site || hostOf(site) === hostOf(wpOrigin)) return PUBLIC_STORE_ORIGIN;
  const host = hostOf(site);
  if (!host || host.startsWith("wp.") || host === "droviia.us") return PUBLIC_STORE_ORIGIN;
  return site;
}

/** CTX writes WordPress permalinks. Keep media on that host; point product links at the storefront. */
export function rewriteProductLinks(xml: string, wpOrigin: string, storeOrigin: string) {
  if (!wpOrigin || !storeOrigin) return xml;
  const store = new URL(storeOrigin);
  if (hostOf(wpOrigin) === hostOf(storeOrigin)) return xml;

  const linked = xml.replace(
    /<((?:g:)?)(link|canonical_link)>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*<\/\1\2>/g,
    (match, ns: string, name: string, raw: string) => {
      let url: URL;
      try {
        url = new URL(raw.trim());
      } catch {
        return match;
      }
      if (!isWordPressHost(url.hostname, wpOrigin, storeOrigin)) return match;
      if (!url.pathname.startsWith("/product/") && url.pathname !== "/") return match;
      url.protocol = store.protocol;
      url.host = store.host;
      url.pathname = url.pathname.replace(/^\/product\//, "/products/");
      if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/$/, "");
      return `<${ns}${name}>${url.toString()}</${ns}${name}>`;
    },
  );

  return linked.replace(
    /<title>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*<\/title>/g,
    (match, raw: string) => {
      const value = raw.trim();
      const asUrl = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      let url: URL;
      try {
        url = new URL(asUrl);
      } catch {
        return match;
      }
      if (url.pathname !== "/" && url.pathname !== "") return match;
      if (!isWordPressHost(url.hostname, wpOrigin, storeOrigin)) return match;
      return `<title>${store.host}</title>`;
    },
  );
}
