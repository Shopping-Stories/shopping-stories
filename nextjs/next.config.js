const withAntdLess = require('next-plugin-antd-less');

/** @type {import('next').NextConfig} */
module.exports = withAntdLess({
  lessVarsFilePath: './styles/variables.less',
  reactStrictMode: true,
  webpack: function (config, options) {
    // config.experiments = { topLevelAwait: true }
    return config;
  },
  webpack5: false,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION,
    NEXT_PUBLIC_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
    NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
  },
});
