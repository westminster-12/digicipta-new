import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Link2, Image as ImageIcon, List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
  Heading1, Heading2, Heading3, Code, Highlighter,
  CheckCircle, XCircle, AlertCircle, Save, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import '../../../components/admin/AdminLayout.css';
import './ArticleEditor.css';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function countWords(html) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

function countKeywordOccurrences(text, keyword) {
  if (!keyword) return 0;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (text.toLowerCase().match(new RegExp(escaped.toLowerCase(), 'g')) || []).length;
}

const compressImageToWebp = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1920;
        
        // Resize down if too large
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            reject(new Error('Gagal memproses gambar.'));
          }
        }, 'image/webp', 0.8);
      };
      img.onerror = () => reject(new Error('Format gambar tidak didukung atau rusak.'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
  });
};

// ─── SEO ANALYZER ────────────────────────────────────────────
function SeoAnalyzer({ title, slug, content, excerpt, seoTitle, seoDescription, focusKeyword, coverImage }) {
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim();
  const wordCount = countWords(content);
  const kwDensity = wordCount > 0 ? (countKeywordOccurrences(plainText, focusKeyword) / wordCount * 100) : 0;
  const seoTitleLen = seoTitle.length;
  const metaDescLen = seoDescription.length;

  const firstParagraphText = (() => {
    const m = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (!m) return '';
    return m[1].replace(/<[^>]*>/g, '').toLowerCase();
  })();

  const kw = focusKeyword.toLowerCase().trim();

  const checks = [
    {
      id: 'kw_title', label: 'Focus keyword ada di judul artikel',
      pass: kw && title.toLowerCase().includes(kw),
      weight: 2,
    },
    {
      id: 'kw_meta', label: 'Focus keyword ada di meta description',
      pass: kw && seoDescription.toLowerCase().includes(kw),
      weight: 2,
    },
    {
      id: 'kw_slug', label: 'Focus keyword ada di slug URL',
      pass: kw && slug.toLowerCase().includes(kw.replace(/\s+/g, '-')),
      weight: 1,
    },
    {
      id: 'kw_first_para', label: 'Focus keyword ada di paragraf pertama',
      pass: kw && firstParagraphText.includes(kw),
      weight: 2,
    },
    {
      id: 'kw_density', label: `Keyword density optimal (0.5–2.5%) — sekarang ${kwDensity.toFixed(1)}%`,
      pass: kw && kwDensity >= 0.5 && kwDensity <= 2.5,
      warn: kw && kwDensity > 2.5,
      weight: 2,
    },
    {
      id: 'word_count', label: `Panjang artikel ≥ 300 kata — sekarang ${wordCount} kata`,
      pass: wordCount >= 300,
      warn: wordCount >= 150 && wordCount < 300,
      weight: 2,
    },
    {
      id: 'meta_len', label: `Meta description 120–156 karakter — sekarang ${metaDescLen}`,
      pass: metaDescLen >= 120 && metaDescLen <= 156,
      warn: metaDescLen > 0 && (metaDescLen < 120 || metaDescLen > 156),
      weight: 2,
    },
    {
      id: 'seo_title_len', label: `SEO title 50–60 karakter — sekarang ${seoTitleLen}`,
      pass: seoTitleLen >= 50 && seoTitleLen <= 60,
      warn: seoTitleLen > 0 && (seoTitleLen < 50 || seoTitleLen > 60),
      weight: 1,
    },
    {
      id: 'has_image', label: 'Artikel memiliki cover image',
      pass: !!coverImage,
      weight: 1,
    },
    {
      id: 'has_excerpt', label: 'Artikel memiliki excerpt/ringkasan',
      pass: excerpt.trim().length > 50,
      weight: 1,
    },
  ];

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const passedWeight = checks.reduce((s, c) => c.pass ? s + c.weight : s, 0);
  const score = Math.round((passedWeight / totalWeight) * 100);

  let scoreColor = '#dc2626';
  let scoreLabel = 'Perlu Perbaikan';
  if (score >= 70) { scoreColor = '#16a34a'; scoreLabel = 'Baik'; }
  else if (score >= 45) { scoreColor = '#d97706'; scoreLabel = 'Cukup'; }

  return (
    <div className="seo-analyzer">
      {/* Score */}
      <div className="seo-score-ring-wrap">
        <div className="seo-score-ring" style={{ '--score-color': scoreColor }}>
          <svg viewBox="0 0 36 36" className="seo-donut">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={scoreColor} strokeWidth="2.5"
              strokeDasharray={`${score} ${100 - score}`}
              strokeDashoffset="25"
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <div className="seo-score-inner">
            <span className="seo-score-num" style={{ color: scoreColor }}>{score}</span>
            <span className="seo-score-total">/100</span>
          </div>
        </div>
        <div>
          <p className="seo-score-label" style={{ color: scoreColor }}>{scoreLabel}</p>
          <p className="seo-score-sub">{checks.filter(c => c.pass).length}/{checks.length} poin terpenuhi</p>
        </div>
      </div>

      {/* Google Preview */}
      {(seoTitle || title) && (
        <div className="seo-google-preview">
          <p className="seo-gp-label">Pratinjau Google</p>
          <div className="seo-gp-box">
            <div className="seo-gp-url">versa.co.id › article › {slug || 'url-artikel'}</div>
            <div className="seo-gp-title">{seoTitle || title || 'Judul Artikel'}</div>
            <div className="seo-gp-desc">{seoDescription || excerpt || 'Deskripsi artikel akan muncul di sini...'}</div>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="seo-checklist">
        {checks.map(c => (
          <div key={c.id} className={`seo-check-item ${c.pass ? 'pass' : c.warn ? 'warn' : 'fail'}`}>
            {c.pass
              ? <CheckCircle size={14} className="seo-check-icon pass" />
              : c.warn
              ? <AlertCircle size={14} className="seo-check-icon warn" />
              : <XCircle size={14} className="seo-check-icon fail" />
            }
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EDITOR TOOLBAR ──────────────────────────────────────────
function Toolbar({ editor }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageFileRef = useRef();

  if (!editor) return null;

  const btn = (action, active, title, icon) => (
    <button
      type="button"
      onClick={action}
      className={`editor-toolbar-btn ${active ? 'active' : ''}`}
      title={title}
    >
      {icon}
    </button>
  );

  function addLink() {
    const url = window.prompt('URL:');
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  async function uploadContentImage(file) {
    if (!file) return;
    setUploadingImage(true);
    try {
      const webpFile = await compressImageToWebp(file);
      const path = `content/${Date.now()}.webp`;
      const { error } = await supabase.storage.from('article-images').upload(path, webpFile);
      if (!error) {
        const { data } = supabase.storage.from('article-images').getPublicUrl(path);
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
      } else {
        console.error('Supabase upload error:', error);
        alert(`Gagal mengupload gambar: ${error.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Exception during upload:', err);
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <>
      {uploadingImage && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, 
          background: 'rgba(0,0,0,0.6)', color: '#fff', 
          display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 600 }}>Menyiapkan & Mengupload Gambar...</span>
          <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Proses kompresi ke WebP sedang berjalan. Mohon tunggu.</span>
        </div>
      )}
      <div className="editor-toolbar">
        <div className="editor-toolbar-group">
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'Heading 2', <Heading1 size={15} />)}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'Heading 3', <Heading2 size={15} />)}
        {btn(() => editor.chain().focus().toggleHeading({ level: 4 }).run(), editor.isActive('heading', { level: 4 }), 'Heading 4', <Heading3 size={15} />)}
      </div>
      <div className="editor-toolbar-divider" />
      <div className="editor-toolbar-group">
        {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold', <Bold size={15} />)}
        {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic', <Italic size={15} />)}
        {btn(() => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'Underline', <UnderlineIcon size={15} />)}
        {btn(() => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'Strikethrough', <Strikethrough size={15} />)}
        {btn(() => editor.chain().focus().toggleHighlight().run(), editor.isActive('highlight'), 'Highlight', <Highlighter size={15} />)}
        {btn(() => editor.chain().focus().toggleCode().run(), editor.isActive('code'), 'Inline Code', <Code size={15} />)}
      </div>
      <div className="editor-toolbar-divider" />
      <div className="editor-toolbar-group">
        {btn(() => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'Align Left', <AlignLeft size={15} />)}
        {btn(() => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'Align Center', <AlignCenter size={15} />)}
        {btn(() => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'Align Right', <AlignRight size={15} />)}
      </div>
      <div className="editor-toolbar-divider" />
      <div className="editor-toolbar-group">
        {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Bullet List', <List size={15} />)}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'Numbered List', <ListOrdered size={15} />)}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), 'Quote', <Quote size={15} />)}
      </div>
      <div className="editor-toolbar-divider" />
      <div className="editor-toolbar-group">
        {btn(addLink, editor.isActive('link'), 'Add Link', <Link2 size={15} />)}
        <button
          type="button"
          onClick={() => imageFileRef.current?.click()}
          className={`editor-toolbar-btn ${uploadingImage ? 'uploading' : ''}`}
          title="Add Image"
          disabled={uploadingImage}
          style={{ opacity: uploadingImage ? 0.5 : 1 }}
        >
          <ImageIcon size={15} />
        </button>
        <input ref={imageFileRef} type="file" accept="image/*" hidden onChange={e => {
            uploadContentImage(e.target.files?.[0]);
            e.target.value = '';
        }} />
      </div>
      <div className="editor-toolbar-divider" />
      <div className="editor-toolbar-group">
        {btn(() => editor.chain().focus().undo().run(), false, 'Undo', <Undo2 size={15} />)}
        {btn(() => editor.chain().focus().redo().run(), false, 'Redo', <Redo2 size={15} />)}
      </div>
    </div>
    </>
  );
}

// ─── MAIN EDITOR ─────────────────────────────────────────────
export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isNew = id === 'new';
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeTab, setActiveTab] = useState('seo');

  const [form, setForm] = useState({
    title: '', slug: '', content: '', excerpt: '',
    cover_image: '', category: '', tags: '',
    seo_title: '', seo_description: '', focus_keyword: '', og_image: '',
    status: 'draft',
  });
  const [slugEdited, setSlugEdited] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CharacterCount,
      Placeholder.configure({ placeholder: 'Mulai menulis artikel di sini...' }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: form.content,
    onUpdate({ editor }) {
      setForm(f => ({ ...f, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (!isNew) loadArticle();
  }, [id]);

  async function loadArticle() {
    const { data } = await supabase.from('articles').select('*').eq('id', id).single();
    if (data) {
      setForm({
        title: data.title ?? '',
        slug: data.slug ?? '',
        content: data.content ?? '',
        excerpt: data.excerpt ?? '',
        cover_image: data.cover_image ?? '',
        category: data.category ?? '',
        tags: (data.tags ?? []).join(', '),
        seo_title: data.seo_title ?? '',
        seo_description: data.seo_description ?? '',
        focus_keyword: data.focus_keyword ?? '',
        og_image: data.og_image ?? '',
        status: data.status ?? 'draft',
      });
      setCoverPreview(data.cover_image ?? '');
      setSlugEdited(true);
      editor?.commands.setContent(data.content ?? '');
    }
  }

  function handleTitleChange(val) {
    setForm(f => ({
      ...f,
      title: val,
      slug: slugEdited ? f.slug : slugify(val),
    }));
  }

  async function uploadCover(file) {
    if (!file) return;
    setUploading(true);
    try {
      const webpFile = await compressImageToWebp(file);
      const path = `covers/${Date.now()}.webp`;
      const { error } = await supabase.storage.from('article-images').upload(path, webpFile);
      if (!error) {
        const { data } = supabase.storage.from('article-images').getPublicUrl(path);
        setForm(f => ({ ...f, cover_image: data.publicUrl }));
        setCoverPreview(data.publicUrl);
      } else {
        alert('Gagal mengupload cover: ' + error.message);
      }
    } catch (err) {
      alert('Gagal memproses gambar: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save(publishOverride) {
    setSaving(true);
    const status = publishOverride !== undefined ? publishOverride : form.status;
    const payload = {
      ...form,
      status,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published_at: status === 'published' ? new Date().toISOString() : null,
      author_id: profile?.id,
    };

    let error;
    if (isNew) {
      const res = await supabase.from('articles').insert(payload).select().single();
      error = res.error;
      if (!error) navigate(`/admin/articles/${res.data.id}`, { replace: true });
    } else {
      const res = await supabase.from('articles').update(payload).eq('id', id);
      error = res.error;
    }

    if (!error) {
      setSaveMsg(status === 'published' ? 'Published!' : 'Tersimpan');
      setForm(f => ({ ...f, status }));
      setTimeout(() => setSaveMsg(''), 2500);
    }
    setSaving(false);
  }

  const wordCount = countWords(form.content);

  return (
    <div className="article-editor-root">
      {uploading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, 
          background: 'rgba(0,0,0,0.6)', color: '#fff', 
          display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 600 }}>Menyiapkan & Mengupload Cover...</span>
          <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Proses kompresi ke WebP sedang berjalan. Mohon tunggu.</span>
        </div>
      )}
      {/* Top bar */}
      <div className="ae-topbar">
        <button onClick={() => navigate('/admin/articles')} className="adm-btn adm-btn-ghost" style={{ gap: '0.25rem' }}>
          <ArrowLeft size={15} /> Kembali
        </button>
        <div className="ae-topbar-title">
          <span>{isNew ? 'Artikel Baru' : 'Edit Artikel'}</span>
          <span className={`adm-badge ${form.status === 'published' ? 'adm-badge-green' : 'adm-badge-gray'}`} style={{ fontSize: '0.7rem' }}>
            {form.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="ae-topbar-actions">
          {saveMsg && <span className="ae-save-msg">{saveMsg}</span>}
          <button onClick={() => save()} className="adm-btn adm-btn-ghost" disabled={saving}>
            <Save size={15} /> Simpan Draft
          </button>
          {form.status !== 'published'
            ? <button onClick={() => save('published')} className="adm-btn adm-btn-primary" disabled={saving}>
                <Eye size={15} /> Publish
              </button>
            : <button onClick={() => save('draft')} className="adm-btn adm-btn-secondary" disabled={saving}>
                <EyeOff size={15} /> Unpublish
              </button>
          }
        </div>
      </div>

      <div className="ae-layout">
        {/* Left: Editor */}
        <div className="ae-editor-col">
          {/* Title */}
          <div className="ae-title-wrap">
            <input
              className="ae-title-input"
              placeholder="Judul artikel..."
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
            />
            <div className="ae-slug-row">
              <span className="ae-slug-prefix">versa.co.id/article/</span>
              <input
                className="ae-slug-input"
                value={form.slug}
                onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })); }}
                placeholder="url-artikel"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="ae-editor-card">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="ae-editor-content" />
            <div className="ae-editor-footer">
              <span>{wordCount} kata · {editor?.storage.characterCount.characters() ?? 0} karakter</span>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="ae-sidebar">
          {/* Cover Image */}
          <div className="adm-card ae-sidebar-section">
            <p className="ae-sidebar-section-title">Cover Image</p>
            {coverPreview
              ? <div className="ae-cover-preview">
                  <img src={coverPreview} alt="Cover preview" />
                  <button
                    className="ae-cover-remove"
                    onClick={() => { setForm(f => ({ ...f, cover_image: '' })); setCoverPreview(''); }}
                  >Hapus</button>
                </div>
              : <button
                  className="ae-cover-upload-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <ImageIcon size={20} />
                  <span>{uploading ? 'Mengupload...' : 'Upload Cover Image'}</span>
                </button>
            }
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => uploadCover(e.target.files?.[0])} />
          </div>

          {/* Publish Settings */}
          <div className="adm-card ae-sidebar-section">
            <p className="ae-sidebar-section-title">Pengaturan Artikel</p>
            <div className="adm-form-field">
              <label>Kategori</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="mis: Design, Teknologi" />
            </div>
            <div className="adm-form-field" style={{ marginTop: '0.75rem' }}>
              <label>Tags</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="pisah dengan koma" />
              <span className="adm-form-hint">Contoh: desain, percetakan, branding</span>
            </div>
            <div className="adm-form-field" style={{ marginTop: '0.75rem' }}>
              <label>Ringkasan / Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Ringkasan singkat artikel untuk card & SEO..."
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>

          {/* SEO / Readability Tabs */}
          <div className="adm-card ae-sidebar-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="ae-tab-header">
              {['seo', 'readability'].map(tab => (
                <button key={tab} className={`ae-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'seo' ? 'SEO' : 'Keterbacaan'}
                </button>
              ))}
            </div>

            <div style={{ padding: '1rem' }}>
              {activeTab === 'seo' && (
                <>
                  <div className="adm-form-field">
                    <label>Focus Keyword</label>
                    <input
                      value={form.focus_keyword}
                      onChange={e => setForm(f => ({ ...f, focus_keyword: e.target.value }))}
                      placeholder="mis: cetak undangan manado"
                    />
                  </div>
                  <div className="adm-form-field" style={{ marginTop: '0.75rem' }}>
                    <label>SEO Title <span style={{ color: '#94a3b8', fontWeight: 400 }}>({form.seo_title.length}/60)</span></label>
                    <input
                      value={form.seo_title}
                      onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
                      placeholder={form.title || 'Judul untuk Google...'}
                      maxLength={70}
                    />
                    <div className="ae-char-bar">
                      <div className="ae-char-fill" style={{ width: `${Math.min(100, (form.seo_title.length / 60) * 100)}%`, background: form.seo_title.length > 60 ? '#dc2626' : '#0d9488' }} />
                    </div>
                  </div>
                  <div className="adm-form-field" style={{ marginTop: '0.75rem' }}>
                    <label>Meta Description <span style={{ color: '#94a3b8', fontWeight: 400 }}>({form.seo_description.length}/156)</span></label>
                    <textarea
                      value={form.seo_description}
                      onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))}
                      placeholder="Deskripsi yang muncul di Google..."
                      style={{ minHeight: '70px' }}
                      maxLength={200}
                    />
                    <div className="ae-char-bar">
                      <div className="ae-char-fill" style={{ width: `${Math.min(100, (form.seo_description.length / 156) * 100)}%`, background: form.seo_description.length > 156 ? '#dc2626' : '#0d9488' }} />
                    </div>
                  </div>
                  <SeoAnalyzer
                    title={form.title}
                    slug={form.slug}
                    content={form.content}
                    excerpt={form.excerpt}
                    seoTitle={form.seo_title}
                    seoDescription={form.seo_description}
                    focusKeyword={form.focus_keyword}
                    coverImage={form.cover_image}
                  />
                </>
              )}

              {activeTab === 'readability' && (
                <ReadabilityPanel content={form.content} wordCount={wordCount} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadabilityPanel({ content, wordCount }) {
  const sentences = content.replace(/<[^>]*>/g, ' ').split(/[.!?]+/).filter(s => s.trim().length > 0);
  const longSentences = sentences.filter(s => s.trim().split(' ').length > 25);
  const avgSentenceLen = sentences.length > 0 ? wordCount / sentences.length : 0;

  const readEase = Math.max(0, Math.min(100, 206.835 - 1.015 * avgSentenceLen));

  let readLabel = 'Sangat Sulit';
  let readColor = '#dc2626';
  if (readEase >= 70) { readLabel = 'Mudah Dibaca'; readColor = '#16a34a'; }
  else if (readEase >= 60) { readLabel = 'Cukup Mudah'; readColor = '#d97706'; }
  else if (readEase >= 50) { readLabel = 'Agak Sulit'; readColor = '#d97706'; }

  const checks = [
    { label: `Panjang artikel: ${wordCount} kata`, pass: wordCount >= 300, warn: wordCount >= 150 },
    { label: `Kalimat terlalu panjang: ${longSentences.length} kalimat (>25 kata)`, pass: longSentences.length === 0, warn: longSentences.length <= 3 },
    { label: `Rata-rata panjang kalimat: ${avgSentenceLen.toFixed(0)} kata`, pass: avgSentenceLen < 20, warn: avgSentenceLen < 25 },
    { label: 'Konten memiliki paragraf yang cukup', pass: sentences.length >= 5, warn: sentences.length >= 2 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.875rem', background: '#f8fafc', borderRadius: '8px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: readColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '1.125rem', fontWeight: '700', color: readColor }}>{Math.round(readEase)}</span>
        </div>
        <div>
          <p style={{ fontWeight: '700', fontSize: '0.875rem', color: readColor }}>{readLabel}</p>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Flesch Reading Score</p>
        </div>
      </div>
      <div className="seo-checklist">
        {checks.map((c, i) => (
          <div key={i} className={`seo-check-item ${c.pass ? 'pass' : c.warn ? 'warn' : 'fail'}`}>
            {c.pass ? <CheckCircle size={14} className="seo-check-icon pass" />
              : c.warn ? <AlertCircle size={14} className="seo-check-icon warn" />
              : <XCircle size={14} className="seo-check-icon fail" />}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
