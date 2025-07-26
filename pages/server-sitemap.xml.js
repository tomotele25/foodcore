import { getServerSideSitemapLegacy } from "next-sitemap";

export async function getServerSideProps(ctx) {
  try {
    const res = await fetch(
      "https://chowspace-backend.vercel.app/api/vendor/getVendors"
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch vendors, status: ${res.status}`);
    }
    const data = await res.json();
    const vendors = data.vendors || [];

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
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return {
      notFound: true,
    };
  }
}

export default function Sitemap() {
  return null;
}
