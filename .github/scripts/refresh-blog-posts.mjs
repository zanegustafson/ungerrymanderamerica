// Regenerates blog/posts.json from the live Substack RSS feed.
// Runs on GitHub Actions (Node 20+, which has global fetch). No dependencies.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const FEED_URL = 'https://ungerrymanderamerica.substack.com/feed';
const OUT_FILE = 'blog/posts.json';
const MAX_POSTS = 12;

function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201c')
    .replace(/&#8221;/g, '\u201d')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .trim();
}

// Pull the first capture group of a tag's inner content from an item block.
function tag(block, name) {
  const m = block.match(new RegExp('<' + name + '[^>]*>([\\s\\S]*?)<\\/' + name + '>', 'i'));
  return m ? m[1] : '';
}

function firstImage(block) {
  // 1) enclosure with an image type
  const enc = block.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image[^"]*"[^>]*>/i)
    || block.match(/<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"[^>]*>/i);
  if (enc) return enc[1];
  // 2) first <img src> inside content:encoded
  const content = tag(block, 'content:encoded');
  const img = content.match(/<img[^>]+src="([^"]+)"/i);
  if (img) return img[1];
  return '';
}

async function main() {
  let res;
  try {
    res = await fetch(FEED_URL, { headers: { 'User-Agent': 'UngerrymanderAmerica-blog-refresh' } });
  } catch (e) {
    // Network/DNS error reaching Substack. Not a real failure; leave the
    // committed snapshot in place and exit cleanly so the run stays green.
    console.log('Feed fetch error (' + e.message + '); leaving snapshot as-is.');
    return;
  }
  if (!res.ok) {
    // Substack returned a non-OK status (rate limited, temporary outage, etc).
    // Leave the snapshot in place and exit cleanly rather than failing the run.
    console.log('Feed returned HTTP ' + res.status + '; leaving snapshot as-is.');
    return;
  }
  const xml = await res.text();

  const itemBlocks = xml.split(/<item[>\s]/i).slice(1).map(b => b.split(/<\/item>/i)[0]);
  const items = itemBlocks.slice(0, MAX_POSTS).map(block => ({
    title: decodeEntities(tag(block, 'title')),
    link: decodeEntities(tag(block, 'link')),
    pubDate: decodeEntities(tag(block, 'pubDate')),
    thumbnail: decodeEntities(firstImage(block)),
    description: decodeEntities(tag(block, 'description'))
  })).filter(i => i.title && i.link);

  if (items.length === 0) {
    // Feed shape changed or was empty. Keep the existing snapshot; do not fail.
    console.log('No items parsed from feed; leaving snapshot as-is.');
    return;
  }

  const payload = {
    generated: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    items
  };

  // Compare ignoring the "generated" timestamp so we only commit real changes.
  const next = JSON.stringify(payload, null, 4);
  if (existsSync(OUT_FILE)) {
    try {
      const prev = JSON.parse(readFileSync(OUT_FILE, 'utf8'));
      if (JSON.stringify(prev.items) === JSON.stringify(payload.items)) {
        console.log('No change in posts; leaving file as-is.');
        return;
      }
    } catch { /* fall through and write */ }
  }

  writeFileSync(OUT_FILE, next + '\n', 'utf8');
  console.log('Wrote ' + items.length + ' posts to ' + OUT_FILE);
}

// Even on an unexpected error, exit 0 so the scheduled run never emails a
// failure. The committed snapshot keeps the blog working regardless.
main().catch(err => { console.log('Non-fatal refresh error: ' + (err && err.message)); process.exit(0); });
