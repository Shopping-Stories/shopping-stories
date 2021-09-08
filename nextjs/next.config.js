/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = { topLevelAwait: true }
    return config;
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/about',
  //       destination: '/',
  //     },
  //   ]
  // },
}
