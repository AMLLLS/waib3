/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ne pas inclure les modules Node.js côté client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'child_process': false,
        'fs': false,
        'net': false,
        'tls': false,
        'dns': false,
        'aws4': false,
        'timers/promises': false,
        'crypto': false,
        'stream': false,
        'http': false,
        'https': false,
        'os': false,
        'url': false,
        'zlib': false,
        'path': false,
        // Ignorer les dépendances optionnelles de MongoDB
        'kerberos': false,
        '@mongodb-js/zstd': false,
        '@aws-sdk/credential-providers': false,
        'gcp-metadata': false,
        'snappy': false,
        'socks': false,
        'mongodb-client-encryption': false,
      };
    }
    return config;
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig; 