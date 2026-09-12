import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import ApplyModal from '../components/ApplyModal';
import './Career.css';

/* Data posisi tidak diubah */
const departments = [
  {
    title: 'Creative Design Team',
    positions: [
      { name: 'Graphic Designer', desc: 'Membuat desain produk cetak & branding.' },
      { name: 'Lead Graphic Designer', desc: 'Memimpin tim desain & memastikan kualitas visual.' },
      { name: 'Content Creator', desc: 'Mengelola konten visual & sosial media.' },
      { name: 'Designer Bikinin', desc: 'Membuat & mengunggah artwork untuk platform Bikinin.' },
      { name: 'Head of Creative Design', desc: 'Memimpin seluruh team Designer dan Content Creator.' },
    ],
  },
  {
    title: 'Sales & Marketing',
    positions: [
      { name: 'Sales Advisor', desc: 'Melayani & menangani kebutuhan pelanggan.' },
      { name: 'Sales B2B', desc: 'Menargetkan klien korporat & bisnis besar.' },
      { name: 'Sales Coordinator', desc: 'Mengawasi dan mengoptimalkan tim sales.' },
      { name: 'Marketing Team', desc: 'Merancang strategi pemasaran digital & offline.' },
      { name: 'Marketing Lead', desc: 'Memimpin tim marketing & branding.' },
      { name: 'CRM', desc: 'Mengelola hubungan pelanggan, loyalty program, & after-sales service.' },
      { name: 'Sales & Marketing Head', desc: 'Memimpin Seluruh Team Sales & Marketing termasuk team CRM.' },
    ],
  },
  {
    title: 'Production & Operational',
    positions: [
      { name: 'SPV Production', desc: 'Mengawasi seluruh proses produksi.' },
      { name: 'Lead Operator', desc: 'Memastikan kelancaran operasional mesin cetak.' },
      { name: 'Operator Mesin', desc: 'Menjalankan mesin printing, finishing, dan lainnya.' },
      { name: 'Lead Finishing', desc: 'Mengawasi tim finishing produk cetak.' },
      { name: 'Team Finishing', desc: 'Bertugas melakukan proses akhir (laminasi, potong, jilid).' },
      { name: 'Team Branding', desc: 'Pemasangan branding seperti sticker & signage.' },
      { name: 'SPV Operational', desc: 'Mengelola proses operasional secara keseluruhan.' },
      { name: 'Team Advertising', desc: 'Bertanggung jawab atas produksi & pemasangan materi promosi.' },
      { name: 'Ops Head', desc: 'Memimpin Seluruh Team Production & Operational.' },
    ],
  },
  {
    title: 'IT & Development',
    positions: [
      { name: 'IT Manager', desc: 'Memimpin pengembangan teknologi internal & sistem.' },
      { name: 'Data Specialist', desc: 'Menganalisis & mengelola data bisnis.' },
      { name: 'Data Entry', desc: 'Memasukkan & memperbarui data produk.' },
      { name: 'Data Content Specialist', desc: 'Melengkapi data produk & artwork.' },
      { name: 'IT Support', desc: 'Menangani troubleshooting sistem & jaringan.' },
      { name: 'Back End Developer', desc: 'Pengembangan sisi server dari aplikasi dan sistem.' },
      { name: 'Front End Developer', desc: 'Pengembangan (UI/UX) dari sisi customer end.' },
      { name: 'AI Engineer', desc: 'Menerapkan teknologi ML, DL, dan AI lainnya.' },
    ],
  },
  {
    title: 'Finance & Accounting',
    positions: [
      { name: 'Finance Manager', desc: 'Mengelola keuangan & memimpin Team Finance & Accounting.' },
      { name: 'Finance Accountant', desc: 'Mengurus Pembukuan Keuangan Cashflow, Laba/Rugi, Asset.' },
      { name: 'Accounting Payable', desc: 'Mengurus pembayaran & laporan keuangan.' },
      { name: 'Receivable Team', desc: 'Mengelola pembayaran pelanggan & tagihan.' },
    ],
  },
  {
    title: 'Warehouse, Purchasing & HR',
    positions: [
      { name: 'SPV Warehouse', desc: 'Mengawasi manajemen gudang & stok barang.' },
      { name: 'Warehouse Team', desc: 'Menangani penyimpanan & distribusi barang.' },
      { name: 'Purchasing Team', desc: 'Mengurus pengadaan barang & vendor.' },
      { name: 'HRGA', desc: 'Mengurus rekrutmen, pengembangan karyawan, & administrasi.' },
    ],
  },
];

