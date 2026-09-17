import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Initialize dotenv to read .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FB_PAGE_ID = process.env.FB_PAGE_ID || '749827318378462';
const FB_GRAPH_TOKEN = process.env.FB_GRAPH_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Supabase Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Error: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Initialize Gemini
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
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

    // Get the URL for the next page if it exists
    url = data.paging && data.paging.next ? data.paging.next : null;
  }

  console.log(`✅ Finished fetching. Total posts retrieved: ${allPosts.length}`);
  return allPosts;
}

async function extractImagesFromPosts(posts) {
  const portfolioItems = [];

  for (const post of posts) {
    const message = post.message || '';
    const attachments = post.attachments?.data || [];

    for (const attachment of attachments) {
      // Main image
      if (attachment.media?.image?.src) {
        portfolioItems.push({
          id: `${post.id}-main`,
          image_url: attachment.media.image.src,
          caption: message,
          created_time: post.created_time,
          ai_tags: ''
        });
      }

      // Multiple images in one post (carousel/album)
      if (attachment.subattachments?.data) {
        for (const sub of attachment.subattachments.data) {
          if (sub.media?.image?.src) {
            portfolioItems.push({
              id: `${post.id}-${sub.media.image.src.substring(sub.media.image.src.length - 10)}`, // rudimentary unique id
              image_url: sub.media.image.src,
              caption: message,
              created_time: post.created_time,
              ai_tags: ''
            });
          }
        }
      }
    }
  }

  console.log(`Extracted ${portfolioItems.length} images from posts.`);
  return portfolioItems;
}

async function saveToSupabase(items) {
    console.log(`Saving ${items.length} records to Supabase...`);
    
    // Process in batches of 100 to avoid exceeding Supabase request limits
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
    // 1. Fetch from FB
    const posts = await fetchFacebookPosts();
    
    // 2. Extract Images
    let portfolioItems = await extractImagesFromPosts(posts);

    // Filter out items without images just in case
    portfolioItems = portfolioItems.filter(item => item.image_url);

    // 3. Generate AI Tags (TEMPORARILY SKIPPED)
    console.log("⚠️ AI Tagging is temporarily skipped per user request. Using original captions only.");

    // 4. Save to Supabase Database
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
