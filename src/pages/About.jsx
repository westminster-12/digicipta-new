import './About.css';
import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    { name: "Kevin Liem Munandar", role: "CEO", img: "https://placehold.co/400x500/0d9488/ffffff?text=Kevin" },
    { name: "Meylisa Imelda", role: "General Manager", img: "https://placehold.co/400x500/0d9488/ffffff?text=Meylisa" },
    { name: "Vony W Kalo", role: "HRGA", img: "https://placehold.co/400x500/0d9488/ffffff?text=Vony" },
    { name: "Anastazia Warouw", role: "SPV Production", img: "https://placehold.co/400x500/0d9488/ffffff?text=Anastazia" },
    { name: "Dalton Sebastian", role: "SPV Operational", img: "https://placehold.co/400x500/0d9488/ffffff?text=Dalton" },
    { name: "Fernando Senewe", role: "Lead Graphic Designer", img: "https://placehold.co/400x500/0d9488/ffffff?text=Fernando" },
    { name: "Debora Runtuwene", role: "Sales Coordinator", img: "https://placehold.co/400x500/0d9488/ffffff?text=Debora" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero bg-gradient-tosca">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title text-white">About Us</h1>
            <p className="hero-subtitle text-accent">Kualitas, Kepercayaan, dan Kepuasan Pelanggan adalah prioritas utama kami.</p>
          </div>
        </div>
        <div className="hero-shape-divider">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* Story Section */}
      <section className="section story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image-wrapper delay-100 animate-fade-in">
              <div className="story-image-main">
                <img src="https://placehold.co/600x800/0f766e/ffffff?text=Versa+Design+Studio" alt="Versa Design Studio" />
              </div>
              <div className="story-image-floating glass-card">
                <h3>Sejak 2018</h3>
                <p>Berpengalaman di Manado</p>
              </div>
            </div>
            <div className="story-content delay-200 animate-fade-in">
              <h2 className="section-title">Our Story</h2>
              <div className="title-underline"></div>
              <p className="story-text">
                PT. Versa Digicipta Semesta, yang lebih dikenal dengan nama <span className="text-primary font-bold">Versa Design Studio</span>, telah berdiri dengan kokoh sejak tahun 2018 di Manado, Sulawesi Utara. Sebagai perusahaan yang berpengalaman dalam bidang desain dan percetakan, kami telah berkontribusi dalam mewujudkan visi berbagai klien melalui solusi yang kreatif dan inovatif.
              </p>
              <p className="story-text mt-4">
                Kami adalah tim profesional yang berpengalaman di bidang desain dan percetakan, siap memberikan solusi kreatif untuk setiap kebutuhan Anda. Dengan teknologi percetakan terkini dan desain yang inovatif, kami menghasilkan produk berkualitas tinggi, mulai dari branding, signage, hingga berbagai media promosi.
              </p>
              <div className="stats-grid mt-6">
                <div className="stat-item">
                  <h3 className="text-primary">6+</h3>
                  <p>Tahun Pengalaman</p>
                </div>
                <div className="stat-item">
                  <h3 className="text-primary">100%</h3>
                  <p>Kualitas Terjamin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="vmv-section-split">
        <div className="vmv-image-col">
          <img src="https://placehold.co/800x1000/cccccc/333333?text=Workshop+Activity" alt="Working" />
        </div>
        <div className="vmv-content-col bg-primary-dark">
          <div className="vmv-content-inner">
            <div className="vmv-block mb-12">
              <h2 className="vmv-title-split text-white">OUR VISION</h2>
              <p className="text-white text-opacity-90">
                Menjadi Panggung Terdepan Yang Selalu Tanpa Batas Melakukan Inovasi Terhadap Segala Aspek Design & Printing Bagi Masyarakat Luas.
              </p>
            </div>
            
            <div className="vmv-block">
              <h2 className="vmv-title-split text-white">OUR MISSION</h2>
              <ul className="mission-list-split text-white text-opacity-90">
                <li>Menyediakan solusi Design & Printing yang mengedepankan kualitas dan kreativitas tinggi melampaui standar pemikiran customer.</li>
                <li>Menciptakan sistem alur kerja yang Fast & Simple & Secure, menampilkannya secara transparan dan real time sehingga bisa diakses kapanpun dan dimanapun oleh customer.</li>
                <li>Membangun tim yang terdiri dari individu-individu yang mengutamakan nilai Sinergitas, Integritas, Loyalitas, Etika dan selalu bersemangat untuk terus berinovasi dan berkembang serta menciptakan lingkungan kerja yang positif, kolaboratif, dan inklusif yang mendorong kreativitas dan pengembangan diri.</li>
                <li>Terus melakukan ekspansi serta mengembangkan teknologi berbasis Customer Experience sehingga di mata masyarakat bisa dianggap sebagai gaya hidup yang sangat memudahkan segala kebutuhan Design & Printing di tempat mereka.</li>
                <li>Memberikan edukasi dan dukungan kepada lingkungan masyarakat sekitar bahwa siapapun berhak memiliki akses Design & Printing yang berkualitas untuk meningkatkan segala aspek dalam kehidupan mereka.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="section team-section bg-bg-light">
        <div className="container">
          <div className="team-header text-center mb-10 delay-100 animate-fade-in">
            <h4 className="text-accent font-bold mb-2">Team</h4>
            <h2 className="section-title text-primary-dark">Our Expert Team</h2>
          </div>
          
          <div className="team-grid top-row delay-200 animate-fade-in">
            {teamMembers.slice(0, 3).map((member, idx) => (
              <div className="team-card" key={idx}>
                <div className="team-image-wrapper">
                  <img src={member.img} alt={member.name} />
                  <div className="team-branding">
                    <span className="bg-text">VERSA</span>
                  </div>
                </div>
                <div className="team-info glass-info">
                  <h3 className="team-name text-primary-dark">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="team-grid bottom-row mt-8 delay-300 animate-fade-in">
            {teamMembers.slice(3).map((member, idx) => (
              <div className="team-card" key={idx}>
                <div className="team-image-wrapper">
                  <img src={member.img} alt={member.name} />
                  <div className="team-branding">
                    <span className="bg-text">VERSA</span>
                  </div>
                </div>
                <div className="team-info glass-info">
                  <h3 className="team-name text-primary-dark">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