const benefits = [
  { num: '01', title: 'Bonus Mingguan', desc: 'Produktivitas tinggi berdampak langsung ke penghasilan mingguan.' },
  { num: '02', title: 'Rating & Reward (RAC)', desc: 'Performa kerja dinilai transparan dan berdampak nyata pada pendapatan.' },
  { num: '03', title: 'BPJS Ketenagakerjaan', desc: 'Perlindungan tenaga kerja yang terdaftar resmi.' },
  { num: '04', title: 'Extra Stars & Keuntungan', desc: 'Reward untuk kontribusi yang melampaui ekspektasi.' },
  { num: '05', title: 'Tabungan Investasi', desc: 'Reward yang bisa diinvestasikan kembali untuk perkembangan karir.' },
  { num: '06', title: 'Pelatihan & Pengembangan', desc: 'Akses ke pelatihan dan mentoring untuk mengasah keahlian.' },
  { num: '07', title: 'Lingkungan Kolaboratif', desc: 'Tim yang saling mendukung dengan budaya SILETIKA dan alur FASICURE.' },
  { num: '08', title: 'Event & Gathering', desc: 'Acara rutin untuk mempererat hubungan tim di luar jam kerja.' },
];

const siletikaValues = [
  { code: 'S', label: 'Sinergitas', desc: 'Saling mendukung dan berkolaborasi antar-divisi tanpa ego sektoral.' },
  { code: 'I', label: 'Integritas', desc: 'Jujur, transparan, dan konsisten memegang komitmen kerja.' },
  { code: 'L', label: 'Loyalitas', desc: 'Hadir sepenuh hati dan bangga bertumbuh bersama tim.' },
  { code: 'Etika', label: 'Etika', desc: 'Saling menghormati dan menjaga profesionalisme setiap hari.' },
];

const fasicureValues = [
  { code: 'FAst', label: 'Cepat & Responsif', desc: 'Cekatan merespons kebutuhan klien dan sigap mengeksekusi tugas tanpa menunda.' },
  { code: 'SImple', label: 'Praktis & Efisien', desc: 'Alur kerja yang ringkas, transparan, dan memudahkan semua pihak.' },
  { code: 'seCURE', label: 'Aman & Berkualitas', desc: 'Standar mutu terjamin, keamanan aset klien, dan ketepatan pengerjaan.' },
];

