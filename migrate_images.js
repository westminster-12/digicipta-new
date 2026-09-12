import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// You need a service role key to bypass RLS, or you can use ANON key if your RLS policies allow public uploads and updates.
// Please ensure you have VITE_SUPABASE_SERVICE_ROLE_KEY in your .env or replace the anon key here if you disabled RLS.
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'images';
const TARGET_DOMAIN = 'digicipta.com';

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`Error downloading image ${url}:`, error.message);
    return null;
  }
}

async function uploadToSupabase(buffer, filename, mimeType) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(`articles/${filename}`, buffer, {
      contentType: mimeType,
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${filename} to Supabase:`, error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`articles/${filename}`);

  return publicUrlData.publicUrl;
}

function extractFilenameFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    // Gunakan path lengkap dan ganti '/' dengan '-' untuk mencegah file tertimpa
    // Contoh: /wp-content/uploads/2024/01/gambar.jpg menjadi wp-content-uploads-2024-01-gambar.jpg
    let filename = pathname.replace(/^\//, '').replace(/\//g, '-');
    filename = decodeURIComponent(filename);
    return filename;
  } catch (e) {
    return `image_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

async function processImagesInHtml(html) {
  if (!html) return html;
  
  // Regex to find all img src attributes
  const regex = /<img[^>]+src="([^">]+)"/g;
  let match;
  let newHtml = html;
  const urlMap = {}; // mapping old url to new url

  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (src.includes(TARGET_DOMAIN) && !urlMap[src]) {
      console.log(`Found image in content: ${src}`);
      const filename = extractFilenameFromUrl(src);
      const buffer = await downloadImage(src);
      
      if (buffer) {
        const mimeType = getMimeType(filename);
        const newUrl = await uploadToSupabase(buffer, filename, mimeType);
        if (newUrl) {
          urlMap[src] = newUrl;
        }
      }
    }
  }

  // Replace URLs in HTML
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    newHtml = newHtml.split(oldUrl).join(newUrl);
  }

  return newHtml;
}

async function migrate() {
  console.log('Fetching articles from Supabase...');
  const { data: articles, error } = await supabase.from('articles').select('*');

  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }

  console.log(`Found ${articles.length} articles.`);

  for (const article of articles) {
    console.log(`\nProcessing article: ${article.title}`);
    let updated = false;
    let newCoverImage = article.cover_image;
    let newContent = article.content;

    // Process cover image
    if (newCoverImage && newCoverImage.includes(TARGET_DOMAIN)) {
      console.log(`Found cover image: ${newCoverImage}`);
      const filename = extractFilenameFromUrl(newCoverImage);
      const buffer = await downloadImage(newCoverImage);
      
      if (buffer) {
        const mimeType = getMimeType(filename);
        const uploadedUrl = await uploadToSupabase(buffer, filename, mimeType);
        if (uploadedUrl) {
          newCoverImage = uploadedUrl;
          updated = true;
          console.log(`Successfully migrated cover image.`);
        }
      }
    }

    // Process content images
    if (newContent && newContent.includes(TARGET_DOMAIN)) {
      console.log(`Checking content for images...`);
      const migratedContent = await processImagesInHtml(newContent);
      if (migratedContent !== newContent) {
        newContent = migratedContent;
        updated = true;
        console.log(`Successfully migrated images in content.`);
      }
    }

    if (updated) {
      console.log(`Updating article ID: ${article.id}`);
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          cover_image: newCoverImage,
          content: newContent
        })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Failed to update article ID ${article.id}:`, updateError.message);
      } else {
        console.log(`Successfully updated article ID ${article.id}`);
      }
    } else {
      console.log(`No images needed migration for this article.`);
    }
  }

  console.log('\nMigration complete!');
}

migrate().catch(console.error);
