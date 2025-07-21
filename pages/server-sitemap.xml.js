import { getServerSideSitemapLegacy } from "next-sitemap";

export async function getServerSideProps(ctx) {
  const res = await fetch("https://chowspace-backend.vercel.app/api/vendors");
  const vendors = await res.json();

  const fields = vendors.flatMap((vendor) => {
    return [
      {
        loc: `https://chowspace.vercel.app/menu/${vendor.slug}`,
        lastmod: vendor.updatedAt || new Date().toISOString(),
        changefreq: "daily",
        priority: 0.9,
      },
      {
        loc: `https://chowspace.vercel.app/checkout/${vendor.slug}`,
        lastmod: vendor.updatedAt || new Date().toISOString(),
        changefreq: "daily",
        priority: 0.7,
      },
    ];
  });

  return getServerSideSitemapLegacy(ctx, fields);
}

export default function Sitemap() {}
