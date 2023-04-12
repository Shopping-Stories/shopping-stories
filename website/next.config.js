/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        })
      // .test(/\.mjs$/)
      // .include()
      // .add(/node_modules/).end()
      // .type('javascript/auto')
    // config.optimization.splitChunks.cacheGroups = { }
    // config.optimization.minimize = true;
    // config.experiments = { topLevelAwait: true }
    return config
  },
  webpack5: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
    NEXT_PUBLIC_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    NEXT_PUBLIC_COGNITO_BUCKET: process.env.NEXT_PUBLIC_COGNITO_BUCKET,
  },
}
