import { useState, useEffect, useRef } from 'react';
import { X, Search, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ApplyModal.css';

const MAX_CV_SIZE_MB = 5;
const MAX_PORTFOLIO_SIZE_MB = 10;

export default function ApplyModal({ isOpen, onClose, initialPosition = '', positionsList = [] }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    whyVersa: '',
    portfolioType: 'url', // 'url' | 'file'
    portfolioUrl: '',
  });

  const [cvFile, setCvFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);

  // Position search
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: initialPosition || '',
        whyVersa: '',
        portfolioType: 'url',
        portfolioUrl: '',
      });
      setSearchQuery(initialPosition || '');
      setCvFile(null);
      setPortfolioFile(null);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, initialPosition]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filter positions
  const filteredPositions = positionsList.filter((item) => {
    const term = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      (item.department && item.department.toLowerCase().includes(term))
    );
  });

  const handleSelectPosition = (posName) => {
    setFormData((prev) => ({ ...prev, position: posName }));
    setSearchQuery(posName);
    setDropdownOpen(false);
  };

  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('File CV harus berformat PDF (.pdf)');
      return;
    }

    if (file.size > MAX_CV_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran CV maksimal ${MAX_CV_SIZE_MB}MB`);
      return;
    }

    setError(null);
    setCvFile(file);
  };

  const handlePortfolioFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('File Portfolio harus berformat PDF (.pdf)');
      return;
    }

    if (file.size > MAX_PORTFOLIO_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran Portfolio maksimal ${MAX_PORTFOLIO_SIZE_MB}MB`);
      return;
    }

    setError(null);
    setPortfolioFile(file);
  };

  const uploadFileToSupabase = async (file, bucketName, folder) => {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn(`Upload to ${bucketName} failed:`, uploadError);
      // Fallback: get filename for record reference
      return { path: filePath, error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { url: publicUrl || filePath, error: null };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError('Nama lengkap wajib diisi');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Nomor WhatsApp / telepon wajib diisi');
      return;
    }
    if (!formData.position.trim()) {
      setError('Silakan pilih posisi yang dilamar');
      return;
    }
    if (!cvFile) {
      setError('Silakan upload file CV Anda (PDF max 5MB)');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload CV
      let cvUrl = '';
      const cvUploadRes = await uploadFileToSupabase(cvFile, 'cv-uploads', 'cvs');
      if (cvUploadRes.url) {
        cvUrl = cvUploadRes.url;
      } else {
        // In case bucket is not created or restricted, generate an identifier
        cvUrl = `file_uploaded:${cvFile.name} (${(cvFile.size / 1024 / 1024).toFixed(2)} MB)`;
      }

      // 2. Upload Portfolio if file
      let portfolioUrl = formData.portfolioUrl.trim();
      if (formData.portfolioType === 'file' && portfolioFile) {
        const portUploadRes = await uploadFileToSupabase(portfolioFile, 'portfolio-uploads', 'portfolios');
        if (portUploadRes.url) {
          portfolioUrl = portUploadRes.url;
        } else {
          portfolioUrl = `file_uploaded:${portfolioFile.name} (${(portfolioFile.size / 1024 / 1024).toFixed(2)} MB)`;
        }
      }

      // 3. Insert to Supabase DB
      const { error: insertError } = await supabase.from('job_applications').insert([
        {
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          position: formData.position.trim(),
          cv_url: cvUrl,
          portfolio_url: portfolioUrl,
          portfolio_type: formData.portfolioType,
          why_versa: formData.whyVersa.trim(),
          status: 'new',
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Gagal mengirim lamaran. Silakan coba lagi atau hubungi kami.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-modal-backdrop" onClick={onClose}>
      <div className="apply-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="apply-modal-header">
          <div>
            <h3>Form Lamaran Kerja</h3>
            <p>Bergabunglah bersama tim kreatif & inovatif Versa Design Studio</p>
          </div>
          <button className="apply-modal-close" onClick={onClose} aria-label="Tutup form">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="apply-success-view">
            <div className="apply-success-icon">
              <CheckCircle2 size={36} />
            </div>
            <h3>Lamaran Terkirim!</h3>
            <p>
              Terima kasih telah melamar untuk posisi <strong>{formData.position}</strong>. Tim HRD Versa akan meninjau profilmu dan menghubungi melalui WhatsApp atau Email jika sesuai.
            </p>
            <button className="apply-btn-submit mt-4" onClick={onClose}>
              Selesai
            </button>
          </div>
        ) : (
          <form className="apply-modal-form" onSubmit={handleSubmit}>
            {error && (
              <div className="apply-error-msg">
                <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                {error}
              </div>
            )}

            {/* Position Searchable Dropdown */}
            <div className="apply-form-group" ref={dropdownRef}>
              <label>
                Posisi yang Dilamar <span className="required">*</span>
              </label>
              <div className="position-select-wrapper">
                <div className="position-search-box">
                  <Search size={16} className="position-search-icon" />
                  <input
                    type="text"
                    className="apply-input position-input-search"
                    placeholder="Cari atau pilih posisi..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFormData((p) => ({ ...p, position: e.target.value }));
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                  />
                  {formData.position && (
                    <button
                      type="button"
                      className="remove-file-btn"
                      style={{ position: 'absolute', right: '12px' }}
                      onClick={() => {
                        setSearchQuery('');
                        setFormData((p) => ({ ...p, position: '' }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {dropdownOpen && (
                  <ul className="position-dropdown-list">
                    {filteredPositions.length > 0 ? (
                      filteredPositions.map((pos, idx) => (
                        <li
                          key={idx}
                          className={`position-item ${formData.position === pos.name ? 'selected' : ''}`}
                          onClick={() => handleSelectPosition(pos.name)}
                        >
                          <span className="position-item-title">{pos.name}</span>
                          {pos.department && <span className="position-item-dept">{pos.department}</span>}
                        </li>
                      ))
                    ) : (
                      <li className="position-no-result">
                        Posisi tidak ditemukan. Kamu tetap bisa mengetik posisi kustom di atas.
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div className="apply-form-group">
              <label>
                Nama Lengkap <span className="required">*</span>
              </label>
              <input
                type="text"
                className="apply-input"
                placeholder="Contoh: Jessica Pangemanan"
                value={formData.fullName}
                onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                required
              />
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="apply-form-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="apply-input"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>

              <div className="apply-form-group">
                <label>
                  No. WhatsApp / HP <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  className="apply-input"
                  placeholder="0812-xxxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* CV Upload */}
            <div className="apply-form-group">
              <label>
                Upload CV (PDF) <span className="required">*</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#64748b' }}>
                  (Maks. {MAX_CV_SIZE_MB}MB)
                </span>
              </label>
              {cvFile ? (
                <div className="file-selected-badge">
                  <div className="file-name-row">
                    <FileText size={16} />
                    <span title={cvFile.name}>{cvFile.name}</span>
                    <span className="file-size-tag">({(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button type="button" className="remove-file-btn" onClick={() => setCvFile(null)}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="file-upload-box">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    style={{ display: 'none' }}
                    onChange={handleCvChange}
                  />
                  <Upload size={22} className="file-upload-icon" />
                  <span className="file-upload-title">Pilih atau Seret CV ke Sini</span>
                  <span className="file-upload-hint">Format PDF, maksimal {MAX_CV_SIZE_MB}MB</span>
                </label>
              )}
            </div>

            {/* Portfolio: URL or PDF */}
            <div className="apply-form-group">
              <label>Portofolio (Opsional)</label>
              <div className="portfolio-tab-group">
                <button
                  type="button"
                  className={`portfolio-tab-btn ${formData.portfolioType === 'url' ? 'active' : ''}`}
                  onClick={() => setFormData((p) => ({ ...p, portfolioType: 'url' }))}
                >
                  Link URL (Behance/Drive/Web)
                </button>
                <button
                  type="button"
                  className={`portfolio-tab-btn ${formData.portfolioType === 'file' ? 'active' : ''}`}
                  onClick={() => setFormData((p) => ({ ...p, portfolioType: 'file' }))}
                >
                  Upload File PDF
                </button>
              </div>

              {formData.portfolioType === 'url' ? (
                <input
                  type="url"
                  className="apply-input"
                  placeholder="https://behance.net/... atau link Google Drive"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, portfolioUrl: e.target.value }))}
                />
              ) : portfolioFile ? (
                <div className="file-selected-badge">
                  <div className="file-name-row">
                    <FileText size={16} />
                    <span title={portfolioFile.name}>{portfolioFile.name}</span>
                    <span className="file-size-tag">({(portfolioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button type="button" className="remove-file-btn" onClick={() => setPortfolioFile(null)}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="file-upload-box">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    style={{ display: 'none' }}
                    onChange={handlePortfolioFileChange}
                  />
                  <Upload size={22} className="file-upload-icon" />
                  <span className="file-upload-title">Pilih File Portofolio PDF</span>
                  <span className="file-upload-hint">Maksimal {MAX_PORTFOLIO_SIZE_MB}MB</span>
                </label>
              )}
            </div>

            {/* Alasan Mengapa Melamar di Versa */}
            <div className="apply-form-group">
              <label>Mengapa Ingin Bergabung dengan Versa?</label>
              <textarea
                className="apply-textarea"
                rows={3}
                placeholder="Ceritakan motivasi, ketertarikan, dan kontribusi yang ingin kamu bawa ke Versa..."
                value={formData.whyVersa}
                onChange={(e) => setFormData((p) => ({ ...p, whyVersa: e.target.value }))}
              />
            </div>

            <div className="apply-modal-footer" style={{ margin: '0 -1.75rem -1.75rem -1.75rem' }}>
              <button type="button" className="apply-btn-cancel" onClick={onClose} disabled={loading}>
                Batal
              </button>
              <button type="submit" className="apply-btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Mengirim...
                  </>
                ) : (
                  'Kirim Lamaran'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
