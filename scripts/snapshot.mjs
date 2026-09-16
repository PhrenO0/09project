#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(scriptDirectory);
const workDirectory = join(repositoryRoot, '.work');

function runGit(args, { binary = false } = {}) {
  try {
    const output = execFileSync('git', args, {
      cwd: repositoryRoot,
      encoding: binary ? 'buffer' : 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    return { ok: true, output: binary ? output : output.trimEnd() };
  } catch (error) {
    const detail = Buffer.isBuffer(error.stderr)
      ? error.stderr.toString('utf8')
      : String(error.stderr ?? error.message ?? 'unknown git error');
    return { ok: false, error: detail.trim() || 'git command failed' };
  }
}

function parsePorcelain(output) {
  const entries = [];
  const fields = output.toString('utf8').split('\0');
  for (let index = 0; index < fields.length - 1; index += 1) {
    const field = fields[index];
    if (!field) continue;
    const entry = { index: field.slice(0, 1), worktree: field.slice(1, 2), path: field.slice(3) };
    if ('RC'.includes(entry.index)) entry.originalPath = fields[++index] ?? '';
    entries.push(entry);
  }
  return entries;
}

async function checkpointSummary() {
  const checkpointPath = join(repositoryRoot, 'CHECKPOINT.md');
  if (!existsSync(checkpointPath)) return { exists: false, excerpt: '' };
  const text = await readFile(checkpointPath, 'utf8');
  return {
    exists: true,
    excerpt: text.split(/\r?\n/).slice(0, 40).join('\n').slice(0, 6000),
  };
}

async function packageScripts() {
  const appsDirectory = join(repositoryRoot, 'apps');
  if (!existsSync(appsDirectory)) return [];
  const children = await readdir(appsDirectory, { withFileTypes: true });
  const summaries = [];
  for (const child of children) {
    if (!child.isDirectory()) continue;
    const packagePath = join(appsDirectory, child.name, 'package.json');
    if (!existsSync(packagePath)) continue;
    try {
      const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
      summaries.push({ path: relative(repositoryRoot, packagePath), name: pkg.name ?? null, scripts: pkg.scripts ?? {} });
    } catch (error) {
      summaries.push({ path: relative(repositoryRoot, packagePath), error: `package.json could not be read: ${error.message}` });
    }
  }
  return summaries;
}

async function atomicWrite(path, text) {
  const temporaryPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryPath, text, 'utf8');
  await rename(temporaryPath, path);
}

async function main() {
  const branch = runGit(['symbolic-ref', '--short', '-q', 'HEAD']);
  const head = runGit(['rev-parse', '--verify', 'HEAD']);
  const status = runGit(['status', '--porcelain=v1', '-z'], { binary: true });
  const diffstat = runGit(['diff', '--stat']);
  const stagedDiffstat = runGit(['diff', '--cached', '--stat']);
  const snapshot = {
    generatedAt: new Date().toISOString(),
    repositoryRoot,
    git: {
      branch: branch.ok ? branch.output || null : { error: branch.error },
      head: head.ok ? head.output : { error: head.error },
      status: status.ok ? parsePorcelain(status.output) : { error: status.error },
      diffstat: diffstat.ok ? diffstat.output : { error: diffstat.error },
      stagedDiffstat: stagedDiffstat.ok ? stagedDiffstat.output : { error: stagedDiffstat.error },
    },
    checkpoint: await checkpointSummary(),
    appPackages: await packageScripts(),
    resumeCommand: `node "${join(repositoryRoot, 'scripts', 'snapshot.mjs')}"`,
  };
  const resume = [
    '# Resume snapshot',
    '',
    `Generated: ${snapshot.generatedAt}`,
    `Resume: \`${snapshot.resumeCommand}\``,
    '',
    'This file is generated locally. It does not change Git, kill processes, read environment variables, or print secrets.',
    'CHECKPOINT.md is human-authored and was read without modification.',
    '',
    '## Git',
    '',
    `- Branch: ${typeof snapshot.git.branch === 'string' ? snapshot.git.branch ?? '(detached)' : `ERROR: ${snapshot.git.branch.error}`}`,
    `- HEAD: ${typeof snapshot.git.head === 'string' ? snapshot.git.head : `ERROR: ${snapshot.git.head.error}`}`,
    `- Status: ${Array.isArray(snapshot.git.status) ? `${snapshot.git.status.length} path(s)` : `ERROR: ${snapshot.git.status.error}`}`,
    `- Working diffstat: ${typeof snapshot.git.diffstat === 'string' ? snapshot.git.diffstat || '(none)' : `ERROR: ${snapshot.git.diffstat.error}`}`,
    `- Staged diffstat: ${typeof snapshot.git.stagedDiffstat === 'string' ? snapshot.git.stagedDiffstat || '(none)' : `ERROR: ${snapshot.git.stagedDiffstat.error}`}`,
    '',
    '## Checkpoint excerpt',
    '',
    snapshot.checkpoint.exists ? snapshot.checkpoint.excerpt || '(empty)' : 'CHECKPOINT.md was not found.',
    '',
    '## App scripts',
    '',
    ...snapshot.appPackages.map((pkg) => `- ${pkg.path}: ${pkg.error ?? (Object.keys(pkg.scripts).join(', ') || '(no scripts)')}`),
    '',
    'Read .work/latest.json for machine-readable details before replaying work; inspect the diff before any replayed action.',
    '',
  ].join('\n');

  await mkdir(workDirectory, { recursive: true });
  await atomicWrite(join(workDirectory, 'latest.json'), `${JSON.stringify(snapshot, null, 2)}\n`);
  await atomicWrite(join(workDirectory, 'RESUME.md'), resume);
}

main().catch((error) => {
  console.error(`snapshot failed: ${error.message}`);
  process.exitCode = 1;
});
