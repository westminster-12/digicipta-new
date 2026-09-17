import { MapPin, Phone, Mail, MessageCircle, Share2, Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img 
            src="/logo-white-hor.png" 
            alt="Versa Logo" 
            className="logo-img-footer mb-4" 
            width="600" 
            height="200" 
            style={{ height: '200px', width: 'auto', marginBottom: '1px' }} 
          />
          <p className="footer-desc">
            Kualitas, Kepercayaan, dan Kepuasan Pelanggan adalah prioritas utama kami. Kami memberikan solusi terbaik yang lebih dari sekedar produk.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><MessageCircle size={20} /></a>
            <a href="#" className="social-icon"><Share2 size={20} /></a>
            <a href="#" className="social-icon"><Globe size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/article">Article</a></li>
            <li><a href="/career">Career</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <MapPin size={20} className="text-primary flex-shrink-0" />
              <div>
                <strong>Manado:</strong> Jl. Jendral Sudirman No.51, Pinaesaan, Kec. Wenang
              </div>
            </li>
            <li>
              <MapPin size={20} className="text-primary flex-shrink-0" />
              <div>
                <strong>Tahuna:</strong> Jl. Raya Tatehe, Apeng Sembeka, Tahuna
              </div>
            </li>
            <li>
              <Phone size={20} className="text-primary flex-shrink-0" />
              <span>+62 811-435-7393</span>
            </li>
            <li>
              <Mail size={20} className="text-primary flex-shrink-0" />
              <span>info@digicipta.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} PT. Versa Digicipta Semesta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
