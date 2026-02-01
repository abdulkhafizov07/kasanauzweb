const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

// ✅ Your site domain
const SITE_URL = 'https://kasana.uz';

// ✅ Your public routes
const routes = [
    '/',
    '/about',
    '/partners',
    '/contacts',
    '/shop',
    '/announcements',
    '/news',
    '/courses',
    '/auth/login/',
    '/auth/register/'
];

// 🛠️ Create sitemap stream
const sitemap = new SitemapStream({ hostname: SITE_URL });

const writeStream = createWriteStream(
    path.resolve(__dirname, 'public', 'sitemap.xml')
);

streamToPromise(sitemap)
    .then(() => console.log('✅ Sitemap generated at public/sitemap.xml'))
    .catch(console.error);

sitemap.pipe(writeStream);

// 📌 Add each route to sitemap
routes.forEach(route => {
    sitemap.write({
        url: route,
        changefreq: 'daily',
        priority: route === '/' ? 1.0 : 0.7,
    });
});

sitemap.end();
