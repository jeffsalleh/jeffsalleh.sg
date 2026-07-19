#!/usr/bin/env node
/**
 * Wix → Astro migration script for jeffsalleh.sg
 *
 * Requires Node 20+ and:
 *   npm install cheerio turndown
 *
 * Usage:
 *   node migrate-wix.mjs
 *
 * Output:
 *   ./migrated-output/posts/         — .md files (review before moving to src/content/blog/)
 *   ./migrated-output/images/        — hero images (move to public/images/)
 *   ./migrated-output/redirects.txt  — Wix→new URL redirect rules
 *   ./migrated-output/report.txt     — extraction report
 */

import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const FEED_URL = 'https://jeffsalleh.wixsite.com/jeffsalleh-personal/blog-feed.xml';
const OUTPUT_DIR = './migrated-output';
const POSTS_DIR = path.join(OUTPUT_DIR, 'posts');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');

// Wix template posts to skip
const SKIP_SLUGS = new Set([
  'manage-your-blog-from-your-live-site',
  'design-a-stunning-blog',
  'grow-your-blog-community',
]);

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});

// Strip Wix-specific junk
turndown.remove(['script', 'style', 'noscript', 'iframe']);

const report = [];

async function main() {
  console.log('🚀 Starting Wix → Astro migration for jeffsalleh.sg\n');

  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  console.log(`📡 Fetching RSS feed: ${FEED_URL}`);
  const feedXml = await (await fetch(FEED_URL)).text();
  const items = parseRss(feedXml);
  console.log(`   Found ${items.length} items in feed\n`);

  const realPosts = items.filter(i => !SKIP_SLUGS.has(i.slug));
  const skipped = items.length - realPosts.length;
  console.log(`   ${realPosts.length} real posts to migrate (${skipped} Wix templates skipped)\n`);

  const redirects = [];

  for (const [idx, item] of realPosts.entries()) {
    console.log(`[${idx + 1}/${realPosts.length}] ${item.title}`);
    try {
      const result = await migratePost(item);
      redirects.push(result.redirect);
      report.push(`✅ ${item.slug} — ${result.wordCount} words, ${result.imageCount} images`);
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      report.push(`❌ ${item.slug} — ${err.message}`);
    }
    // Be polite to Wix's servers
    await sleep(1000);
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'redirects.txt'),
    '# Add these lines to public/_redirects\n\n' + redirects.join('\n') + '\n'
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'report.txt'),
    report.join('\n') + '\n'
  );

  console.log(`\n✨ Done. Output in ${OUTPUT_DIR}/\n`);
  console.log('Next steps:');
  console.log('  1. Review each .md file in migrated-output/posts/');
  console.log('  2. Move reviewed files to src/content/blog/');
  console.log('  3. Move images from migrated-output/images/ to public/images/');
  console.log('  4. Append migrated-output/redirects.txt to public/_redirects');
}

function parseRss(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items = [];

  $('item').each((_, el) => {
    const $el = $(el);
    const link = $el.find('link').text().trim();
    const enclosure = $el.find('enclosure').attr('url') || '';

    // Extract slug from link (last segment after /single-post/)
    let slug = link.split('/single-post/').pop() || '';
    // Some old posts have date prefix: /2019/10/28/slug
    slug = slug.replace(/^\d{4}\/\d{2}\/\d{2}\//, '');
    slug = slug.replace(/\/$/, '');

    items.push({
      title: $el.find('title').text().trim(),
      description: $el.find('description').text().trim(),
      link,
      slug,
      pubDate: new Date($el.find('pubDate').text().trim()),
      image: enclosure,
      author: $el.find('dc\\:creator, creator').text().trim() || 'Jeff Salleh',
    });
  });

  return items;
}

async function migratePost(item) {
  // 1. Fetch the Wix post page
  const html = await (await fetch(item.link)).text();
  const $ = cheerio.load(html);

  // 2. Find the main article body
  // Wix uses several possible containers; try in priority order
  let $body =
    $('article').first().length     ? $('article').first() :
    $('[data-hook="post-description"]').first().length ? $('[data-hook="post-description"]').first() :
    $('main').first().length        ? $('main').first() :
    $('body');

  // 3. Strip navigation, comments, related posts, footers
  $body.find(
    'nav, header, footer, .comments, .related-posts, ' +
    '[data-hook*="comment"], [data-hook*="related"], ' +
    '[data-hook*="share"], [data-hook*="like"], ' +
    '[data-hook*="metadata"], [data-hook*="tags"], ' +
    '.wix-image[data-hook="social"]'
  ).remove();

  // 4. Fix image URLs to keep them absolute
  $body.find('img').each((_, img) => {
    const $img = $(img);
    const src = $img.attr('src') || $img.attr('data-src') || '';
    if (src) $img.attr('src', src);
  });

  // 5. Convert to markdown
  let markdown = turndown.turndown($body.html() || '');

  // 6. Clean up common Wix artifacts
  markdown = markdown
    .replace(/\n{3,}/g, '\n\n')           // collapse excessive blank lines
    .replace(/^\s*\|\s*$/gm, '')          // strip empty table cells
    .replace(/\[\s*\]\(.*?\)/g, '')       // strip empty links
    .replace(/!\[\]\(([^)]+)\)/g, '![]($1)')  // normalize empty-alt images
    .trim();

  // 7. Download hero image
  let heroImagePath = '';
  let imageCount = 0;
  if (item.image) {
    heroImagePath = await downloadImage(item.image, item.slug);
    imageCount = 1;
  }
  imageCount += (markdown.match(/!\[/g) || []).length;

  // 8. Build frontmatter
  const dateISO = item.pubDate.toISOString().slice(0, 10);
  const description = stripHtml(item.description).replace(/…$/, '').replace(/\.\.\.$/, '').trim();

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(item.title)}`,
    `description: ${JSON.stringify(description)}`,
    `date: ${dateISO}`,
    `tags: []`,
    heroImagePath ? `image: "/images/${heroImagePath}"` : null,
    `draft: true  # ← set to false after review`,
    '---',
    '',
    heroImagePath ? `![${item.title}](/images/${heroImagePath})\n` : '',
    markdown,
    '',
  ].filter(l => l !== null).join('\n');

  // 9. Write the .md file
  const filename = `${item.slug}.md`;
  await fs.writeFile(path.join(POSTS_DIR, filename), frontmatter);

  // 10. Build the redirect rule
  const oldPath = new URL(item.link).pathname;
  const redirect = `${oldPath}  /post/${item.slug}  301`;

  const wordCount = markdown.split(/\s+/).length;
  console.log(`   ✅ ${filename} (${wordCount} words)`);

  return { redirect, wordCount, imageCount };
}

async function downloadImage(url, slug) {
  try {
    // Clean up Wix's URL transformations to get a reasonable size
    let cleanUrl = url.replace(/\/v1\/fit\/[^/]+\//, '/v1/fit/w_1600,q_85/');

    const res = await fetch(cleanUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Figure out extension from content-type
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png'
              : contentType.includes('webp') ? 'webp'
              : contentType.includes('gif') ? 'gif'
              : 'jpg';

    const filename = `${slug}-hero.${ext}`;
    const filepath = path.join(IMAGES_DIR, filename);

    await pipeline(res.body, createWriteStream(filepath));
    console.log(`   🖼  Downloaded hero image → ${filename}`);
    return filename;
  } catch (err) {
    console.log(`   ⚠️  Image download failed: ${err.message}`);
    return '';
  }
}

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
