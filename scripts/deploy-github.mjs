import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, cpSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const source = path.resolve('public');
function git(args, cwd = process.cwd(), capture = false) {
  const result = spawnSync('git', args, { cwd, stdio: capture ? 'pipe' : 'inherit', encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args[0]} failed (${result.status})`);
  return result.stdout || '';
}
// Publish through the same remote this checkout uses, so SSH and HTTPS clones both work.
const repository = git(['remote', 'get-url', 'origin'], process.cwd(), true).trim();
try {
  git(['diff', '--quiet', 'HEAD', '--', 'public']);
  if (git(['ls-files', '--others', '--exclude-standard', '--', 'public'], process.cwd(), true).trim()) {
    throw new Error('Add and commit new public/ files before publishing.');
  }
} catch (error) {
  console.error('Commit all public/ changes before publishing:', error.message);
  process.exit(1);
}
const temporary = mkdtempSync(path.join(os.tmpdir(), 'portfolio-pages-'));
try {
  git(['clone', '--depth=1', '--branch=gh-pages', '--single-branch', repository, temporary]);
  // This is a temporary clone of the dedicated publishing branch.
  git(['rm', '-r', '--quiet', '--ignore-unmatch', '.'], temporary);
  cpSync(source, temporary, { recursive: true });
  git(['add', '--all'], temporary);
  const diff = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: temporary });
  if (diff.status === 0) {
    console.log('GitHub Pages already matches public/.');
  } else if (diff.status === 1) {
    const revision = git(['rev-parse', '--short', 'HEAD'], process.cwd(), true).trim();
    git(['commit', '-m', `Publish website from ${revision}`], temporary);
    git(['push', 'origin', 'gh-pages'], temporary);
  } else throw new Error('Unable to inspect publishing changes.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
