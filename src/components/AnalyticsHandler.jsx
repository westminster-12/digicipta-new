import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

let isInitialized = false;

export default function AnalyticsHandler() {
  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    console.log('Analytics Debug -> Consent:', consent, '| GA ID:', gaId);

    if (consent === 'accepted' && gaId) {
      if (!isInitialized) {
        ReactGA.initialize(gaId);
        isInitialized = true;
      }
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
  }, [location]);

  return null;
}
