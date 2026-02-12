import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverExternalPackagesでMCP SDKのnode依存を除外
  serverExternalPackages: ['@modelcontextprotocol/sdk'],
  // 日本語パスでTurbopackがクラッシュするためWebpackを使用
  turbopack: undefined,
};

export default nextConfig;
