/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gongcha.com.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mealsync.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.vietqr.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vietqr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thanhtu-blog.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fujifoods.vn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
