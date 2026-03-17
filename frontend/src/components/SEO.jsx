import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '' }) {
  const siteName = 'Sumit Sah | Portfolio';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription =
    'Full Stack Developer specializing in React, Node.js, and modern web technologies. View my projects, skills, and experience.';
  const siteUrl = 'https://sumitsah.dev';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="author" content="Sumit Sah" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={`${siteUrl}${path}`} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />

      {/* Canonical */}
      <link rel="canonical" href={`${siteUrl}${path}`} />
    </Helmet>
  );
}
