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
const BUCKET_NAME = 'images';
const FOLDER_PATH = 'portfolio'; // Folder di dalam bucket

async function deleteAllImagesInPortfolioFolder() {
  console.log(`Mulai mencari file di bucket '${BUCKET_NAME}/${FOLDER_PATH}'...`);
  
  let totalDeleted = 0;
  let hasMore = true;

  while (hasMore) {
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(FOLDER_PATH, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (listError) {
      console.error('Gagal mengambil daftar file:', listError);
      return;
    }

    // Filter file asli (hindari .emptyFolderPlaceholder)
    const validFiles = files.filter(f => f.name && f.name !== '.emptyFolderPlaceholder');

    if (validFiles.length === 0) {
      hasMore = false;
      break;
    }

    const pathsToDelete = validFiles.map(f => `${FOLDER_PATH}/${f.name}`);
    console.log(`Menemukan ${pathsToDelete.length} file untuk dihapus (batch berjalan)...`);

    // Hapus dengan batch (max 1000 file sekaligus disupport Supabase, tapi kita pass array nya)
    const { data: deleted, error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(pathsToDelete);

    if (deleteError) {
      console.error('Gagal menghapus file:', deleteError);
      return;
    }

    totalDeleted += deleted.length;
    console.log(`Berhasil menghapus ${deleted.length} file di batch ini.`);
  }

  console.log(`\n🎉 Proses selesai! Total file yang berhasil dihapus: ${totalDeleted}`);
}

deleteAllImagesInPortfolioFolder();
