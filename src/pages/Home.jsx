import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, FileText, ShoppingCart, MessageCircle, MapPin } from 'lucide-react';
import './Home.css';

const heroSlides = [
  {
    id: 1,
    image: '/hero/hero2.jpg',
    imageMobile: '/hero/hero2mobile.jpg',
    title: 'Punya ide? Bingung mau cetak apa?',
    subtitle: 'Konsultasi dulu yuk, temukan solusi yang tepat untuk bisnis.',
    buttonText: 'Pelajari Lebih Lanjut',
    buttonLink: 'http://versa.co.id',
  },
  {
    id: 2,
    image: '/hero/hero3.jpg',
    imageMobile: '/hero/hero3mobile.jpg',
    title: 'Bikin Ide Jadi Nyata Bersama Versa Design Studio',
    subtitle: 'Dari desain hingga produksi, kami bantu kebutuhan visual bisnis Anda.',
    buttonText: 'Konsultasi Gratis',
    buttonLink: 'https://wa.me/628114357393',
  },
  {
    id: 3,
    image: '/hero/hero1.jpg',
    imageMobile: '/hero/hero1mobile.jpg',
    title: 'Nggak Tahu Harus Mulai dari Mana?',
    subtitle: 'Nggak perlu cari referensi berjam-jam atau mulai dari kanvas kosong.',
    buttonText: 'Cek Sekarang',
    buttonLink: 'http://bikin.in',
  },

];

