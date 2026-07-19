#!/usr/bin/env node
/**
 * Image-only downloader for Wix migration.
 * Reruns the image download step without touching your .md files.
 *
 * Usage: node fix-images.mjs
 * Output: ./migrated-output/images/
 */

import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import * as cheerio from 'cheerio';

const FEED_URL = 'https://jeffsalleh.wixsite.com/jeffsalleh-personal/blog-feed.xml';
const IMAGES_DIR = './migrated-output/images';

const SKIP_SLUGS = new Set([
  'manage-your-blog-from-your-live-site',
  'design-a-stunning-blog',
  'grow-your-blog-community',
]);

async function main() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  console.log(`📡 Fetching RSS feed...`);
  const feedXml = await (await fetch(FEED_URL)).text();
  const items = parseRss(feedXml).filter(i => !SKIP_SLUGS.has(i.slug));
  console.log(`   ${items.length} posts to process\n`);

  let successes = 0;
  let failures = 0;

  for (const [idx, item] of items.entries()) {
    console.log(`[${idx + 1}/${items.length}] ${item.slug}`);
    if (!item.image) {
      console.log(`   ⚠️  no image in RSS feed`);
      failures++;
      continue;
    }

    const result = await downloadImage(item.image, item.slug);
    if (result.ok) {
      console.log(`   ✅ ${result.filename} (${result.size} bytes)`);
      successes++;
    } else {
      console.log(`   ❌ ${result.error}`);
      console.log(`      URL was: ${item.image}`);
      failures++;
    }

    await sleep(500);
  }

  console.log(`\nDone. ${successes} succeeded, ${failures} failed.`);
}

function parseRss(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items = [];
  $('item').each((_, el) => {
    const $el = $(el);
    const link = $el.find('link').text().trim();
    let slug = link.split('/single-post/').pop() || '';
    slug = slug.replace(/^\d{4}\/\d{2}\/\d{2}\//, '').replace(/\/$/, '');
    items.push({
      slug,
      image: $el.find('enclosure').attr('url') || '',
    });
  });
  return items;
}

async function downloadImage(url, slug) {
  try {
    // Use the URL exactly as it appears in the feed — no clever rewriting
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Referer': 'https://jeffsalleh.wixsite.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status} ${res.statusText}` };
    }

    // Figure out extension from URL or content-type
    const contentType = res.headers.get('content-type') || '';
    let ext = 'jpg';
    if (contentType.includes('png') || url.includes('.png')) ext = 'png';
    else if (contentType.includes('webp') || url.includes('.webp')) ext = 'webp';
    else if (contentType.includes('gif') || url.includes('.gif')) ext = 'gif';
    else if (contentType.includes('jpeg') || url.includes('.jpg') || url.includes('.jpeg')) ext = 'jpg';

    const filename = `${slug}-hero.${ext}`;
    const filepath = path.join(IMAGES_DIR, filename);

    await pipeline(res.body, createWriteStream(filepath));
    const stat = await fs.stat(filepath);

    return { ok: true, filename, size: stat.size };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => {
  console.error('\n💥 Fatal:', err);
  process.exit(1);
});