const DeptAccordion = ({ dept, index, onApply }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className={`dept-item ${open ? 'dept-item-open' : ''}`}>
      <button
        className="dept-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`dept-${index}`}
      >
        <span className="dept-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="dept-name">{dept.title}</span>
        <span className="dept-count">{dept.positions.length} posisi</span>
        {open ? <ChevronUp size={16} className="dept-chevron" /> : <ChevronDown size={16} className="dept-chevron" />}
      </button>

      {open && (
        <div className="dept-positions" id={`dept-${index}`} role="region">
          <div className="positions-table">
            <div className="positions-table-head">
              <span>Posisi</span>
              <span>Deskripsi</span>
              <span></span>
            </div>
            {dept.positions.map((pos, i) => (
              <div key={i} className="position-row">
                <span className="position-name">{pos.name}</span>
                <span className="position-desc">{pos.desc}</span>
                <button
                  type="button"
                  onClick={() => onApply(pos.name)}
                  className="position-apply"
                  aria-label={`Lamar posisi ${pos.name}`}
                >
                  Lamar <ArrowUpRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const heroImages = [
  '/career/_MG_7052.webp',
  '/career/_MG_7098.webp',
  '/career/_MG_7107.webp',
  '/career/_MG_7138.webp'
];

const Career = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const allPositionsList = departments.flatMap((dept) =>
    dept.positions.map((pos) => ({
      name: pos.name,
      department: dept.title,
    }))
  );

  const handleOpenApply = (posName = '') => {
    setSelectedPosition(posName);
    setIsApplyModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="career-page">

      {/* HERO: editorial typographic */}
      <section className="career-hero">
        <div className="career-hero-bg-container">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`career-hero-bg-slide ${idx === currentHeroSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="career-hero-overlay"></div>
        </div>

        <div className="career-hero-inner container">
          <div className="career-hero-meta">
            <span className="career-eyebrow">Bergabung dengan Versa</span>
            <div className="career-meta-stats">
              <span><strong>8+</strong> Tahun berdiri</span>
              <span><strong>6</strong> Departemen</span>
              <span><strong>40+</strong> Posisi terbuka</span>
            </div>
          </div>

          <div className="career-hero-headline">
            <h1>
              Kami mencari orang<br />
              yang ingin tumbuh,<br />
              <em>bukan sekadar bekerja.</em>
            </h1>
          </div>

          <div className="career-hero-bottom">
            <p className="career-hero-desc">
              Desainer, sales, engineer, dan operator bekerja berdampingan di sini.
              Kalau kamu serius di bidangmu, ada tempat untuk kamu di Versa.
            </p>
            {/* <button
              type="button"
              // onClick={() => handleOpenApply('')}
              className="career-hero-cta"
            > */}
            <a
              href="#lowongan"
              className="career-hero-cta"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('lowongan')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Lihat lowongan pekerjaan yang tersedia <ArrowRight size={16} />
            </a>
            {/* </button> */}
          </div>
        </div>
        <div className="career-hero-rule" aria-hidden="true" />
      </section>


      {/* BENEFIT: asymmetric split � narasi kiri sticky, benefit numbered list kanan */}
      <section className="career-benefit-section">
        <div className="container">
          <div className="career-benefit-grid">
            <div className="career-benefit-left">
              <span className="section-eyebrow">Kenapa Versa?</span>
              <h2>Lebih dari sekadar pekerjaan tetap</h2>
              <p>
                Di Versa, performa yang baik tidak diabaikan. Ada sistem reward yang
                transparan, jalur karir yang jelas, dan tim yang mendorongmu untuk
                terus belajar hal baru.
              </p>
              <p>
                Kami juga terus berkembang secara teknologi dari Versavers
                sampai platform Bikinin, ruang kontribusi yang lebih dari
                sekadar menjalankan tugas harian.
              </p>
            </div>

            <div className="career-benefit-right">
              {benefits.map((b) => (
                <div key={b.num} className="benefit-line">
                  <span className="benefit-num">{b.num}</span>
                  <div className="benefit-body">
                    <strong>{b.title}</strong>
                    <span>{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* SILETIKA & FASICURE: two-tone full-bleed split � dua warna, tanpa card */}
      <section className="career-culture-section" aria-label="Budaya dan sistem kerja">
        <div className="culture-split">
          <div className="culture-half culture-half-dark">
            <div className="culture-half-inner">
              <div className="culture-header">
                <span className="culture-tag">Budaya Tim</span>
                <h2 className="culture-title">SILETIKA</h2>
              </div>
              <p className="culture-desc">
                Fondasi karakter setiap anggota tim Versa dalam berinteraksi satu sama lain.
              </p>
              <ul className="culture-list">
                {siletikaValues.map((v) => (
                  <li key={v.code} className="culture-list-item">
                    <span className="culture-letter">{v.code}</span>
                    <div className="culture-item-body">
                      <strong>{v.label}</strong>
                      <span>{v.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="culture-half culture-half-teal">
            <div className="culture-half-inner">
              <div className="culture-header">
                <span className="culture-tag culture-tag-dark">Sistem Kerja</span>
                <h2 className="culture-title culture-title-dark">FASICURE</h2>
              </div>
              <p className="culture-desc culture-desc-dark">
                Standar alur operasional yang memastikan hasil kerja Versa cepat, sederhana, dan aman.
              </p>
              <ul className="culture-list">
                {fasicureValues.map((v) => (
                  <li key={v.code} className="culture-list-item culture-list-item-dark">
                    <span className="culture-letter culture-letter-dark">{v.code}</span>
                    <div className="culture-item-body">
                      <strong className="culture-label-dark">{v.label}</strong>
                      <span className="culture-desc-text-dark">{v.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* POSISI: accordion dengan table layout di dalam */}
      <section className="career-positions-section" id="lowongan">
        <div className="container">
          <div className="positions-intro">
            <div className="positions-intro-left">
              <span className="section-eyebrow">Posisi Tersedia</span>
              <h2>Temukan posisi<br />yang sesuai</h2>
            </div>
            {/* <p className="positions-intro-note">
              Semua posisi terbuka untuk lamaran. Kirim CV dan portfolio ke{' '}
              <a href="mailto:hrd@digicipta.com">hrd@digicipta.com</a>{' '}
              dengan subjek: <em>Nama Posisi - Nama Kamu</em>.
            </p> */}
          </div>

          <div className="departments-list">
            {departments.map((dept, idx) => (
              <DeptAccordion
                key={idx}
                dept={dept}
                index={idx}
                onApply={handleOpenApply}
              />
            ))}
          </div>
        </div>
      </section>


      {/* CTA: typographic pull-quote */}
      <section className="career-cta-section">
        <div className="container">
          <div className="career-cta-body">
            <p className="career-cta-quote">
              Tidak ada posisi yang cocok sekarang?
            </p>
            <p className="career-cta-sub">
              Kirim CV dan ceritakan keahlianmu. Kami menyimpan lamaran untuk kebutuhan mendatang.
            </p>
            <div className="career-cta-actions">
              <button
                type="button"
                onClick={() => handleOpenApply('Umum / Open Application')}
                className="btn btn-accent"
              >
                Kirim Lamaran Terbuka
              </button>
              <Link to="/about" className="career-cta-link">
                Kenali tim kami <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Career Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        initialPosition={selectedPosition}
        positionsList={allPositionsList}
      />

    </div>
  );
};

export default Career;
