import { useEffect } from 'react';
import './Portfolio.css';
import SEO from '../components/SEO';

const Portfolio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout">
      <SEO 
        title="Portofolio" 
        description="Lihat karya-karya terbaik dari Versa Design Studio." 
        canonicalUrl="/portfolio" 
      />
      <div className="page-header bg-gradient-tosca">
        <div className="container text-center">
          <h1 className="text-white">Our Portfolio</h1>
          <p className="text-white opacity-90 mt-4">Lihat portofolio dan hasil karya terbaik kami.</p>
        </div>
      </div>

      <section className="section bg-light" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container text-center">
          <h2 className="text-primary mb-4" style={{ fontSize: '2.5rem' }}>Coming Soon</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Halaman portofolio kami sedang dalam tahap penyempurnaan. Kami tidak sabar untuk segera menampilkan karya-karya terbaik kami kepada Anda.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
