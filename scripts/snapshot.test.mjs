import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const sourceScript = join(dirname(fileURLToPath(import.meta.url)), 'snapshot.mjs');

async function makeRepository({ git = true, commit = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'snapshot-test-'));
  await mkdir(join(root, 'scripts'));
  await cp(sourceScript, join(root, 'scripts', 'snapshot.mjs'));
  if (git) {
    execFileSync('git', ['init'], { cwd: root, stdio: 'ignore' });
    execFileSync('git', ['config', 'user.email', 'test@example.invalid'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'Snapshot Test'], { cwd: root });
  }
  if (commit) {
    await writeFile(join(root, 'tracked.txt'), 'base\n');
    execFileSync('git', ['add', '.'], { cwd: root });
    execFileSync('git', ['commit', '-m', 'base'], { cwd: root, stdio: 'ignore' });
  }
  return root;
}

async function snapshot(root) {
  const elsewhere = join(root, 'elsewhere');
  await mkdir(elsewhere, { recursive: true });
  execFileSync(process.execPath, [join(root, 'scripts', 'snapshot.mjs')], { cwd: elsewhere });
  return JSON.parse(await readFile(join(root, '.work', 'latest.json'), 'utf8'));
}

test('records a dirty repository and Unicode filenames from another cwd', async (t) => {
  const root = await makeRepository({ commit: true });
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'apps', 'mobile'), { recursive: true });
  await writeFile(join(root, 'apps', 'mobile', 'package.json'), JSON.stringify({ name: 'mobile', scripts: { test: 'node --test' } }));
  await writeFile(join(root, '한 글 이름.txt'), 'dirty\n');
  const result = await snapshot(root);
  assert.equal(result.git.head.length, 40);
  assert.ok(result.git.status.some((entry) => entry.path === '한 글 이름.txt'));
  assert.deepEqual(result.appPackages[0].scripts, { test: 'node --test' });
});

test('makes an unborn repository explicit instead of treating it as clean', async (t) => {
  const root = await makeRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  const result = await snapshot(root);
  assert.equal(typeof result.git.head, 'object');
  assert.match(result.git.head.error, /unknown revision|Needed a single revision|ambiguous argument/i);
  assert.ok(existsSync(join(root, '.work', 'RESUME.md')));
});

test('records a non-git directory as Git errors', async (t) => {
  const root = await makeRepository({ git: false });
  t.after(() => rm(root, { recursive: true, force: true }));
  const result = await snapshot(root);
  assert.equal(typeof result.git.status, 'object');
  assert.match(result.git.status.error, /not a git repository/i);
});

test('can be run repeatedly without temporary files or checkpoint mutation', async (t) => {
  const root = await makeRepository({ commit: true });
  t.after(() => rm(root, { recursive: true, force: true }));
  const checkpoint = '# Keep this human decision\n';
  await writeFile(join(root, 'CHECKPOINT.md'), checkpoint);
  const first = await snapshot(root);
  const second = await snapshot(root);
  assert.equal(await readFile(join(root, 'CHECKPOINT.md'), 'utf8'), checkpoint);
  assert.equal(first.git.head, second.git.head);
  assert.equal(existsSync(join(root, '.work', 'latest.json')), true);
  assert.equal((await readdir(join(root, '.work'))).some((name) => name.endsWith('.tmp')), false);
});
