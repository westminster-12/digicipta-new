import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonicalUrl }) {
  const siteUrl = 'https://domainanda.com'; // Ganti dengan domain asli Anda (misalnya https://versadesign.com)
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      <title>{title ? `${title} | Versa Design` : 'Versa Design'}</title>
      <meta name="description" content={description || 'Versa Design - Your description here'} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title || 'Versa Design'} />
      <meta property="og:description" content={description || 'Versa Design - Your description here'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title || 'Versa Design'} />
      <meta property="twitter:description" content={description || 'Versa Design - Your description here'} />
    </Helmet>
  );
}
