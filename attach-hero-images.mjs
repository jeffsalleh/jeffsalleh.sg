#!/usr/bin/env node
/**
 * Attach hero images to migrated posts.
 *
 * Matches each .md file in src/content/blog/ against a matching hero image
 * in public/images/ (based on the post's slug), and injects the markdown image
 * reference at the top of the body — right after the frontmatter.
 *
 * Safe to re-run: skips posts that already have a hero image.
 *
 * Usage:  node attach-hero-images.mjs
 * Dry run: node attach-hero-images.mjs --dry-run
 */

import fs from 'fs/promises';
import path from 'path';

const POSTS_DIR = './src/content/blog';
const IMAGES_DIR = './public/images';
const IMAGE_URL_PREFIX = '/images';

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN — no files will be changed\n' : '✏️  Updating posts...\n');

  const postFiles = (await fs.readdir(POSTS_DIR))
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const availableImages = new Set(await fs.readdir(IMAGES_DIR));

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const filename of postFiles) {
    const slug = filename.replace(/\.mdx?$/, '');
    const filepath = path.join(POSTS_DIR, filename);
    const content = await fs.readFile(filepath, 'utf-8');

    // Find the matching hero image for this slug — try common extensions
    const candidates = [
      `${slug}-hero.jpg`,
      `${slug}-hero.jpeg`,
      `${slug}-hero.png`,
      `${slug}-hero.webp`,
      `${slug}-hero.gif`,
    ];
    const imageFile = candidates.find(name => availableImages.has(name));

    if (!imageFile) {
      console.log(`⚠️  ${filename} — no matching image found`);
      missing++;
      continue;
    }

    const imageUrl = `${IMAGE_URL_PREFIX}/${imageFile}`;

    // Skip if this URL is already present in the body
    if (content.includes(imageUrl)) {
      console.log(`⏭  ${filename} — already has hero image`);
      skipped++;
      continue;
    }

    // Locate end of frontmatter block (--- ... ---)
    const fmMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
    if (!fmMatch) {
      console.log(`❌ ${filename} — no frontmatter block found, skipping`);
      skipped++;
      continue;
    }

    const frontmatter = fmMatch[0];
    const body = content.slice(frontmatter.length);

    // Pull the title out of the frontmatter for the alt text
    const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    const alt = titleMatch ? titleMatch[1].replace(/["']/g, '') : slug;

    // Build the image line and inject it as the first body line
    const imageLine = `![${alt}](${imageUrl})\n\n`;
    const newContent = frontmatter + '\n' + imageLine + body.replace(/^\n+/, '');

    if (DRY_RUN) {
      console.log(`✅ ${filename} — would add ${imageFile}`);
    } else {
      await fs.writeFile(filepath, newContent);
      console.log(`✅ ${filename} — added ${imageFile}`);
    }
    updated++;
  }

  console.log(`\nSummary: ${updated} updated, ${skipped} skipped, ${missing} missing images`);
  if (DRY_RUN) console.log('\n(dry run — re-run without --dry-run to apply)');
}

main().catch(err => {
  console.error('💥 Fatal:', err);
  process.exit(1);
});
