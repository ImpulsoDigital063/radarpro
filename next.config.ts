import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'playwright',
    '@playwright/test',
    'better-sqlite3',
    '@whiskeysockets/baileys',
    'link-preview-js',
    'qrcode-terminal',
    'jimp',
    'sharp',
  ],
  turbopack: {
    // jimp/sharp são deps opcionais do Baileys — silencia warn de módulo ausente
    resolveAlias: {
      jimp: { browser: '@whiskeysockets/baileys' },
    },
  },
};

export default nextConfig;
