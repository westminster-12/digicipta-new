import { ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Cetak Kemasan Custom Manado: Rahasia Biar Produkmu Nggak Punya "Kembaran"!',
    date: 'August 31, 2026',
    image: 'https://placehold.co/600x400/0d9488/ffffff?text=Kemasan+Custom',
    excerpt: 'Pernah nggak sih kamu beli jajanan lokal di bazar, rasanya enak banget, tapi stiker kemasannya persis merek sebelah?'
  },
  {
    id: 2,
    title: 'Tren Undangan Nikah Akhir Tahun di Manado: Beralih ke Custom Aesthetic!',
    date: 'August 28, 2026',
    image: 'https://placehold.co/600x400/ffcc00/333333?text=Undangan+Nikah',
    excerpt: 'Menjelang akhir tahun sampai awal Januari nanti, jadwal sewa gedung resepsi biasanya sudah full booked.'
  },
  {
    id: 3,
    title: 'Bikin Event E-Sport Bareng Versa: Turnamen Warkop Makin Hype & Pro!',
    date: 'August 22, 2026',
    image: 'https://placehold.co/600x400/0f766e/ffffff?text=Event+E-Sport',
    excerpt: 'Nongkrong di warkop atau kafe seputaran Megamas sampai Tikala emang kurang afdol kalau nggak mabar.'
  },
  {
    id: 4,
    title: 'Kenapa Piala Dunia 2026 Berbeda? Format 48 Tim dan 12 Grup',
    date: 'June 20, 2026',
    image: 'https://placehold.co/600x400/e2e8f0/333333?text=Piala+Dunia',
    excerpt: 'Piala Dunia 2026 menjadi salah satu edisi yang paling menarik untuk dinantikan dengan format baru.'
  }
];

const Article = () => {
  return (
    <div className="page-layout">
      <div className="page-header bg-gradient-tosca">
        <div className="container text-center">
          <h1 className="text-white">Articles & Insights</h1>
          <p className="text-white opacity-90 mt-4">Berita terbaru, tips, dan wawasan seputar dunia desain dan percetakan.</p>
        </div>
      </div>

      <section className="section bg-white">
        <div className="container">
          <div className="article-grid">
            {articles.map(article => (
              <a href="#" key={article.id} className="card article-card" style={{textDecoration: 'none'}}>
                <img src={article.image} alt={article.title} className="article-image" style={{objectFit: 'cover'}} />
                <div className="article-content">
                  <span className="article-date">{article.date}</span>
                  <h3 className="text-primary">{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <span className="read-more text-accent">Read More <ArrowRight size={16} className="ml-2" /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Article;
