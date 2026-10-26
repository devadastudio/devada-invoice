/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ne bloque pas le build en production sur Vercel en cas de warnings ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Vérification de typage stricte conservée
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
