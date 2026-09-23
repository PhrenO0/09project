import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ClubsView, LibraryView, ReaderView, RecordsView } from './src/views';
import { colors, shared } from './src/theme';
import { loadState, saveState } from './src/storage';
import { initialState, LocalState, markChapterRead } from './src/state';

type Tab = 'library' | 'clubs' | 'records';
type Screen = { kind: 'tabs' } | { kind: 'reader'; chapter: number };

const tabs: { id: Tab; label: string; mark: string }[] = [
  { id: 'library', label: '서가', mark: '▥' },
  { id: 'clubs', label: '함께읽기', mark: '◌' },
  { id: 'records', label: '내 기록', mark: '⌁' },
];

function AppContent() {
  const [tab, setTab] = useState<Tab>('library');
  const [screen, setScreen] = useState<Screen>({ kind: 'tabs' });
  const [state, setState] = useState<LocalState>(initialState);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const latestState = useRef(initialState);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  const hydrate = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const stored = await loadState();
      latestState.current = stored;
      setState(stored);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { hydrate(); }, [hydrate]);

  const persist = useCallback(async (next: LocalState) => {
    saveQueue.current = saveQueue.current.catch(() => undefined).then(() => saveState(next));
    try {
      await saveQueue.current;
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, []);

  const update = useCallback((recipe: (current: LocalState) => LocalState) => {
    setState((current) => {
      const next = recipe(current);
      latestState.current = next;
      void persist(next);
      return next;
    });
  }, [persist]);

  const closeReader = useCallback(() => setScreen({ kind: 'tabs' }), []);
  const openReader = useCallback((chapter = 1) => {
    const safeChapter = Math.min(Math.max(chapter, 1), 3);
    update((current) => markChapterRead(current, safeChapter));
    setScreen({ kind: 'reader', chapter: safeChapter });
  }, [update]);

  useEffect(() => {
    if (Platform.OS !== 'android' || screen.kind !== 'reader') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      closeReader();
      return true;
    });
    return () => subscription.remove();
  }, [closeReader, screen.kind]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.amber} /><Text style={styles.loadingText}>내 서가를 펼치는 중…</Text></View>;
  }

  if (loadError) {
    return (
      <View style={styles.center} accessibilityLiveRegion="assertive">
        <Text style={styles.errorTitle}>저장된 기록을 불러오지 못했어요.</Text>
        <Text style={styles.errorBody}>기기의 저장 공간을 확인한 뒤 다시 시도해 주세요.</Text>
        <Pressable accessibilityRole="button" onPress={hydrate} style={shared.button}><Text style={shared.buttonText}>다시 시도</Text></Pressable>
      </View>
    );
  }

  if (screen.kind === 'reader') {
    return (
      <SafeAreaView style={shared.screen} edges={['top', 'bottom']}>
        <ReaderView state={state} update={update} initialChapter={screen.chapter} close={closeReader} />
        {saveError && <SaveError retry={() => void persist(latestState.current)} reader />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={shared.screen} edges={['top', 'bottom']}>
      <View style={styles.shell}>
        <View style={styles.content}>
          {tab === 'library' && <LibraryView state={state} openReader={openReader} />}
          {tab === 'clubs' && <ClubsView state={state} update={update} />}
          {tab === 'records' && <RecordsView state={state} openReader={openReader} />}
        </View>
        <View style={styles.tabBar} accessibilityRole="tablist">
          {tabs.map((item) => {
            const active = item.id === tab;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={item.label}
                onPress={() => setTab(item.id)}
                style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && styles.pressed]}
              >
                <Text style={[styles.tabMark, active && styles.tabTextActive]}>{item.mark}</Text>
                <Text style={[styles.tabLabel, active && styles.tabTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {saveError && <SaveError retry={() => void persist(latestState.current)} />}
      </View>
    </SafeAreaView>
  );
}

function SaveError({ retry, reader = false }: { retry: () => void; reader?: boolean }) {
  return (
    <View style={[styles.saveError, reader && styles.saveErrorReader]} accessibilityLiveRegion="assertive">
      <Text style={styles.saveErrorText}>변경 사항을 저장하지 못했어요.</Text>
      <Pressable accessibilityRole="button" onPress={retry} style={styles.retry}><Text style={styles.retryText}>재시도</Text></Pressable>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, width: '100%', maxWidth: 1080, alignSelf: 'center', backgroundColor: colors.ink },
  content: { flex: 1 },
  center: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 14 },
  loadingText: { color: colors.paperDeep, fontSize: 15 },
  errorTitle: { color: colors.paper, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  errorBody: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 8 },
  tabBar: { minHeight: 68, flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#555650', backgroundColor: '#111412' },
  tab: { flex: 1, minHeight: 68, alignItems: 'center', justifyContent: 'center', gap: 3, borderTopWidth: 2, borderTopColor: 'transparent' },
  tabActive: { borderTopColor: colors.amber }, tabMark: { color: colors.muted, fontSize: 19 }, tabLabel: { color: colors.muted, fontSize: 12 },
  tabTextActive: { color: colors.paper }, pressed: { opacity: .65 },
  saveError: { position: 'absolute', left: 12, right: 12, bottom: 76, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, backgroundColor: '#392827', borderWidth: 1, borderColor: colors.danger },
  saveErrorReader: { bottom: 12 }, saveErrorText: { color: colors.paper, fontSize: 13, flex: 1 },
  retry: { minWidth: 64, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, retryText: { color: colors.amber, fontWeight: '700' },
});
