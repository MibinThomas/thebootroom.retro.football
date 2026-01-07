/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdfkit", "fontkit"],

    // ✅ Ensure the logo file is included in the serverless bundle
    outputFileTracingIncludes: {
      // include for your route bundle
      "/app/api/teams/**": ["./public/logo.png"],
    },
  },
};

module.exports = nextConfig;