const promoData = [
  {
    id: 1,
    badge: 'Discount 10%',
    title: 'Welcome Discount',
    desc: 'Dapatkan Diskon 10% Khusus Pengguna Aplikasi Versavers.',
    btnText: 'Klaim Sekarang',
    btnLink: 'http://qrco.de/versavers',
    image: 'https://placehold.co/600x400/0f766e/ffffff?text=Promo+1',
    bgClass: ''
  },
  {
    id: 2,
    badge: 'Trade In',
    title: 'Tukar Baliho/Spanduk Lama',
    desc: 'Baliho/Spanduk Usang Daripada Dibuang Mending Dijadiin Uang.',
    btnText: 'Hubungi Kami',
    btnLink: 'http://wa.me/628114357393',
    image: 'https://placehold.co/600x400/ffcc00/333333?text=Promo+2',
    bgClass: 'bg-gradient-tosca text-white'
  },
  {
    id: 3,
    badge: 'Free Delivery',
    title: 'Gratis Ongkir se-Manado',
    desc: 'Pesan sekarang, kami antar sampai depan pintu Anda tanpa biaya tambahan.',
    btnText: 'Pesan Sekarang',
    btnLink: 'http://wa.me/628114357393',
    image: 'https://placehold.co/600x400/e2e8f0/333333?text=Promo+3',
    bgClass: ''
  },
  {
    id: 4,
    badge: 'Cashback',
    title: 'Cashback Hingga 50rb',
    desc: 'Khusus cetak undangan pernikahan.',
    btnText: 'Lihat Detail',
    btnLink: 'http://wa.me/628114357393',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=Promo+4',
    bgClass: 'bg-primary-dark text-white'
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoSlide, setPromoSlide] = useState(0);

  const nextPromo = () => setPromoSlide(prev => Math.min(prev + 1, Math.ceil(promoData.length / 2) - 1));
  const prevPromo = () => setPromoSlide(prev => Math.max(prev - 1, 0));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));

  return (
    <div className="home">
      {/* Hero Carousel Section */}
      <section className="hero-carousel-section">
        <style dangerouslySetInnerHTML={{
          __html: heroSlides.map((slide, index) => `
            .slide-bg-${index} {
              background-image: url('${slide.image}');
            }
            @media (max-width: 768px) {0
              .slide-bg-${index} {
                background-image: url('${slide.imageMobile || slide.image}');
              }
            }
          `).join('\n')
        }} />
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide slide-bg-${index} ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="hero-overlay"></div>
            <div className="container hero-carousel-content">
              <div className="hero-carousel-text">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <div className="hero-carousel-buttons">
                  <a href={slide.buttonLink || "http://wa.me/628114357393"} target={slide.buttonLink?.startsWith('http') ? "_blank" : "_self"} rel="noreferrer" className="btn hero-action-btn">
                    {slide.buttonText || "Konsultasi Gratis"} <ArrowRight size={18} className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="container carousel-controls-wrapper">
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={prevSlide}><ChevronLeft size={24} /></button>
            <div className="carousel-indicators">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <button className="carousel-btn" onClick={nextSlide}><ChevronRight size={24} /></button>
          </div>
        </div>

        {/* Floating Quick Actions */}
        <div className="container quick-actions-wrapper">
          <div className="quick-actions-bar">
            <a href="#" className="action-item">
              <div className="action-icon-wrapper"><FileText size={24} className="text-white" /></div>
              <span>Design & Branding</span>
            </a>
            <a href="#" className="action-item">
              <div className="action-icon-wrapper"><ShoppingCart size={24} className="text-white" /></div>
              <span>Printing & Production</span>
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="action-item">
              <div className="action-icon-wrapper"><MessageCircle size={24} className="text-white" /></div>
              <span>Event & Merchandise</span>
            </a>
            <a href="#" className="action-item">
              <div className="action-icon-wrapper"><MapPin size={24} className="text-white" /></div>
              <span>Business Solutions</span>
            </a>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="section bg-white promo-section-100vh" id="promo">
        <div className="container">
          <div className="text-center section-header">
            <h2 className="text-primary">Promo of The Month</h2>
            <p className="section-desc">Jangan lewatkan penawaran spesial kami bulan ini.</p>
          </div>

          <div className="promo-slider-container">
            <div className="promo-slider-track" style={{ transform: `translateX(-${promoSlide * 100}%)` }}>
              {promoData.map((promo) => (
                <div key={promo.id} className={`card promo-card-new ${promo.bgClass}`}>
                  <div className="promo-img-placeholder">
                    <img src={promo.image} alt={promo.title} />
                    <div className="promo-badge-new">{promo.badge}</div>
                  </div>
                  <div className="promo-card-content">
                    <h3 style={promo.bgClass ? { color: 'white' } : {}}>{promo.title}</h3>
                    <p>{promo.desc}</p>
                    <a href={promo.btnLink} target="_blank" rel="noreferrer" className={`btn ${promo.bgClass ? 'bg-white text-primary hover-white' : 'btn-outline'} mt-4`}>{promo.btnText}</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="promo-slider-controls">
              <button className="promo-btn" onClick={prevPromo} disabled={promoSlide === 0}><ChevronLeft size={24} /></button>
              <button className="promo-btn" onClick={nextPromo} disabled={promoSlide === Math.ceil(promoData.length / 2) - 1}><ChevronRight size={24} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="section bg-gradient-tosca text-white" id="featured-work">
        <div className="container">
          <div className="text-center section-header">
            <h2 className="text-white">Featured Work</h2>
            <p className="text-white" style={{ opacity: 0.9 }}>Beberapa karya terbaik yang pernah kami kerjakan.</p>
          </div>
          <div className="featured-grid">
            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src="https://placehold.co/600x600/0f766e/ffffff?text=Branding" alt="Branding" />
                <div className="featured-content-overlay">
                  <h3>Branding & Identity</h3>
                  <p>Desain identitas visual yang kuat untuk membangun karakter dan daya tarik brand lokal Anda.</p>
                </div>
              </div>
            </div>
            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src="https://placehold.co/600x600/ffcc00/333333?text=Packaging" alt="Packaging" />
                <div className="featured-content-overlay">
                  <h3>Print & Packaging</h3>
                  <p>Solusi kemasan inovatif dan percetakan berkualitas untuk produk UMKM hingga korporat.</p>
                </div>
              </div>
            </div>
            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src="https://placehold.co/600x600/334155/ffffff?text=Signage" alt="Signage" />
                <div className="featured-content-overlay">
                  <h3>Signage & Outdoor</h3>
                  <p>Pembuatan baliho, neon box, dan media promosi luar ruang yang menarik perhatian.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4" style={{ marginTop: '3rem' }}>
            <a href="#" className="btn mt-6" style={{ backgroundColor: '#ffcc00', color: '#000' }}>Lihat Semua Karya</a>
          </div>
        </div>
      </section>


      <section className="section bg-white" id="value">
        <div className="container">
          <div className="text-center section-header">
            <h2 className="text-primary">WHY VERSA</h2>
          </div>

          <div className="value-grid">
            <div className="value-item">
              <div className="value-icon"><CheckCircle2 className="text-accent" size={36} /></div>
              <h3 className="text-primary">Desain dan produksi dalam satu tempat</h3>
              <p>Kami membantu mewujudkan ide menjadi karya visual yang siap digunakan, dari proses desain hingga hasil akhir..</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><CheckCircle2 className="text-accent" size={36} /></div>
              <h3 className="text-primary">Desain bukan hanya tentang terlihat bagus.</h3>
              <p>Kami memahami bahwa setiap desain harus memiliki tujuan—membangun brand, menyampaikan pesan, menarik perhatian, dan mendukung kebutuhan bisnis Anda.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><CheckCircle2 className="text-accent" size={36} /></div>
              <h3 className="text-primary">Menjaga brand Anda tetap konsisten di berbagai media.</h3>
              <p>Mulai dari konten media sosial hingga baliho dan materi promosi, kami membantu menghadirkan identitas visual yang konsisten di setiap titik komunikasi.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><CheckCircle2 className="text-accent" size={36} /></div>
              <h3 className="text-primary">Membuat proses lebih mudah, cepat, dan terintegrasi.</h3>
              <p>Kami memanfaatkan teknologi untuk mempermudah proses pemesanan, pengelolaan, pemantauan, hingga pengembangan solusi digital sesuai kebutuhan bisnis.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Latest Articles Section */}
      <section className="section bg-light" id="article">
        <div className="container">
          <div className="text-center section-header">
            <h2>Latest Articles</h2>
            <p className="section-desc">Berita dan informasi terbaru dari Versa Design Studio.</p>
          </div>

          <div className="article-grid">
            <a href="#" className="card article-card">
              <div className="article-image bg-primary-light"></div>
              <div className="article-content">
                <span className="article-date">August 31, 2026</span>
                <h3>Cetak Kemasan Custom Manado: Rahasia Biar Produkmu Nggak Punya "Kembaran"!</h3>
                <p>Pernah nggak sih kamu beli jajanan lokal di bazar, rasanya enak banget, tapi stiker kemasannya persis merek sebelah?</p>
                <span className="read-more text-primary">Read More <ArrowRight size={16} className="ml-2" /></span>
              </div>
            </a>

            <a href="#" className="card article-card">
              <div className="article-image" style={{ backgroundColor: '#0d9488' }}></div>
              <div className="article-content">
                <span className="article-date">August 28, 2026</span>
                <h3>Tren Undangan Nikah Akhir Tahun di Manado: Beralih ke Custom Aesthetic!</h3>
                <p>Menjelang akhir tahun sampai awal Januari nanti, jadwal sewa gedung resepsi biasanya sudah full booked.</p>
                <span className="read-more text-primary">Read More <ArrowRight size={16} className="ml-2" /></span>
              </div>
            </a>

            <a href="#" className="card article-card">
              <div className="article-image" style={{ backgroundColor: '#334155' }}></div>
              <div className="article-content">
                <span className="article-date">August 22, 2026</span>
                <h3>Bikin Event E-Sport Bareng Versa: Turnamen Warkop Makin Hype & Pro!</h3>
                <p>Nongkrong di warkop atau kafe seputaran Megamas sampai Tikala emang kurang afdol kalau nggak mabar.</p>
                <span className="read-more text-primary">Read More <ArrowRight size={16} className="ml-2" /></span>
              </div>
            </a>
          </div>

          <div className="text-center mt-4" style={{ marginTop: '3rem' }}>
            <a href="#" className="btn btn-outline">Lihat Semua Artikel</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-white" id="faq">
        <div className="container">
          <div className="text-center section-header">
            <h2>Frequently Asked Questions</h2>
            <p className="section-desc">Pertanyaan yang sering diajukan seputar layanan Versa.</p>
          </div>

          <div className="faq-container">
            <details className="faq-item">
              <summary>
                Versa buka setiap hari apa dan jam berapa? <ChevronDown className="faq-icon" />
              </summary>
              <div className="faq-content">
                <p>Versa buka setiap hari Senin sampai Sabtu, pukul 09.30 – 20.00 WITA.</p>
              </div>
            </details>
            <details className="faq-item">
              <summary>
                Di mana saja lokasi Versa Design Studio? <ChevronDown className="faq-icon" />
              </summary>
              <div className="faq-content">
                <ul>
                  <li><strong>Manado:</strong> Jl. Jendral Sudirman No.51, Pinaesaan, Kec. Wenang, Kota Manado</li>
                  <li><strong>Tahuna:</strong> Jl. Raya Tatehe, Apeng Sembeka, Tahuna</li>
                </ul>
              </div>
            </details>
            <details className="faq-item">
              <summary>
                Bagaimana cara order barang di Versa? <ChevronDown className="faq-icon" />
              </summary>
              <div className="faq-content">
                <p>Pemesanan bisa dilakukan langsung di store (offline) atau secara online melalui WhatsApp atau sosial media Versa.</p>
              </div>
            </details>
            <details className="faq-item">
              <summary>
                Apakah ada batas revisi desain? <ChevronDown className="faq-icon" />
              </summary>
              <div className="faq-content">
                <p>Ya, maksimal 3 kali revisi untuk setiap desain.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
