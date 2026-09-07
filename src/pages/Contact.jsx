import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="page-layout">
      <div className="page-header bg-gradient-tosca">
        <div className="container text-center">
          <h1 className="text-white">Contact Us</h1>
          <p className="text-white opacity-90 mt-4">Hubungi kami untuk konsultasi gratis mengenai kebutuhan Anda.</p>
        </div>
      </div>

      <section className="section bg-light">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info-section">
              <h2 className="text-primary mb-6">Get in Touch</h2>
              
              <div className="contact-cards">
                <div className="card contact-card">
                  <MapPin size={24} className="text-accent mb-4" />
                  <h4>Manado Branch</h4>
                  <p className="text-muted">Jl. Jendral Sudirman No.51, Pinaesaan, Kec. Wenang, Kota Manado</p>
                </div>
                
                <div className="card contact-card">
                  <MapPin size={24} className="text-accent mb-4" />
                  <h4>Tahuna Branch</h4>
                  <p className="text-muted">Jl. Raya Tatehe, Apeng Sembeka, Tahuna</p>
                </div>
                
                <div className="card contact-card">
                  <Clock size={24} className="text-accent mb-4" />
                  <h4>Opening Hours</h4>
                  <p className="text-muted">Senin - Sabtu<br/>09.30 – 20.00 WITA</p>
                </div>

                <div className="card contact-card">
                  <Phone size={24} className="text-accent mb-4" />
                  <h4>Phone & Email</h4>
                  <p className="text-muted">+62 811-435-7393<br/>info@digicipta.com</p>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <div className="card">
                <h3 className="text-primary mb-4">Kirim Pesan</h3>
                <form className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Nama Lengkap</label>
                    <input type="text" id="name" placeholder="Masukkan nama Anda" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Nomor WhatsApp</label>
                    <input type="tel" id="phone" placeholder="Masukkan no WA" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Pesan / Kebutuhan</label>
                    <textarea id="message" rows="5" placeholder="Ceritakan kebutuhan desain atau cetak Anda..."></textarea>
                  </div>
                  <button type="button" className="btn btn-primary" style={{width: '100%'}}>Kirim Pesan</button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="map-placeholder mt-12 bg-white card text-center p-8">
            <img src="https://placehold.co/1200x400/e2e8f0/333333?text=Google+Maps+Placeholder" alt="Map" style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '0.5rem'}} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
