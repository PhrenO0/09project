export type Reflection = { id: string; chapter: number; text: string; createdAt: string };
export type LocalState = {
  version: 2;
  joinedClubIds: string[];
  maxReadChapter: number;
  lastReadChapter: number;
  completed: boolean;
  fontScale: number;
  bookmarks: number[];
  reflections: Reflection[];
};

export const initialState: LocalState = {
  version: 2, joinedClubIds: [], maxReadChapter: 0, lastReadChapter: 1, completed: false,
  fontScale: 1, bookmarks: [], reflections: [],
};

export function normalizeState(value: unknown): LocalState {
  if (!value || typeof value !== 'object') throw new Error('INVALID_LOCAL_STATE');
  const state = value as Omit<Partial<LocalState>, 'version'> & { version?: 1 | 2 };
  if ((state.version !== 1 && state.version !== 2) || !Array.isArray(state.joinedClubIds) || !Array.isArray(state.bookmarks)
    || !Array.isArray(state.reflections) || typeof state.maxReadChapter !== 'number'
    || !Number.isFinite(state.maxReadChapter) || typeof state.completed !== 'boolean'
    || typeof state.fontScale !== 'number' || !Number.isFinite(state.fontScale)) throw new Error('INVALID_LOCAL_STATE');
  const maxReadChapter = Math.min(3, Math.max(0, Math.floor(state.maxReadChapter)));
  const rawLast = state.version === 2 ? state.lastReadChapter : Math.max(maxReadChapter, 1);
  if (typeof rawLast !== 'number' || !Number.isFinite(rawLast)) throw new Error('INVALID_LOCAL_STATE');
  const lastReadChapter = Math.min(Math.max(maxReadChapter, 1), Math.max(1, Math.floor(rawLast)));
  const bookmarks = state.bookmarks.filter((n): n is number => Number.isInteger(n) && n >= 1 && n <= maxReadChapter);
  return {
    version: 2,
    joinedClubIds: [...new Set(state.joinedClubIds.filter((id): id is string => typeof id === 'string'))],
    maxReadChapter,
    lastReadChapter,
    completed: state.completed && maxReadChapter === 3,
    fontScale: Math.min(1.4, Math.max(.9, state.fontScale)),
    bookmarks: [...new Set(bookmarks)],
    reflections: state.reflections.filter((item): item is Reflection => Boolean(item)
      && typeof item.id === 'string' && Number.isInteger(item.chapter) && item.chapter >= 1 && item.chapter <= 3
      && typeof item.text === 'string' && typeof item.createdAt === 'string'),
  };
}

export function visibleReflections(state: LocalState): Reflection[] {
  return state.reflections.filter((item) => item.chapter <= state.maxReadChapter);
}

export function markChapterRead(state: LocalState, chapter: number): LocalState {
  const safeChapter = Number.isFinite(chapter)
    ? Math.min(3, Math.max(1, Math.floor(chapter)))
    : state.lastReadChapter;
  return { ...state, maxReadChapter: Math.max(state.maxReadChapter, safeChapter), lastReadChapter: safeChapter };
}

export function completeBook(state: LocalState): LocalState {
  return { ...state, maxReadChapter: 3, lastReadChapter: 3, completed: true };
}
