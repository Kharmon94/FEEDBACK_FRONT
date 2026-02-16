#!/usr/bin/env node
/**
 * Figma/design repo sync: check and diff.
 * Uses FIGMA_REPO_URL (default: design repo). Run in frontend root.
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FIGMA_REPO_URL = process.env.FIGMA_REPO_URL || 'https://github.com/BlackCollar27/Feedbackpage.git';
const DESIGN_CLONE = path.join(ROOT, '.figma-design-repo');
const STATE_FILE = path.join(ROOT, '.figma-sync-state.json');

const FILES_TO_PRESERVE = [
  'src/services/api.ts',
  'src/types/index.ts',
  'src/utils/permissions.ts',
  'src/app/contexts/AuthContext.tsx',
  'scripts/figma-sync.js',
  '.env.example',
];

function cloneOrPull() {
  if (fs.existsSync(DESIGN_CLONE)) {
    try {
      execSync('git pull --rebase', { cwd: DESIGN_CLONE, stdio: 'pipe' });
    } catch {
      // ignore pull errors
    }
  } else {
    fs.mkdirSync(path.dirname(DESIGN_CLONE), { recursive: true });
    execSync(`git clone --depth 1 "${FIGMA_REPO_URL}" "${DESIGN_CLONE}"`, { stdio: 'pipe' });
  }
}

function collectFiles(dir, base = '') {
  const out = {};
  const rel = (p) => (base ? base + '/' + p : p);
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const r = rel(name);
    if (fs.statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      Object.assign(out, collectFiles(full, r));
    } else {
      out[r] = true;
    }
  }
  return out;
}

function countFiles(dir, base = '') {
  const out = collectFiles(dir, base);
  out.__count = Object.keys(out).filter((k) => k !== '__count').length;
  return out;
}

function check() {
  console.log('FIGMA_REPO_URL:', FIGMA_REPO_URL);
  cloneOrPull();
  const designSrc = path.join(DESIGN_CLONE, 'src');
  const frontendSrc = path.join(ROOT, 'src');
  const designCount = countFiles(designSrc);
  const frontendCount = countFiles(frontendSrc);
  const state = {
    figma_repo_url: FIGMA_REPO_URL,
    design_src_file_count: designCount.__count || 0,
    frontend_src_file_count: frontendCount.__count || 0,
    updated_at: new Date().toISOString(),
  };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log('State written to', STATE_FILE);
  console.log('Design repo src files:', state.design_src_file_count);
  console.log('Frontend src files:', state.frontend_src_file_count);
}

function diff() {
  if (!fs.existsSync(DESIGN_CLONE)) cloneOrPull();
  const designSrc = path.join(DESIGN_CLONE, 'src');
  const frontendSrc = path.join(ROOT, 'src');
  const designFiles = new Set(Object.keys(countFiles(designSrc)).filter((k) => k !== '__count'));
  const frontendFiles = new Set(Object.keys(countFiles(frontendSrc)).filter((k) => k !== '__count'));
  const onlyDesign = [...designFiles].filter((f) => !frontendFiles.has(f));
  const onlyFrontend = [...frontendFiles].filter((f) => !designFiles.has(f));
  console.log('--- Design repo (src) vs Frontend (src) ---');
  console.log('Only in design repo:', onlyDesign.length);
  if (onlyDesign.length) console.log(onlyDesign.slice(0, 30).join('\n'), onlyDesign.length > 30 ? '...' : '');
  console.log('Only in frontend:', onlyFrontend.length);
  if (onlyFrontend.length) console.log(onlyFrontend.slice(0, 30).join('\n'), onlyFrontend.length > 30 ? '...' : '');
  console.log('\nFiles to preserve (integration; do not overwrite when syncing):');
  FILES_TO_PRESERVE.forEach((f) => console.log(' ', f));
}

const cmd = process.argv[2];
if (cmd === 'check') check();
else if (cmd === 'diff') diff();
else {
  console.log('Usage: node figma-sync.js check | diff');
  console.log('  check - clone/pull design repo, compare file counts, write .figma-sync-state.json');
  console.log('  diff  - report design src vs frontend src and list files to preserve');
  process.exit(1);
}
