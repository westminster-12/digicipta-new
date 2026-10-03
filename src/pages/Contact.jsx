import { MapPin, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import './Contact.css';
import SEO from '../components/SEO';

const Contact = () => {
  return (
    <div className="page-layout">
      <SEO
        title="Hubungi Kami"
        description="Hubungi Versa Design Studio untuk konsultasi proyek Anda."
        canonicalUrl="/contact"
      />
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container text-center">
          <h1 className="hero-title animate-fade-in">
            Mari Bicarakan<br />
            <span className="text-accent">Proyek Anda</span>
          </h1>
          <p className="hero-subtitle animate-fade-in delay-100">
            Pilih cabang terdekat dan hubungi tim kami untuk mewujudkan ide kreatif Anda.
          </p>
        </div>
      </section>

      {/* Locations Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="locations-wrapper">

            {/* Manado Branch */}
            <div className="location-card glass-card animate-fade-in delay-200">
              <div className="location-content">
                <div className="badge-branch">Pusat Manado</div>
                <h2 className="location-title">Versa Design Studio Manado</h2>
                <div className="location-details">
                  <div className="detail-item">
                    <MapPin className="detail-icon" />
                    <p>Jl. Jendral Sudirman No.51, Pinaesaan, Kec. Wenang, Kota Manado, Sulawesi Utara 95114</p>
                  </div>
                  <div className="detail-item">
                    <Clock className="detail-icon" />
                    <p>Senin - Sabtu<br />09.30 – 20.00 WITA</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/628114357393"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary wa-btn"
                >
                  <MessageCircle size={20} />
                  Hubungi Manado
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </div>
              <div className="location-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.4702709035796!2d124.84215157447174!3d1.48945096111227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x328775b30a38bf41%3A0x6eb87a6b7053ea43!2sVERSA%20DESIGN%20STUDIO%20-%20Design%20Printing%20Custom%20Manado!5e0!3m2!1sid!2sid!4v1789310407973!5m2!1sid!2sid"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map Manado">
                </iframe>
              </div>
            </div>

            {/* Tahuna Branch */}
            <div className="location-card glass-card animate-fade-in delay-300">
              <div className="location-content">
                <div className="badge-branch tahuna-badge">Cabang Tahuna</div>
                <h2 className="location-title">Versa Design Studio Tahuna</h2>
                <div className="location-details">
                  <div className="detail-item">
                    <MapPin className="detail-icon" />
                    <p>Jl. Raya Tatehe, Apeng Sembeka, Kec. Tahuna, Kabupaten Kepulauan Sangihe, Sulawesi Utara 95812</p>
                  </div>
                  <div className="detail-item">
                    <Clock className="detail-icon" />
                    <p>Senin - Sabtu<br />10.00 – 20.00 WITA</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/6285395655070"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary wa-btn"
                >
                  <MessageCircle size={20} />
                  Hubungi Tahuna
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </div>
              <div className="location-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.9181016863995!2d125.48187050000001!3d3.6062208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x328b0b85cb76a847%3A0x1b937f16f94b8985!2sVersa%20Design%20Studio%20-%20Design%20Printing%20Custom%20Tahuna!5e0!3m2!1sid!2sid!4v1789310367712!5m2!1sid!2sid"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map Tahuna">
                </iframe>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Career / Job Application Section */}
      <section className="section career-section bg-light">
        <div className="container">
          <div className="career-wrapper">
            <div className="text-center mb-5">
              <h2 className="location-title">Tertarik Bergabung dengan Kami?</h2>
              <p className="hero-subtitle mb-4">
                Isi formulir di bawah ini atau kirimkan lamaran dan portofolio Anda secara manual melalui email.
              </p>
              <a
                href="mailto:versads.office@gmail.com?subject=Lamaran%20Pekerjaan%20-%20[Nama%20Anda]&body=Halo%20Versa%20Design%20Studio,%0A%0ABerikut%20adalah%20lamaran%20dan%20portofolio%20saya.%0A%0ATerima%20kasih."
                className="btn btn-outline-primary"
              >
                <MessageCircle size={20} className="mr-2" />
                Kirim Lamaran via Email (Manual)
              </a>
            </div>

            <div className="form-card glass-card">
              <h3 className="mb-4">Formulir Lamaran</h3>
              <form className="contact-form" onSubmit={(e) => {
                e.preventDefault();
                alert('Fungsi kirim form sedang dipersiapkan. Untuk saat ini, silakan gunakan tombol Kirim Manual di atas.');
              }}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama lengkap Anda" required />
                </div>
                <div className="form-group">
                  <label>Email Anda</label>
                  <input type="email" placeholder="Masukkan email Anda" required />
                </div>
                <div className="form-group">
                  <label>Posisi yang Dilamar</label>
                  <input type="text" placeholder="Contoh: Graphic Designer" required />
                </div>
                <div className="form-group">
                  <label>Link Portofolio (Google Drive / Behance)</label>
                  <input type="url" placeholder="https://" required />
                </div>
                <div className="form-group">
                  <label>Pesan / Cover Letter</label>
                  <textarea rows="4" placeholder="Tuliskan pesan singkat mengapa Anda cocok untuk posisi ini..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full justify-center">
                  Kirim Lamaran Sekarang
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
