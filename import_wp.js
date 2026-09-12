import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function extractText(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val.__cdata) return val.__cdata;
  if (val['#text']) return extractText(val['#text']);
  return String(val);
}

async function importArticles() {
  console.log('Reading XML file...');
  const xmlData = fs.readFileSync('./public/ptversadigiciptasemesta.WordPress.2026-09-12.xml', 'utf8');
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
  });

  console.log('Parsing XML...');
  const parsed = parser.parse(xmlData);
  const items = parsed?.rss?.channel?.item;

  if (!items) {
    console.log('No items found in the XML');
    return;
  }

  const postsRaw = Array.isArray(items) ? items : [items];
  
  // Create attachment map for thumbnails
  const attachments = {};
  for (const item of postsRaw) {
    const postType = extractText(item['wp:post_type']);
    if (postType === 'attachment') {
      const postId = String(item['wp:post_id']);
      const url = extractText(item['wp:attachment_url']);
      if (postId && url) {
        attachments[postId] = url;
      }
    }
  }
  console.log(`Found ${Object.keys(attachments).length} attachments.`);

  const articlesToInsert = [];

  for (const post of postsRaw) {
    const postType = extractText(post['wp:post_type']);
    if (postType !== 'post') continue;

    const title = extractText(post.title) || 'Untitled';
    const content = extractText(post['content:encoded']);
    const excerpt = extractText(post['excerpt:encoded']);
    
    const wpStatus = extractText(post['wp:status']);
    const status = wpStatus === 'publish' ? 'published' : 'draft';
    
    const slugRaw = extractText(post['wp:post_name']);
    const slug = slugRaw || slugify(title);
    
    let pubDate = new Date().toISOString();
    try {
      if (post.pubDate) {
         pubDate = new Date(extractText(post.pubDate)).toISOString();
      }
    } catch(e) {}

    let category = '';
    let tags = [];

    // Parse categories and tags
    if (post.category) {
      const cats = Array.isArray(post.category) ? post.category : [post.category];
      for (const c of cats) {
        const domain = c['@_domain'];
        const text = extractText(c);
        if (domain === 'category') {
          category = text;
        } else if (domain === 'post_tag') {
          tags.push(text);
        }
      }
    }

    // Find Thumbnail
    let cover_image = '';
    if (post['wp:postmeta']) {
      const metas = Array.isArray(post['wp:postmeta']) ? post['wp:postmeta'] : [post['wp:postmeta']];
      for (const meta of metas) {
        if (extractText(meta['wp:meta_key']) === '_thumbnail_id') {
          const thumbId = String(extractText(meta['wp:meta_value']));
          if (attachments[thumbId]) {
            cover_image = attachments[thumbId];
          }
        }
      }
    }

    articlesToInsert.push({
      title,
      slug,
      content,
      excerpt,
      status,
      category,
      tags,
      cover_image,
      published_at: status === 'published' ? pubDate : null,
      created_at: pubDate,
    });
  }

  console.log(`Prepared ${articlesToInsert.length} articles to insert.`);

  if (articlesToInsert.length === 0) return;

  console.log('Deleting existing imported articles to prevent duplicates...');
  const { data: existing } = await supabase.from('articles').select('id');
  if (existing && existing.length > 0) {
    const ids = existing.map(e => e.id);
    for (let i = 0; i < ids.length; i += 50) {
      await supabase.from('articles').delete().in('id', ids.slice(i, i + 50));
    }
  }

  // Ensure unique slugs
  const slugCount = {};
  for (const article of articlesToInsert) {
    let baseSlug = article.slug;
    if (slugCount[baseSlug]) {
      slugCount[baseSlug]++;
      article.slug = `${baseSlug}-${slugCount[baseSlug]}`;
    } else {
      slugCount[baseSlug] = 1;
    }
  }

  console.log('Inserting into Supabase...');
  const { data, error } = await supabase.from('articles').insert(articlesToInsert);

  if (error) {
    console.error('Error inserting articles:', error);
  } else {
    console.log('Successfully imported articles with tags and thumbnails fixed!');
  }
}

importArticles().catch(console.error);
