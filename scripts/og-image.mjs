/**
 * Prints the lead photo of an article (og:image / twitter:image) and the site name, so a
 * personal post can use the story's own picture with a credit.
 *   node scripts/og-image.mjs <article-url> [more urls]
 * Output per url: JSON { url, image, site } (image is null when the page has none or blocks us).
 */
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const meta = (html, keys) => {
  for (const k of keys) {
    const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']+)["']`, "i")) ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${k}["']`, "i"));
    if (m) return m[1].replace(/&amp;/g, "&");
  }
  return null;
};
for (const url of process.argv.slice(2)) {
  let out = { url, image: null, site: null };
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    out.status = r.status;
    if (r.ok) {
      const html = await r.text();
      const img = meta(html, ["og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"]);
      out.image = img ? new URL(img, r.url).href : null;
      out.site = meta(html, ["og:site_name", "application-name"]) ?? new URL(r.url).hostname.replace(/^www\./, "");
    }
  } catch (e) {
    out.error = String(e.message ?? e);
  }
  console.log(JSON.stringify(out));
}
