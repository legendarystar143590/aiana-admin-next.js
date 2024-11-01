/* eslint-disable no-param-reassign */
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ant-design/icons'],
  images: {
    domains: ["cdn.sanity.io", "pbs.twimg.com", "login.aiana.io", "aiana.ams3.digitaloceanspaces.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'nl', 'es', 'fr'],
    defaultLocale: 'en'
  }
}

module.exports = nextConfig
