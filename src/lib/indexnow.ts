/**
 * src/lib/indexnow.ts
 * Pings IndexNow (Bing, Yandex, and other participating search engines)
 * whenever a page is published or updated, instead of waiting for a crawl.
 *
 * Key file must be hosted at the site root: /public/{INDEXNOW_KEY}.txt
 * containing exactly the key string.
 */

const INDEXNOW_KEY = "93d9375c5a614532862a685fe804c95d";
const HOST = "www.strixmind.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

/**
 * Submit one or more absolute URLs to IndexNow.
 * Fire-and-forget: failures are logged but never thrown, so a slow/broken
 * IndexNow endpoint can never break a publish/save action.
 */
export async function submitToIndexNow(urls: string | string[]): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : [urls];
  if (urlList.length === 0) return;

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    });

    if (!res.ok) {
      console.error(`IndexNow submission failed (${res.status}):`, await res.text());
    }
  } catch (err) {
    console.error("IndexNow submission error:", err);
  }
}
