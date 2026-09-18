import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <img
            src={isScrolled ? "/LOGOVERSA.png" : "/logo-white-hor.png"}
            alt="Versa Logo"
            className="logo-img"
            width="300"
            height="100"
            style={{ height: '100px', width: 'auto' }}
          />
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/about-us" onClick={toggleMenu}>About Us</Link>
          <Link to="/portfolio" onClick={toggleMenu}>Portfolio</Link>
          <Link to="/article" onClick={toggleMenu}>Article</Link>
          <Link to="/career" onClick={toggleMenu}>Career</Link>
          <Link to="/contact" onClick={toggleMenu} className="btn btn-primary ml-4">Contact Us</Link>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
