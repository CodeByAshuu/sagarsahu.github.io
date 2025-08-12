const meta = {
  // Metadata
  siteTitle: 'Sagar Sahu - Creative Web Designer',
  siteDescription:
    'Sagar Sahu - Creative frontEnd web developer who loves javascript and modern web technologies.',
  siteTitleAlt: 'Sagar Sahu',
  siteShortName: 'Sagar Sahu',
  siteUrl: 'https://CodeByAshuu.github.io', // No trailing slash!
};

const social = {
  siteLogo: `src/static/logo.svg`,
  siteBanner: `${meta.siteUrl}/images/social-banner.png`,
  twitter: '@Ashuuu_7',
};

const website = {
  ...meta,
  ...social,
  disqusShortName: 'sagarsahuu',
  googleAnalyticsID: 'G-XXXXXXXXXX', // Replace with your actual GA4 ID
  // Manifest
  themeColor: '#6D83F2',
  backgroundColor: '#6D83F2',
};

module.exports = website;
