/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://chowspace.ng",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/Login",
    "/Signup",
    "/vendor",
    "/admin",
    "/manager",
    "/Payment-Redirect",
    "/checkout/success",
  ],
  additionalSitemaps: ["https://chowspace.ng/server-sitemap.xml"],
};
