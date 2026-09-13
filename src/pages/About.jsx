import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './About.css';

const teamMembers = [
  {
    name: 'Kevin Liemmunandar',
    role: 'CEO',
    img: 'about-us/foto-id/kevin.png',
  },
  {
    name: 'Meylisa Imelda',
    role: 'General Manager',
    img: 'about-us/foto-id/meylisa.png',
  },
  {
    name: 'Vony W Kalo',
    role: 'HRGA',
    img: 'about-us/foto-id/vony.png',
  },
  {
    name: 'Anastazia Warouw',
    role: 'SPV Production',
    img: 'about-us/foto-id/anastasia.png',
  },
  {
    name: 'Dalton Sebastian',
    role: 'SPV Operational',
    img: 'about-us/foto-id/dalton.png',
  },
  {
    name: 'Fernando Senewe',
    role: 'Lead Graphic Designer',
    img: 'about-us/foto-id/nando.png',
  },
  {
    name: 'Debora Runtuwene',
    role: 'Sales Coordinator',
    img: 'about-us/foto-id/debora.png',
  },
];

const values = [
  {
    code: 'S',
    label: 'Sinergitas',
    desc: 'Setiap anggota tim saling mendukung. Ketika satu bagian bermasalah, bagian lain menutup celah.',
  },
  {
    code: 'I',
    label: 'Integritas',
    desc: 'Kami bekerja dengan standar yang sama: jujur ke klien, jujur ke sesama tim.',
  },
  {
    code: 'L',
    label: 'Loyalitas',
    desc: 'Hadir sepenuhnya untuk setiap proyek, dari brief pertama sampai produk di tangan klien.',
  },
  {
    code: 'Etika',
    label: 'Etika',
    desc: 'Saling menghormati adalah fondasi. Profesionalisme bukan soal title, tapi cara kita bekerja bersama.',
  },
];

