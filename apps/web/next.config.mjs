/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@hr-assist/shared'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
