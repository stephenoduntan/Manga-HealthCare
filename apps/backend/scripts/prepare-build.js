/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const backendDir = path.resolve(__dirname, '..');
const apiContractDir = path.resolve(backendDir, '../../packages/api-contract');
const apiContractDist = path.join(apiContractDir, 'dist', 'index.js');

function run(cmd, cwd) {
  console.log(`[prepare-build] Running: ${cmd} (cwd: ${cwd})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

if (fs.existsSync(apiContractDir) && !fs.existsSync(apiContractDist)) {
  run('pnpm build', apiContractDir);
}

try {
  run('npx prisma generate', backendDir);
} catch (err) {
  let hasGeneratedClient = false;
  try {
    require.resolve('.prisma/client', { paths: [backendDir] });
    hasGeneratedClient = true;
  } catch {
    hasGeneratedClient = false;
  }

  if (process.platform === 'win32' && hasGeneratedClient) {
    console.warn(
      '[prepare-build] Prisma engine DLL locked on Windows (likely running dev server); using existing generated @prisma/client.',
    );
  } else {
    throw err;
  }
}
