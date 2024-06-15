/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['mongoose']
    },
    images: {
        domains: ['m.media-amazon.com']
    },
    output: "export",
};

module.exports = nextConfig;
