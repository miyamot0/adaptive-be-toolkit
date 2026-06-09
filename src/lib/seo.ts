export function createMetaTags({
  pageName,
  content,
}: {
  pageName: string;
  content?: string;
}) {
  const baseTitle = "Adaptive BE Toolkit";

  // Handle dev vs prod for URL - stub during build, real value at runtime
  const baseUrl = import.meta.env.PROD
    ? `${import.meta.env.VITE_SITE_URL || "https://adaptive-be-toolkit.example.com"}`
    : `http://localhost:${import.meta.env.PORT || 5173}`;

  return {
    title: `${pageName} - ${baseTitle}`,
    meta: [
      // Basic SEO Meta Tags
      {
        name: "description",
        content:
          content ||
          `This is the ${pageName.toLowerCase()} page of the Adaptive BE Toolkit.`,
      },

      // Open Graph / Social Media Meta Tags
      { property: "og:title", content: `${pageName} - ${baseTitle}` },
      {
        property: "og:description",
        content:
          content ||
          `This is the ${pageName.toLowerCase()} page of the Adaptive BE Toolkit.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${baseUrl}/` },

      // Twitter Card Meta Tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${pageName} - ${baseTitle}` },
      {
        name: "twitter:description",
        content:
          content ||
          `This is the ${pageName.toLowerCase()} page of the Adaptive BE Toolkit.`,
      },

      // Additional SEO Meta Tags
      { name: "robots", content: "index, follow" },
    ],
  };
}
