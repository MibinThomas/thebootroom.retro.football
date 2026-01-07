/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdfkit", "fontkit"],
    outputFileTracingIncludes: {
      "/api/teams": ["./public/logo.png"],
    },
  },
};

module.exports = nextConfig;
