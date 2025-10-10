import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', 
        hostname: '204.197.173.249',
        port: '8014', 
        pathname: '/storage/**', 
      },
    ],

    domains: [
      "peru-stork-399467.hostingersite.com", 
      "kashasears.codexwizardssquad.com"    
    ],
  },
  async rewrites() {
    return[
      {
        source:'/api/:path*',
        destination:'http://https://zealous-tree-30379.pktriot.net/api/:path*'
      }
    ]
  },
};

export default nextConfig;
