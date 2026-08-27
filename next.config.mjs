/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  turbopack: {
    rules: {
      "*.svg": {
        type: "asset",
      },
      "*.{png,jpg,jpeg,gif,webp}": {
        type: "asset",
      },
    },
  },
  webpack(config) {
    const assetRule = {
      test: /\.(svg|png|jpg|jpeg|gif|webp)$/i,
      type: "asset/resource",
    };

    config.module.rules.unshift(assetRule);

    return config;
  },
};

export default nextConfig;
