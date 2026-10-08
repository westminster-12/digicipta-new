import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    } else if (consent === 'accepted') {
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
      if (gaId) {
        ReactGA.initialize(gaId);
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
      ReactGA.initialize(gaId);
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        Kami menggunakan cookies untuk menganalisis trafik dan meningkatkan pengalaman Anda di website ini.
      </p>
      <div style={styles.buttons}>
        <button onClick={handleDecline} style={styles.declineBtn}>Tolak</button>
        <button onClick={handleAccept} style={styles.acceptBtn}>Terima</button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-bg, #1e1e24)',
    color: 'var(--color-text, #fff)',
    padding: '1rem 2rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    zIndex: 9999,
    boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
    borderTop: '1px solid var(--color-border, #333)',
    flexWrap: 'wrap',
  },
  text: {
    margin: 0,
    fontSize: '0.9rem',
    textAlign: 'left',
    maxWidth: '600px',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
  },
  acceptBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'var(--color-primary, #ff3b30)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'opacity 0.2s',
  },
  declineBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'transparent',
    color: 'var(--color-text-muted, #999)',
    border: '1px solid var(--color-border, #444)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};
