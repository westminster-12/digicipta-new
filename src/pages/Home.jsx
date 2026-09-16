import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight, ChevronDown,
  Printer, Palette, Package, Megaphone, CheckCircle2
} from 'lucide-react';
import './Home.css';

const heroSlides = [
  {
    id: 1,
    image: '/hero/hero2.jpg',
    imageMobile: '/hero/hero2mobile.jpg',
    tag: 'Design & Produksi',
    title: 'Dari Ide ke Tangan Pelanggan',
    subtitle: 'Versa menggabungkan desain dan produksi dalam satu tempat. Mulai dari konsep visual hingga hasil cetak siap pakai.',
    btnText: 'Konsultasi Sekarang',
    btnLink: 'https://wa.me/628114357393',
    btnExternal: true,
  },
  {
    id: 2,
    image: '/hero/hero3.jpg',
    imageMobile: '/hero/hero3mobile.jpg',
    tag: 'Printing & Signage',
    title: 'Cetak Berkualitas, Tepat Waktu',
    subtitle: 'Banner, neon box, packaging, hingga merchandise. Produksi dengan mesin modern dan tim yang berpengalaman sejak 2018.',
    btnText: 'Lihat Layanan',
    btnLink: '/portfolio',
    btnExternal: false,
  },
  {
    id: 3,
    image: '/hero/hero1.jpg',
    imageMobile: '/hero/hero1mobile.jpg',
    tag: 'Branding & Identitas',
    title: 'Brand yang Kuat Dimulai dari Visual',
    subtitle: 'Kami bantu bisnis Anda tampil konsisten di semua media. Dari logo hingga branding material yang siap digunakan.',
    btnText: 'Mulai Branding',
    btnLink: 'https://wa.me/628114357393',
    btnExternal: true,
  },
];

const promoData = [
  {
    id: 1,
    badge: 'Promo Pagi',
    title: 'Lebih Pagi, Lebih Cuan',
    desc: 'Order sebelum jam 10 pagi dan dapatkan keuntungan ekstra. Produksi lebih cepat, hasil lebih fresh.',
    btnText: 'Order Sekarang',
    btnLink: 'https://wa.me/628114357393',
    bgDark: false,
    image: '/home/promo/17228413554-banner_app_-_promo_lebih_pagi_lebihn_cuan.jpg',
  },
  {
    id: 2,
    badge: 'Pahe',
    title: 'Paket Hemat Versa',
    desc: 'Bundling layanan desain dan cetak dengan harga spesial. Cocok untuk UMKM yang baru membangun brand.',
    btnText: 'Cek Paket Hemat',
    btnLink: 'https://wa.me/628114357393',
    bgDark: true,
    image: '/home/promo/17228413725-banner_app_-_promo_pahe.jpg',
  },
  {
    id: 3,
    badge: 'Trade In',
    title: 'Tukar Baliho atau Spanduk Lama',
    desc: 'Baliho atau spanduk usang bisa jadi nilai tukar untuk order berikutnya. Hubungi kami untuk penghitungan nilai.',
    btnText: 'Hubungi Kami',
    btnLink: 'https://wa.me/628114357393',
    bgDark: false,
    image: '/home/promo/17228413826-banner_app_-_promo_tukar_baliho.jpg',
  },
  {
    id: 4,
    badge: 'Lucky Order',
    title: 'Lucky Order — Siapa Beruntung?',
    desc: 'Setiap order punya kesempatan menang hadiah menarik. Semakin sering order, semakin besar peluangmu.',
    btnText: 'Ikut Sekarang',
    btnLink: 'https://wa.me/628114357393',
    bgDark: true,
    image: '/home/promo/lucky_order.webp',
  },
];

const services = [
  {
    id: 1,
    icon: <Palette size={28} />,
    title: 'Desain & Branding',
    desc: 'Logo, identitas visual, dan panduan brand yang membantu bisnis Anda tampil konsisten di semua media.',
    link: '/portfolio',
  },
  {
    id: 2,
    icon: <Printer size={28} />,
    title: 'Printing & Produksi',
    desc: 'Banner, baliho, kemasan, undangan, hingga company profile. Dicetak dengan mesin modern dan finishing rapi.',
    link: '/portfolio',
  },
  {
    id: 3,
    icon: <Megaphone size={28} />,
    title: 'Signage & Outdoor',
    desc: 'Neon box, letter timbul, acrylic display, dan media promosi luar ruang yang menarik perhatian.',
    link: '/portfolio',
  },
  {
    id: 4,
    icon: <Package size={28} />,
    title: 'Event & Merchandise',
    desc: 'Perlengkapan event dari A ke Z: backdrop, ID card, kaos, totebag, dan souvenir kustom untuk tim atau klien.',
    link: '/portfolio',
  },
];

