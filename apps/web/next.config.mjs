import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagesDir = path.resolve(__dirname, '../../packages');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@manga/design-system', '@manga/api-contract'],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@manga/design-system$': path.join(packagesDir, 'design-system/src/index.ts'),
      '@manga/design-system/tokens$': path.join(packagesDir, 'design-system/src/tokens/index.ts'),
      '@manga/design-system/native$': path.join(packagesDir, 'design-system/src/native/index.ts'),
      '@manga/design-system/theme.css$': path.join(packagesDir, 'design-system/src/theme.css'),
      '@manga/api-contract$': path.join(packagesDir, 'api-contract/src/index.ts'),
      '@manga/api-contract/triage$': path.join(
        packagesDir,
        'api-contract/src/triage.contract.ts',
      ),
    };
    return config;
  },
};

export default nextConfig;
