import assert from 'node:assert/strict';
import test from 'node:test';
import {
  initialState, normalizeState, markChapterRead, completeBook, visibleReflections,
} from '../apps/mobile/src/state.ts';

test('returning to an earlier chapter keeps read access but resumes at that chapter', () => {
  const advanced = markChapterRead(initialState, 3);
  const returned = markChapterRead(advanced, 1);
  assert.equal(returned.maxReadChapter, 3);
  assert.equal(returned.lastReadChapter, 1);
  assert.equal(returned.completed, false);
  assert.equal(initialState.maxReadChapter, 0);
});

test('completion is explicit and survives a serialized reopen', () => {
  const finished = completeBook(markChapterRead(initialState, 3));
  const restored = normalizeState(JSON.parse(JSON.stringify(finished)));
  assert.equal(restored.completed, true);
  assert.equal(restored.lastReadChapter, 3);
  assert.equal(markChapterRead(restored, 1).completed, true);
});

test('v1 records migrate without losing bookmarks, membership, or reflection text', () => {
  const legacy = {
    ...initialState, version: 1, maxReadChapter: 2, joinedClubIds: ['club-night'], bookmarks: [2],
    reflections: [{ id: 'note-1', chapter: 1, text: '함께 읽은 기록', createdAt: '2026-09-16T00:00:00Z' }],
  };
  delete legacy.lastReadChapter;
  const restored = normalizeState(legacy);
  assert.equal(restored.version, 2);
  assert.equal(restored.lastReadChapter, 2);
  assert.deepEqual(restored.bookmarks, [2]);
  assert.deepEqual(restored.joinedClubIds, ['club-night']);
  assert.equal(restored.reflections[0].text, '함께 읽은 기록');
});

test('corrupt or unknown stored schema fails instead of silently resetting saved records', () => {
  const invalid = [null, {}, { ...initialState, version: 99 },
    { ...initialState, maxReadChapter: NaN }, { ...initialState, fontScale: Infinity },
    { ...initialState, lastReadChapter: -Infinity }, { ...initialState, reflections: null }];
  for (const value of invalid) assert.throws(() => normalizeState(value), /INVALID_LOCAL_STATE/);
});

test('unread reflection bodies stay excluded until the reader reaches their chapter', () => {
  const reflections = [1, 2, 3].map((chapter) => ({
    id: `note-${chapter}`, chapter, text: `chapter-${chapter}-spoiler`, createdAt: '2026-09-16T00:00:00Z',
  }));
  const unread = { ...initialState, reflections };
  assert.deepEqual(visibleReflections(unread), []);
  const first = markChapterRead(unread, 1);
  assert.deepEqual(visibleReflections(first).map((note) => note.chapter), [1]);
  assert.ok(!JSON.stringify(visibleReflections(first)).includes('chapter-2-spoiler'));
  assert.deepEqual(visibleReflections(markChapterRead(first, 2)).map((note) => note.chapter), [1, 2]);
});
