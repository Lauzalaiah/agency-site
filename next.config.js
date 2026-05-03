const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com;
              frame-src https://challenges.cloudflare.com;
              connect-src 'self' https://challenges.cloudflare.com;
              img-src 'self' data:;
              style-src 'self' 'unsafe-inline';
            `.replace(/\n/g, ""),
          },
        ],
      },
    ]
  },
}

export default nextConfig
