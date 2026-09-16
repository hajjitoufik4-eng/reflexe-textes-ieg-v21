const nextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      {
        source: '/prototype/projet-1-refonte.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/prototype/lecture-textes.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
