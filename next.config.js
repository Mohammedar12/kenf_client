/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: "default",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kenf.sa',
        pathname: '/**',
      },
    ],
    deviceSizes: [320 , 420 , 520 , 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: [ "image/webp"],
  },
  i18n
}

module.exports = nextConfig