const missionPoints = [
  'Menyediakan solusi Design & Printing yang mengedepankan kualitas dan kreativitas tinggi melampaui standar pemikiran customer.',
  'Menciptakan sistem alur kerja FASICURE (Fast, Simple, Secure), menampilkannya secara transparan dan real time sehingga bisa diakses kapanpun dan dimanapun oleh customer.',
  'Membangun tim yang mengutamakan budaya kerja SILETIKA (Sinergitas, Integritas, Loyalitas, Etika) serta selalu bersemangat untuk terus berinovasi dan berkembang menciptakan lingkungan kerja yang positif, kolaboratif, dan inklusif.',
  'Terus melakukan ekspansi serta mengembangkan teknologi berbasis Customer Experience sehingga di mata masyarakat bisa dianggap sebagai gaya hidup yang sangat memudahkan segala kebutuhan Design & Printing di tempat mereka.',
  'Memberikan edukasi dan dukungan kepada lingkungan masyarakat sekitar bahwa siapapun berhak memiliki akses Design & Printing yang berkualitas untuk meningkatkan segala aspek dalam kehidupan mereka.',
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">

      {/* ── PAGE HEADER — bukan centered box generik, tapi editorial split ── */}
      <section className="about-header">
        <div className="about-header-inner">
          <div className="about-header-text">
            <span className="section-label section-label-light">Tentang Kami</span>
            <h1>Versa Design Studio</h1>
            <p>
              Berdiri sejak 2018 di Manado, kami menggabungkan desain kreatif dan produksi cetak dalam satu tempat.
              Dari UMKM lokal sampai perusahaan besar, kami bantu bisnis tampil lebih baik melalui visual yang bekerja.
            </p>
          </div>
          <div className="about-header-image">
            <img
              src="about-us/intro.webp"
              alt="Tim Versa Design Studio di kantor"
            />
          </div>
        </div>
      </section>


      {/* ── CERITA — 2 kolom: teks kiri, tahapan kanan ── */}
      <section className="section about-story-section">
        <div className="container">
          <div className="story-layout">
            <div className="story-text-col">
              <span className="section-label">Perjalanan Kami</span>
              <h2>Dimulai dari satu keyakinan</h2>
              <p>
                <b>PT. Versa Digicipta Semesta (Versa Design Studio)</b> lahir di Manado pada 2018 dari keyakinan sederhana: bisnis lokal berhak
                punya visual yang tidak kalah dari merek besar. Saat itu, banyak UMKM di Manado kesulitan menemukan
                vendor yang bisa menangani desain sekaligus produksi dengan standar yang konsisten.
              </p>
              <p>
                Versa hadir untuk menutup celah itu. Kami bangun tim desainer, operator mesin, dan tenaga produksi
                di bawah satu atap, sehingga klien tidak perlu koordinasi ke banyak pihak untuk mendapatkan hasil
                yang mereka bayangkan.
              </p>
              <p>
                Lebih dari 8 tahun kemudian, kami sudah melayani ribuan klien, dari toko kecil di pasar tradisional
                sampai perusahaan dengan kebutuhan branding skala besar, dengan dua lokasi di Manado dan Tahuna.
              </p>
            </div>

            <div className="story-timeline-col">
              <div className="timeline-item">
                <div className="timeline-year">2018</div>
                <div className="timeline-content">
                  <h4>Versa dibuka di Manado</h4>
                  <p>Layanan cetak dan desain pertama, melayani UMKM dan bisnis lokal.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h4>Ekspansi layanan digital</h4>
                  <p>Tim berkembang, layanan diperluas ke branding, signage, dan media promosi event.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h4>Cabang Tahuna dibuka</h4>
                  <p>Menjangkau klien di Kepulauan Sangihe dengan layanan yang sama.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h4>Aplikasi Versavers diluncurkan</h4>
                  <p>Klien bisa pantau status order dan akses promo langsung dari HP.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── VISI MISI — full-width split, tidak ada centered box ── */}
      <section className="vismis-section">
        <div className="vismis-image-col">
          <img
            src="/about-us/AST_3020.webp"
            alt="Tim Versa sedang bekerja di studio"
          />
          {/* <div className="vismis-image-label">
            <span>Studio Manado</span>
          </div> */}
        </div>

        <div className="vismis-content-col">
          <div className="vismis-block">
            <span className="section-label section-label-light">Visi</span>
            <h2 className="text-white">
              Kami membantu orang dengan memberikan solusi desain dan printing berdasarkan kebutuhan bisnis maupun tujuan personal mereka
            </h2>
            <p>
              Visi Versa adalah memastikan setiap bisnis, di manapun mereka berada, bisa mendapatkan kualitas desain dan produksi yang layak.
            </p>
          </div>

          <div className="vismis-divider" />

          <div className="vismis-block">
            <span className="section-label section-label-light">Misi</span>
            <ul className="mission-list">
              {missionPoints.map((point, i) => (
                <li key={i}>
                  <span className="mission-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* ── VALUES — horizontal strip, bukan card grid ── */}
      <section className="section values-section">
        <div className="container">
          <div className="values-header">
            <div>
              <span className="section-label">Budaya Tim — SILETIKA</span>
              <h2>Sinergitas, Integritas, Loyalitas, &amp; Etika</h2>
            </div>
            <p className="values-lead">
              Nilai-nilai ini bukan slogan di dinding. Ini standar yang kami terapkan dalam setiap proyek
              dan setiap interaksi dengan klien.
            </p>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-block">
                <span className="value-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.label}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── TIM — layout editorial: nama besar di atas foto ── */}
      <section className="section team-section">
        <div className="container">
          <div className="team-header">
            <div>
              <span className="section-label">Tim</span>
              <h2>Orang-orang di balik Versa</h2>
            </div>
            <p className="team-lead">
              Versa dijalankan oleh tim yang percaya bahwa desain yang baik bisa mengubah cara orang
              melihat sebuah bisnis.
            </p>
          </div>

          <div className="team-grid leaders-grid">
            {teamMembers.slice(0, 2).map((member, idx) => (
              <div key={`leader-${idx}`} className="team-card">
                <div className="team-photo">
                  <img src={member.img} alt={`Foto ${member.name}`} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="team-grid members-grid">
            {teamMembers.slice(2).map((member, idx) => (
              <div key={`member-${idx}`} className="team-card">
                <div className="team-photo">
                  <img src={member.img} alt={`Foto ${member.name}`} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA — ajakan ── */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-inner">
            <div>
              <h2>Punya proyek yang ingin kami kerjakan bersama?</h2>
              <p>Mulai dengan konsultasi singkat. Tidak ada biaya, tidak ada komitmen.</p>
            </div>
            <div className="about-cta-buttons">
              <a
                href="https://wa.me/628114357393"
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent"
              >
                Hubungi via WhatsApp
              </a>
              <Link to="/portfolio" className="btn btn-outline-white">
                Lihat Portofolio <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
