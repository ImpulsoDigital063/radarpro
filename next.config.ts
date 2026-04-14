import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['playwright', '@playwright/test', 'better-sqlite3'],
};

export default nextConfig;
