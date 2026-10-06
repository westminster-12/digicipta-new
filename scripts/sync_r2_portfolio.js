import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize dotenv to read .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FB_PAGE_ID = process.env.FB_PAGE_ID || '749827318378462';
const FB_GRAPH_TOKEN = process.env.FB_GRAPH_TOKEN;

// Supabase Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Error: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'portfolio-images';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxxx.r2.dev

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
  console.error("❌ Error: Cloudflare R2 credentials missing in .env");
  console.log("Pastikan ada R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, dan R2_PUBLIC_URL");
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchFacebookPosts() {
  if (!FB_GRAPH_TOKEN) {
    throw new Error("FB_GRAPH_TOKEN is not defined in .env");
  }

  let url = `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/posts?fields=id,message,created_time,attachments{media{image},subattachments{media{image}}}&limit=100&access_token=${FB_GRAPH_TOKEN}`;
  let allPosts = [];
  
  console.log('Fetching posts from Facebook...');
  
  while (url) {
    console.log(`Fetching page... (Current total: ${allPosts.length} posts)`);
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Facebook API Error: ${data.error.message}`);
    }

    const posts = data.data || [];
    allPosts = allPosts.concat(posts);

    url = data.paging && data.paging.next ? data.paging.next : null;
  }

  console.log(`✅ Finished fetching. Total posts retrieved: ${allPosts.length}`);
  return allPosts;
}

async function uploadImageToR2(imageUrl, id) {
  try {
    const filename = `portfolio/${id}.jpg`;
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: 'image/jpeg',
    });

    await s3Client.send(command);
      
    // Return R2 public URL
    const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${filename}`;
    return publicUrl;
  } catch (error) {
    console.error(`\nError uploading image ${id} to R2:`, error.message);
    return null;
  }
}

async function processAndUploadImages(items) {
  console.log(`Checking existing images in database to skip re-uploading...`);
  const { data: existingItems, error } = await supabase.from('facebook_portfolios').select('id, image_url');
  
  if (error) {
    console.warn(`Could not fetch existing items:`, error.message);
  }
  
  const existingMap = new Map(existingItems?.map(item => [item.id, item.image_url]) || []);

  console.log(`Processing and uploading images to Cloudflare R2...`);
  const processedItems = [];
  const BATCH_SIZE = 5; // Smaller batch for external uploads
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    process.stdout.write(`\rUploading batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(items.length / BATCH_SIZE)}...`);
    
    const uploadPromises = batch.map(async (item) => {
      const existingUrl = existingMap.get(item.id);
      
      // If it already exists and is a Cloudflare R2 URL, skip uploading
      if (existingUrl && (existingUrl.includes('r2.dev') || existingUrl.includes(R2_PUBLIC_URL))) {
        return { ...item, image_url: existingUrl };
      }
      
      const permalink = await uploadImageToR2(item.image_url, item.id);
      if (permalink) {
        return { ...item, image_url: permalink };
      }
      return null;
    });
    
    const results = await Promise.all(uploadPromises);
    const successfulItems = results.filter(Boolean);
    processedItems.push(...successfulItems);
    
    await delay(500); 
  }
  console.log(`\n✅ Finished uploading images to R2.`);
  return processedItems;
}

async function extractImagesFromPosts(posts) {
  const portfolioItems = [];

  for (const post of posts) {
    const message = post.message || '';
    const attachments = post.attachments?.data || [];

    for (const attachment of attachments) {
      if (attachment.media?.image?.src) {
        portfolioItems.push({
          id: `${post.id}-main`,
          image_url: attachment.media.image.src,
          caption: message,
          created_time: post.created_time,
          ai_tags: ''
        });
      }

      if (attachment.subattachments?.data) {
        attachment.subattachments.data.forEach((sub, index) => {
          if (sub.media?.image?.src) {
            portfolioItems.push({
              id: `${post.id}-sub-${index}`,
              image_url: sub.media.image.src,
              caption: message,
              created_time: post.created_time,
              ai_tags: ''
            });
          }
        });
      }
    }
  }

  console.log(`Extracted ${portfolioItems.length} images from posts.`);
  return portfolioItems;
}

async function saveToSupabase(items) {
    console.log(`Saving ${items.length} records to Supabase...`);
    
    const BATCH_SIZE = 100;
    let successCount = 0;
    
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        
        const { error } = await supabase
            .from('facebook_portfolios')
            .upsert(batch, { onConflict: 'id' });
            
        if (error) {
            console.error(`❌ Error inserting batch ${i/BATCH_SIZE + 1}:`, error.message);
        } else {
            successCount += batch.length;
            process.stdout.write(`\rInserted ${successCount}/${items.length} records...`);
        }
    }
    console.log(`\n✅ Finished saving to Supabase.`);
}

async function main() {
  try {
    const posts = await fetchFacebookPosts();
    let portfolioItems = await extractImagesFromPosts(posts);
    portfolioItems = portfolioItems.filter(item => item.image_url);

    // Upload to Cloudflare R2
    portfolioItems = await processAndUploadImages(portfolioItems);

    if (portfolioItems.length > 0) {
        await saveToSupabase(portfolioItems);
    } else {
        console.log("No items to save.");
    }

  } catch (error) {
    console.error("❌ Error syncing Facebook portfolio:", error);
  }
}

main();