const whyVersa = [
  {
    num: '01',
    title: 'Desain dan produksi dalam satu tempat',
    desc: 'Tidak perlu koordinasi dua vendor berbeda. Dari konsep desain sampai hasil cetak, semuanya kami tangani.',
  },
  {
    num: '02',
    title: 'Desain yang punya tujuan',
    desc: 'Setiap desain kami buat dengan alasan: memperkuat brand, menyampaikan pesan, dan mendukung kebutuhan bisnis Anda.',
  },
  {
    num: '03',
    title: 'Tampil konsisten di semua media',
    desc: 'Dari konten media sosial hingga baliho, kami jaga identitas visual Anda tetap selaras di setiap titik komunikasi.',
  },
  {
    num: '04',
    title: 'Proses yang mudah dipantau',
    desc: 'Kami memanfaatkan teknologi untuk mempermudah pemesanan dan pemantauan status produksi secara transparan.',
  },
];

import { supabase } from '../lib/supabase';
import { Calendar } from 'lucide-react';

function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoPage, setPromoPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(typeof window !== 'undefined' && window.innerWidth <= 700 ? 1 : 2);
  const [homeArticles, setHomeArticles] = useState([]);

  useEffect(() => {
    async function fetchHomeArticles() {
      try {
        // Langsung ambil 3 artikel saja — tidak perlu fetch 50 lalu shuffle di client
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, content, cover_image, category, published_at, created_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3);

        if (!error && data && data.length > 0) {
          const mapped = data.map((item) => {
            let cleanExcerpt = item.excerpt;
            if (!cleanExcerpt || String(cleanExcerpt) === '[object Object]') {
              cleanExcerpt = stripHtml(item.content).substring(0, 150) + '...';
            } else {
               if (typeof cleanExcerpt === 'string' && cleanExcerpt.includes('[object Object]')) {
                  cleanExcerpt = stripHtml(item.content).substring(0, 150) + '...';
               } else {
                  cleanExcerpt = stripHtml(cleanExcerpt);
               }
            }

            let cleanCategory = item.category;
            if (String(cleanCategory) === '[object Object]') cleanCategory = 'Berita';

            return {
              id: item.id,
              slug: item.slug,
              title: item.title,
              category: cleanCategory,
              date: item.published_at
                ? new Date(item.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
              image: item.cover_image || 'https://placehold.co/600x400/0d9488/ffffff?text=Versa+Article',
              excerpt: cleanExcerpt,
            };
          });
          setHomeArticles(mapped);
        }
      } catch (err) {
        console.warn('Error fetching home articles:', err);
      }
    }
    
    fetchHomeArticles();
  }, []);

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      // Debounce resize untuk mencegah forced reflow berulang
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setItemsPerPage(window.innerWidth <= 700 ? 1 : 2);
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const totalPromoPages = Math.ceil(promoData.length / itemsPerPage);

  const nextPromo = () => setPromoPage(prev => (prev + 1) % totalPromoPages);
  const prevPromo = () => setPromoPage(prev => (prev === 0 ? totalPromoPages - 1 : prev - 1));

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(heroTimer);
  }, []);

  useEffect(() => {
    const promoTimer = setInterval(() => {
      setPromoPage(prev => (prev + 1) % totalPromoPages);
    }, 5000);
    return () => clearInterval(promoTimer);
  }, [totalPromoPages]);

  const nextSlide = () => setCurrentSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));

  return (
    <div className="home">

      {/* ── HERO CAROUSEL ── */}
      {/* Menggunakan <img> bukan CSS background-image agar browser bisa preload LCP */}
      <section className="hero-section" aria-label="Hero carousel">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            aria-hidden={index !== currentSlide}
          >
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={slide.imageMobile || slide.image}
              />
              <img
                src={slide.image}
                alt={slide.tag}
                className="hero-bg-img"
                width="1920"
                height="1080"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchpriority={index === 0 ? 'high' : 'low'}
                decoding={index === 0 ? 'sync' : 'async'}
              />
            </picture>
            <div className="hero-overlay" />
            <div className="container hero-content">
              <div className="hero-text">
                <span className="hero-tag">{slide.tag}</span>
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                {slide.btnExternal ? (
                  <a
                    href={slide.btnLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-accent"
                  >
                    {slide.btnText}
                  </a>
                ) : (
                  <Link to={slide.btnLink} className="btn btn-accent">
                    {slide.btnText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <div className="hero-controls">
          <button
            className="hero-nav-btn"
            onClick={prevSlide}
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="hero-dots" role="tablist">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentSlide}
                aria-label={`Slide ${i + 1}`}
                className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
          <button
            className="hero-nav-btn"
            onClick={nextSlide}
            aria-label="Slide berikutnya"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>


      {/* ── SERVICES ── */}
      {/* Layout asimetris: judul di kiri, deskripsi singkat di kanan */}
      <section className="section services-section" id="layanan">
        <div className="container">
          <div className="services-header">
            <div className="services-header-left">
              <span className="section-label">Layanan</span>
              <h2>Kami bantu dari desain sampai hasil jadi</h2>
            </div>
            <div className="services-header-right">
              <p>Versa menyediakan layanan desain kreatif dan produksi cetak dalam satu tempat, untuk UMKM hingga perusahaan besar di Manado dan sekitarnya.</p>
              <Link to="/portfolio" className="btn btn-outline mt-6">
                Lihat Portofolio
              </Link>
            </div>
          </div>

          <div className="services-grid">
            {services.map((svc) => (
              <Link key={svc.id} to={svc.link} className="service-card">
                <div className="service-icon">{svc.icon}</div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <span className="service-link">
                  Lihat karya <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ── FEATURED WORK — full-width editorial ── */}
      <section className="featured-section" id="karya">
        <div className="container">
          <div className="featured-header">
            <span className="section-label section-label-light">Karya Terpilih</span>
            <h2 className="text-white">Beberapa proyek yang pernah kami kerjakan</h2>
          </div>

          <div className="featured-grid">
            {/* Card besar: focal point utama section */}
            <div className="featured-card featured-card-large">
              <div className="featured-img-wrap">
                <img
                  src="/home/project/merch.webp"
                  alt="Souvenir dan merchandise custom: paper bag, tumbler, mug"
                  width="800"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />
                <div className="featured-overlay">
                  <span className="featured-cat">Merchandise</span>
                  <h3>Souvenir dan Merchandise Custom</h3>
                  <p>Produksi paper bag, tumbler, mug, buku catatan, dan pulpen berkualitas untuk kebutuhan instansi atau acara.</p>
                </div>
              </div>
            </div>

            {/* 2 card kecil */}
            <div className="featured-card featured-card-small">
              <div className="featured-img-wrap">
                <img
                  src="/home/project/umkm.webp"
                  alt="Identitas visual dan branding untuk UMKM lokal"
                  width="600"
                  height="450"
                  loading="lazy"
                  decoding="async"
                />
                <div className="featured-overlay">
                  <span className="featured-cat">Branding UMKM</span>
                  <h3>Identitas Visual untuk Brand Lokal</h3>
                  <p>Desain logo, panduan warna, dan material branding lengkap untuk UMKM.</p>
                </div>
              </div>
            </div>

            <div className="featured-card featured-card-small">
              <div className="featured-img-wrap">
                <img
                  src="/home/project/signage1.webp"
                  alt="Neon box dan papan nama signage outdoor"
                  width="600"
                  height="450"
                  loading="lazy"
                  decoding="async"
                />
                <div className="featured-overlay">
                  <span className="featured-cat">Signage</span>
                  <h3>Neon Box dan Papan Nama</h3>
                  <p>Produksi dan pemasangan signage untuk toko dan kantor.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="featured-cta">
            <Link to="/portfolio" className="btn btn-accent">
              Lihat Semua Karya <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* ── PROMO — horizontal slider ── */}
      <section className="section promo-section" id="promo">
        <div className="container">
          <div className="section-header-inline">
            <div>
              <span className="section-label">Penawaran</span>
              <h2>Promo bulan ini</h2>
            </div>
            <div className="promo-nav">
              <button
                className="promo-nav-btn"
                onClick={prevPromo}
                aria-label="Promo sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="promo-nav-btn"
                onClick={nextPromo}
                aria-label="Promo berikutnya"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="promo-slider-wrap">
            <div
              className="promo-track"
              style={{ transform: `translateX(-${promoPage * 100}%)` }}
            >
              {promoData.map(promo => (
                <div key={promo.id} className={`promo-card ${promo.bgDark ? 'promo-card-dark' : ''}`}>
                  <div className="promo-img">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      width="480"
                      height="320"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="promo-badge">{promo.badge}</span>
                  </div>
                  <div className="promo-body">
                    <h3>{promo.title}</h3>
                    <p>{promo.desc}</p>
                    <a
                      href={promo.btnLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`btn ${promo.bgDark ? 'btn-accent' : 'btn-primary'} mt-4`}
                    >
                      {promo.btnText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── WHY VERSA — narasi + numbered list ── */}
      {/* Layout berbeda dari section lain: 2 kolom dengan nomor besar sebagai elemen tipografi */}
      <section className="section why-section" id="kenapa-versa">
        <div className="container">
          <div className="why-grid">
            <div className="why-left">
              <span className="section-label">Kenapa Versa?</span>
              <h2>Lebih dari sekedar tukang cetak</h2>
              <p className="why-lead">
                Banyak vendor bisa cetak. Versa membantu bisnis Anda punya visual yang bekerja: menarik perhatian, membangun kepercayaan, dan konsisten di semua media.
              </p>
              <a
                href="https://wa.me/628114357393"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-8"
              >
                Cerita ke Kami
              </a>
            </div>
            <div className="why-right">
              {whyVersa.map(item => (
                <div key={item.num} className="why-item">
                  <span className="why-num">{item.num}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── LATEST ARTICLES ── */}
      <section className="section articles-section bg-light" id="artikel">
        <div className="container">
          <div className="section-header-inline">
            <div>
              <span className="section-label">Dari Blog Kami</span>
              <h2>Insight terbaru</h2>
            </div>
            <Link to="/article" className="btn btn-outline">
              Semua Artikel
            </Link>
          </div>

          <div className="article-grid mt-8">
            {homeArticles.map((article) => (
              <Link
                to={`/article/${article.slug}`}
                key={article.id}
                className="card article-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="article-image-wrapper">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-image"
                    width="600"
                    height="400"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="article-content">
                  <div className="flex justify-between items-center mb-2">
                     <span className="article-date">
                       <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                       {article.date}
                     </span>
                     {article.category && (
                        <span className="text-primary text-xs font-semibold">{article.category}</span>
                     )}
                  </div>
                  <h3 className="text-primary">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <span className="read-more text-accent">
                    Read More <ArrowRight size={16} className="ml-2" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ── FAQ ── */}
      <section className="section faq-section bg-white" id="faq">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-header-col">
              <span className="section-label">FAQ</span>
              <h2>Pertanyaan yang sering ditanya</h2>
              <p>Tidak menemukan jawaban yang Anda cari? Langsung tanyakan ke kami.</p>
              <a
                href="https://wa.me/628114357393"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-6"
              >
                Tanya via WhatsApp
              </a>
            </div>
            <div className="faq-list-col">
              <details className="faq-item">
                <summary>
                  Versa buka setiap hari apa dan jam berapa?
                  <ChevronDown className="faq-icon" aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <p>Versa buka setiap Senin sampai Sabtu, pukul 09.30 sampai 20.00 WITA.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary>
                  Di mana lokasi Versa Design Studio?
                  <ChevronDown className="faq-icon" aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <ul>
                    <li><strong>Manado:</strong> Jl. Jendral Sudirman No.51, Pinaesaan, Kec. Wenang</li>
                    <li><strong>Tahuna:</strong> Jl. Raya Tatehe, Apeng Sembeka, Tahuna</li>
                  </ul>
                </div>
              </details>

              <details className="faq-item">
                <summary>
                  Bagaimana cara memesan di Versa?
                  <ChevronDown className="faq-icon" aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <p>Pemesanan bisa dilakukan langsung di store atau online melalui WhatsApp dan media sosial Versa. Tim kami akan membantu dari konsultasi awal sampai barang jadi.</p>
                </div>
              </details>

              <details className="faq-item">
                <summary>
                  Berapa kali revisi desain yang bisa dilakukan?
                  <ChevronDown className="faq-icon" aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <p>Maksimal 3 kali revisi untuk setiap desain. Revisi tambahan bisa didiskusikan sesuai kebutuhan.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
