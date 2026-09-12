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

async function updateAuthors() {
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
  const authorMap = {};

  for (const post of postsRaw) {
    const postType = extractText(post['wp:post_type']);
    if (postType !== 'post') continue;

    const title = extractText(post.title) || 'Untitled';
    const slugRaw = extractText(post['wp:post_name']);
    const slug = slugRaw || slugify(title);
    
    const author = extractText(post['dc:creator']);
    if (author) {
      authorMap[slug] = author;
    }
  }

  console.log(`Found ${Object.keys(authorMap).length} authors from XML.`);

  // Mapping username ke display name jika diperlukan (berdasarkan data XML sebelumnya)
  const displayNames = {
    'admin': 'Admin Versa',
    'adminweb': 'Admin Web',
    'Chusni Mubarok': 'Chusni Mubarok'
  };

  const { data: articles, error } = await supabase.from('articles').select('id, slug, title');
  
  if (error) {
    console.error('Error fetching articles:', error);
    return;
  }

  console.log(`Updating ${articles.length} articles...`);

  let updatedCount = 0;
  for (const article of articles) {
    // Some slugs might have been modified during import (e.g. appended with -1)
    // We try to match exact slug first, then fallback to original slug logic
    let originalSlug = article.slug.replace(/-\d+$/, '');
    
    let rawAuthor = authorMap[article.slug] || authorMap[originalSlug];
    if (rawAuthor) {
      const authorName = displayNames[rawAuthor] || rawAuthor;
      
      const { error: updateError } = await supabase
        .from('articles')
        .update({ author_name: authorName })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Failed to update article ${article.slug}:`, updateError.message);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Successfully updated authors for ${updatedCount} articles!`);
}

updateAuthors().catch(console.error);
