const removeImports = require('next-remove-imports')();

module.exports = removeImports({
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
