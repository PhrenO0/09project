import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialState, LocalState, normalizeState } from './state';

const KEY = '@yeobaek/local-state/v2';
const LEGACY_KEY = '@yeobaek/local-state/v1';

export async function loadState(): Promise<LocalState> {
  const raw = await AsyncStorage.getItem(KEY) ?? await AsyncStorage.getItem(LEGACY_KEY);
  if (!raw) return initialState;
  const parsed: unknown = JSON.parse(raw);
  return normalizeState(parsed);
}

export async function saveState(state: LocalState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
