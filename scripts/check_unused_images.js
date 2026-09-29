import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUnusedImages() {
  console.log('Fetching portfolio entries...');
  const { data: portfolios, error: portError } = await supabase
    .from('portfolios')
    .select('images');

  if (portError) {
    console.error('Error fetching portfolios:', portError);
    return;
  }

  // Extract all image URLs from portfolios and just get their filenames/paths
  const usedPaths = new Set();
  portfolios.forEach(p => {
    if (p.images && Array.isArray(p.images)) {
      p.images.forEach(imgUrl => {
        // e.g. https://.../storage/v1/object/public/portfolio-images/portfolio/123-abc.jpg
        const urlParts = imgUrl.split('/portfolio-images/');
        if (urlParts.length > 1) {
          usedPaths.add(urlParts[1]); // e.g., 'portfolio/123-abc.jpg'
        }
      });
    }
  });

  console.log(`Found ${usedPaths.size} referenced images in the portfolios table.`);

  console.log('Fetching files from bucket portfolio-images/portfolio...');
  
  // Storage API sometimes needs pagination if there are many items. We'll list with limit 1000
  const { data: files, error: storageError } = await supabase.storage
    .from('portfolio-images')
    .list('portfolio', {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (storageError) {
    console.error('Error fetching storage files:', storageError);
    return;
  }
  
  const unusedImages = [];
  files.forEach(file => {
    // files might include an empty name for the folder itself
    if (file.name === '.emptyFolderPlaceholder' || !file.name) return;
    
    const filePath = `portfolio/${file.name}`;
    if (!usedPaths.has(filePath)) {
      unusedImages.push(filePath);
    }
  });

  console.log(`Found ${files.length} total files in the bucket 'portfolio' folder.`);
  
  if (unusedImages.length > 0) {
    console.log(`\nFound ${unusedImages.length} unused images:`);
    unusedImages.forEach(img => console.log(`- ${img}`));
    
    // Optionally delete them?
    // console.log('\nTo delete them, run the script with --delete');
  } else {
    console.log('\nNo unused images found! Your bucket is clean.');
  }
}

checkUnusedImages();
