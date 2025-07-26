import { getServerSideSitemapLegacy } from "next-sitemap";

export async function getServerSideProps(ctx) {
  const res = await fetch(
    "https://chowspace-backend.vercel.app/api/vendors/getVendors"
  );
  const vendors = await res.json();

  const fields = vendors.flatMap((vendor) => [
    {
      loc: `https://chowspace.ng/menu/${vendor.slug}`,
      lastmod: vendor.updatedAt || new Date().toISOString(),
      changefreq: "daily",
      priority: 0.9,
    },
    {
      loc: `https://chowspace.ng/checkout/${vendor.slug}`,
      lastmod: vendor.updatedAt || new Date().toISOString(),
      changefreq: "daily",
      priority: 0.7,
    },
  ]);

  return getServerSideSitemapLegacy(ctx, fields);
}

export default function Sitemap() {}
