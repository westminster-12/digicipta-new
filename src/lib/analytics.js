import ReactGA from 'react-ga4';

export const trackEvent = (category, action, label) => {
  const consent = localStorage.getItem('cookieConsent');
  if (consent === 'accepted') {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};

export const trackWhatsAppClick = (source) => {
  trackEvent('Contact', 'Click WhatsApp', source);
};
