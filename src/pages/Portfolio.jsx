import { useState } from 'react';
import { Search } from 'lucide-react';
import './Portfolio.css';

const portfolioData = [
  { id: 1, title: 'Corporate Branding', category: 'Branding', image: 'https://placehold.co/600x400/0d9488/ffffff?text=Branding' },
  { id: 2, title: 'Neon Signage', category: 'Signage', image: 'https://placehold.co/600x400/ffcc00/333333?text=Neon+Sign' },
  { id: 3, title: 'Company Profile Book', category: 'Print', image: 'https://placehold.co/600x400/0f766e/ffffff?text=Print+Book' },
  { id: 4, title: 'Custom T-Shirt', category: 'Merchandise', image: 'https://placehold.co/600x400/e2e8f0/333333?text=T-Shirt' },
  { id: 5, title: 'Acrylic Display', category: 'Signage', image: 'https://placehold.co/600x400/0d9488/ffffff?text=Acrylic' },
  { id: 6, title: 'Event Backdrop', category: 'Print', image: 'https://placehold.co/600x400/ffcc00/333333?text=Backdrop' },
];

const categories = ['All', 'Branding', 'Signage', 'Print', 'Merchandise'];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = portfolioData.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-layout">
      <div className="page-header bg-gradient-tosca">
        <div className="container text-center">
          <h1 className="text-white">Our Portfolio</h1>
          <p className="text-white opacity-90 mt-4">Lihat portofolio dan hasil karya terbaik kami.</p>
        </div>
      </div>

      <section className="section bg-light">
        <div className="container">
          <div className="portfolio-controls mb-8">
            <div className="search-bar-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari portofolio berdasarkan judul atau kategori..." 
                  className="portfolio-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-scroll-container mt-6">
              <div className="filter-buttons">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    className={`btn filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="portfolio-grid">
            {filteredData.map(item => (
              <div key={item.id} className="portfolio-card card">
                <div className="portfolio-image-wrapper">
                  <img src={item.image} alt={item.title} className="portfolio-image" />
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-category text-accent">{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="text-center w-full py-12" style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: 'var(--color-text-light)' }}>Tidak ada portofolio yang sesuai dengan pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
