import React, { useState } from 'react';
import { 
  Users, Shield, Heart, Lightbulb, Zap, CheckCircle, Lock, 
  Briefcase, TrendingUp, Monitor, Gift, GraduationCap, 
  Smile, UsersRound, PenTool, BarChart, Settings, Code, 
  Calculator, Package, ArrowRight, Check, ChevronDown
} from 'lucide-react';
import './Career.css';

const Career = () => {
  const [activeTab, setActiveTab] = useState('lowongan');

  const coreValues = [
    { icon: <Users size={24} />, title: "Sinergitas", desc: "Saling support dalam tim untuk mencapai target bersama." },
    { icon: <Shield size={24} />, title: "Integritas", desc: "Bekerja dengan kejujuran dan komitmen tinggi." },
    { icon: <Heart size={24} />, title: "Loyalitas", desc: "Hadir dengan sepenuh hati dan selalu berkontribusi." },
    { icon: <CheckCircle size={24} />, title: "Etika", desc: "Saling menghormati dan menjaga profesionalisme dalam bekerja." },
    { icon: <Zap size={24} />, title: "Fast", desc: "Fokus dalam meningkatkan kapasitas kerja." },
    { icon: <Lightbulb size={24} />, title: "Simple", desc: "Aktif mencari solusi yang paling efisien dan efektif." },
    { icon: <Lock size={24} />, title: "Secure", desc: "Memiliki standard kualitas tinggi dalam bekerja." },
  ];

  const reasons = [
    { title: "Kreativitas Tanpa Batas", desc: "Kamu bisa mengembangkan dan menciptakan tren baru. Di Versa, setiap ide dihargai dan dikembangkan bersama." },
    { title: "Tim Solid & Fun", desc: "Lingkungan kerja yang suportif, seru, dan selalu update dengan tren terkini." },
    { title: "Perkembangan Karir", desc: "Kesempatan belajar, mengasah skill, dan mengeksplorasi strategi terbaik untuk sukses di bidangmu." },
    { title: "Teknologi & Inovasi", desc: "Versa adalah pionir dalam design & printing yang terintegrasi dengan aplikasi tracking order dan loyalty program." },
    { title: "Sistem Rewards Transparan", desc: "Performa kerja dihargai dengan nyata melalui sistem Rewards and Consequence (RAC)." },
    { title: "Budaya Kerja Positif", desc: "Menerapkan Culture SILETIKA untuk menciptakan lingkungan kerja yang sehat dan saling menghargai." },
    { title: "Inovasi Tanpa Batas", desc: "Versa terus berkembang dan bereksperimen dengan teknologi baru, termasuk Bikinin dan Versavers Apps." },
  ];

  const benefits = [
    { title: "Bonus Mingguan", desc: "Semakin produktif dan sehat, semakin banyak cuan!" },
    { title: "Rating & Reward", desc: "Penilaian berbasis performa yang berdampak langsung pada pendapatanmu." },
    { title: "BPJS Ketenagakerjaan", desc: "Memberikan kenyamanan dan keamanan dalam bekerja." },
    { title: "Extra Stars & Keuntungan", desc: "Reward spesial untuk kontribusi luar biasa dan inovasi." },
    { title: "Tabungan Investasi", desc: "Reward yang dapat diinvestasikan untuk masa depan dan perkembangan Versa." },
    { title: "Pelatihan & Pengembangan", desc: "Akses ke pelatihan dan mentoring untuk meningkatkan keterampilanmu." },
    { title: "Lingkungan Kerja Fun", desc: "Budaya kerja yang penuh kolaborasi, kreativitas, dan semangat inovasi." },
    { title: "Event & Gathering", desc: "Acara rutin untuk membangun kebersamaan dan memperkuat hubungan antar tim." },
  ];

  const departments = [
    {
      title: "Creative Design Team",
      icon: <PenTool size={28} />,
      positions: [
        { name: "Graphic Designer", desc: "Membuat desain produk cetak & branding." },
        { name: "Lead Graphic Designer", desc: "Memimpin tim desain & memastikan kualitas visual." },
        { name: "Content Creator", desc: "Mengelola konten visual & sosial media." },
        { name: "Designer Bikinin", desc: "Membuat & mengunggah artwork untuk platform Bikinin." },
        { name: "Head of Creative Design", desc: "Memimpin seluruh team Designer dan Content Creator." }
      ]
    },
    {
      title: "Sales & Marketing",
      icon: <BarChart size={28} />,
      positions: [
        { name: "Sales Advisor", desc: "Melayani & menangani kebutuhan pelanggan." },
        { name: "Sales B2B", desc: "Menargetkan klien korporat & bisnis besar." },
        { name: "Sales Coordinator", desc: "Mengawasi dan mengoptimalkan tim sales." },
        { name: "Marketing Team", desc: "Merancang strategi pemasaran digital & offline." },
        { name: "Marketing Lead", desc: "Memimpin tim marketing & branding." },
        { name: "CRM", desc: "Mengelola hubungan pelanggan, loyalty program, & after-sales service." },
        { name: "Sales & Marketing Head", desc: "Memimpin Seluruh Team Sales & Marketing termasuk team CRM." }
      ]
    },
    {
      title: "Production & Operational",
      icon: <Settings size={28} />,
      positions: [
        { name: "SPV Production", desc: "Mengawasi seluruh proses produksi." },
        { name: "Lead Operator", desc: "Memastikan kelancaran operasional mesin cetak." },
        { name: "Operator Mesin", desc: "Menjalankan mesin printing, finishing, dan lainnya." },
        { name: "Lead Finishing", desc: "Mengawasi tim finishing produk cetak." },
        { name: "Team Finishing", desc: "Bertugas melakukan proses akhir (laminasi, potong, jilid)." },
        { name: "Team Branding", desc: "Pemasangan branding seperti sticker & signage." },
        { name: "SPV Operational", desc: "Mengelola proses operasional secara keseluruhan." },
        { name: "Team Advertising", desc: "Bertanggung jawab atas produksi & pemasangan materi promosi." },
        { name: "Ops Head", desc: "Memimpin Seluruh Team Production & Operational." }
      ]
    },
    {
      title: "IT & Development",
      icon: <Code size={28} />,
      positions: [
        { name: "IT Manager", desc: "Memimpin pengembangan teknologi internal & sistem." },
        { name: "Data Specialist", desc: "Menganalisis & mengelola data bisnis." },
        { name: "Data Entry", desc: "Memasukkan & memperbarui data produk." },
        { name: "Data Content Specialist", desc: "Melengkapi data produk & artwork." },
        { name: "IT Support", desc: "Menangani troubleshooting sistem & jaringan." },
        { name: "Back End Developer", desc: "Pengembangan sisi server dari aplikasi dan sistem." },
        { name: "Front End Developer", desc: "Pengembangan (UI/UX) dari sisi customer end." },
        { name: "AI Engineer", desc: "Menerapkan teknologi ML, DL, dan AI lainnya." }
      ]
    },
    {
      title: "Finance & Accounting",
      icon: <Calculator size={28} />,
      positions: [
        { name: "Finance Manager", desc: "Mengelola keuangan & memimpin Team Finance & Accounting." },
        { name: "Finance Accountant", desc: "Mengurus Pembukuan Keuangan Cashflow, Laba/Rugi, Asset." },
        { name: "Accounting Payable", desc: "Mengurus pembayaran & laporan keuangan." },
        { name: "Receivable Team", desc: "Mengelola pembayaran pelanggan & tagihan." }
      ]
    },
    {
      title: "Warehouse, Purchasing & HR",
      icon: <Package size={28} />,
      positions: [
        { name: "SPV Warehouse", desc: "Mengawasi manajemen gudang & stok barang." },
        { name: "Warehouse Team", desc: "Menangani penyimpanan & distribusi barang." },
        { name: "Purchasing Team", desc: "Mengurus pengadaan barang & vendor." },
        { name: "HRGA", desc: "Mengurus rekrutmen, pengembangan karyawan, & administrasi." }
      ]
    }
  ];

  return (
    <div className="page-layout">
      <div className="page-header bg-gradient-tosca">
        <div className="container text-center">
          <h1 className="text-white">Career Opportunities</h1>
          <p className="text-white opacity-90 mt-4">Bergabunglah dengan Versa Design Studio dan Ciptakan Perubahan!</p>
        </div>
      </div>

      <section className="section bg-light">
        <div className="container">
          
          <p className="career-intro">
            Di Versa Design Studio, kami percaya bahwa setiap individu adalah bagian penting dari eksplorasi kreatif dan inovasi. Kami tidak hanya mencari karyawan, tapi partner untuk berkembang bersama. Jika kamu penuh semangat, kreatif, dan siap bikin gebrakan, ini saatnya menjadi bagian dari tim kami!
          </p>

          <div className="career-tabs">
            <button 
              className={`tab-button ${activeTab === 'lowongan' ? 'active' : ''}`}
              onClick={() => setActiveTab('lowongan')}
            >
              <Briefcase size={20} /> Posisi Tersedia
            </button>
            <button 
              className={`tab-button ${activeTab === 'budaya' ? 'active' : ''}`}
              onClick={() => setActiveTab('budaya')}
            >
              <UsersRound size={20} /> Budaya & Nilai
            </button>
            <button 
              className={`tab-button ${activeTab === 'keuntungan' ? 'active' : ''}`}
              onClick={() => setActiveTab('keuntungan')}
            >
              <Gift size={20} /> Keuntungan
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'lowongan' && (
              <div className="tab-pane slide-in">
                <div className="departments-grid">
                  {departments.map((dept, idx) => (
                    <div key={idx} className="department-card">
                      <h3 className="department-title">
                        {dept.icon} {dept.title}
                      </h3>
                      <div className="positions-list">
                        {dept.positions.map((pos, pIdx) => (
                          <div key={pIdx} className="position-item">
                            <h5>{pos.name}</h5>
                            <p>{pos.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'budaya' && (
              <div className="tab-pane slide-in">
                <h2 className="section-title">Core Values <span>SILETIKA</span></h2>
                <div className="core-values-grid">
                  {coreValues.map((value, idx) => (
                    <div key={idx} className="value-card">
                      <div className="value-icon">{value.icon}</div>
                      <div className="value-content">
                        <h3>{value.title}</h3>
                        <p>{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="section-title mt-12">Kenapa Gabung dengan <span>Versa?</span></h2>
                <div className="reasons-grid">
                  {reasons.map((reason, idx) => (
                    <div key={idx} className="benefit-card">
                      <Check className="text-primary mt-1" size={20} style={{ flexShrink: 0 }} />
                      <div>
                        <h4>{reason.title}</h4>
                        <p>{reason.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'keuntungan' && (
              <div className="tab-pane slide-in">
                <h2 className="section-title">Keuntungan <span>Bergabung</span></h2>
                <div className="benefits-grid">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-card">
                      <Gift className="text-primary mt-1" size={20} style={{ flexShrink: 0 }} />
                      <div>
                        <h4>{benefit.title}</h4>
                        <p>{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cta-section">
            <h2>Siap Berkembang Bersama Kami?</h2>
            <p>Jadilah bagian dari tim inovatif kami dan capai potensi maksimalmu.</p>
            <a href="mailto:hrd@digicipta.com" className="cta-button">
              Kirim CV & Portfolio <ArrowRight size={18} />
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Career;
