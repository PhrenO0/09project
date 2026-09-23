import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Book, books, chapters, sampleClubs, sampleReflections } from './data';
import { colors, layout, readerFontFamily, shared, type } from './theme';
import { completeBook, LocalState, markChapterRead, visibleReflections } from './state';

type Update = (recipe: (state: LocalState) => LocalState) => void;

function Tap({ label, onPress, filled = false, disabled = false, accessibilityLabel }: {
  label: string; onPress: () => void; filled?: boolean; disabled?: boolean; accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.tap, filled && styles.tapFilled, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <Text style={[styles.tapText, filled && styles.tapTextFilled]}>{label}</Text>
    </Pressable>
  );
}

export function BookCover({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${book.title}, ${book.author} 표지`}
      style={[styles.cover, compact && styles.coverCompact, { backgroundColor: book.colors[0], borderColor: book.colors[1] }]}
    >
      <View style={[styles.coverMoon, { borderColor: book.colors[1] }]} />
      <View style={[styles.coverLine, { backgroundColor: book.colors[1] }]} />
      <Text numberOfLines={3} style={[styles.coverTitle, compact && styles.coverTitleCompact, { color: book.colors[1] }]}>{book.title}</Text>
      <Text style={[styles.coverMark, { color: book.colors[1] }]}>여 백</Text>
    </View>
  );
}

export function Header({ eyebrow, title, right }: { eyebrow: string; title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}><Text style={type.eyebrow}>{eyebrow}</Text><Text style={type.title}>{title}</Text></View>
      {right}
    </View>
  );
}

const Shell = ({ children }: { children: React.ReactNode }) => (
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
    <View style={shared.max}>{children}</View>
  </ScrollView>
);

export function LibraryView({ state, openReader }: { state: LocalState; openReader: (chapter?: number) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'전체' | Book['category']>('전체');
  const filtered = useMemo(() => books.filter((book) => {
    const matchCategory = category === '전체' || book.category === category;
    const haystack = `${book.title} ${book.author} ${book.note}`.toLowerCase();
    return matchCategory && haystack.includes(query.trim().toLowerCase());
  }), [category, query]);
  const continueChapter = state.lastReadChapter;

  return (
    <Shell>
      <Header eyebrow="YEOBAEK · LOCAL PREVIEW" title="오늘의 여백" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`밤의 책방 ${continueChapter}장 이어 읽기`}
        onPress={() => openReader(continueChapter)}
        style={({ pressed }) => [styles.continueCard, pressed && styles.pressed]}
      >
        <BookCover book={books[0]} compact />
        <View style={styles.continueCopy}>
          <Text style={type.eyebrow}>이어 읽기</Text>
          <Text style={styles.continueTitle}>밤의 책방</Text>
          <Text style={type.meta}>{state.completed ? '완독한 책 · 다시 읽기' : `${continueChapter}장 · ${state.maxReadChapter}/3장 읽음`}</Text>
          <View style={styles.progress}><View style={[styles.progressFill, { width: `${state.maxReadChapter / 3 * 100}%` }]} /></View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
      <Text style={styles.localNotice}>미리보기 · 이 기기에만 저장됩니다</Text>

      <TextInput
        accessibilityLabel="책 검색"
        placeholder="제목, 작가, 분위기로 찾기"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        style={[shared.input, styles.search]}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {(['전체', '소설', '에세이', '시'] as const).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: category === item }}
            onPress={() => setCategory(item)}
            style={[styles.chip, category === item && styles.chipActive]}
          ><Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text></Pressable>
        ))}
      </ScrollView>

      <Text style={[type.section, styles.sectionTitle]}>작은 서가</Text>
      <View style={styles.bookGrid}>
        {filtered.map((book) => (
          <View key={book.id} style={styles.bookCard}>
            <BookCover book={book} />
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={type.meta}>{book.author} · {book.category}</Text>
            <Text style={[type.meta, styles.bookNote]}>{book.note}</Text>
            {book.available ? <Tap label="읽기" onPress={() => openReader(1)} /> : <Text style={styles.introOnly}>표지와 소개만 제공</Text>}
          </View>
        ))}
      </View>
      {filtered.length === 0 && <Text accessibilityLiveRegion="polite" style={styles.empty}>찾는 책이 없어요. 다른 검색어를 입력해 보세요.</Text>}
    </Shell>
  );
}

export function ClubsView({ state, update }: { state: LocalState; update: Update }) {
  const toggle = (id: string) => update((current) => ({
    ...current,
    joinedClubIds: current.joinedClubIds.includes(id)
      ? current.joinedClubIds.filter((clubId) => clubId !== id)
      : [...current.joinedClubIds, id],
  }));
  return (
    <Shell>
      <Header eyebrow="TOGETHER, SLOWLY" title="함께 읽기" />
      <View style={styles.ticketNotice}>
        <Text style={styles.ticketNumber}>예시 모임</Text>
        <Text style={type.body}>실제 운영 중인 모임이 아닌, 로컬 기능을 체험하기 위한 샘플입니다.</Text>
      </View>
      {sampleClubs.map((club, index) => {
        const joined = state.joinedClubIds.includes(club.id);
        return (
          <View key={club.id} style={[styles.clubCard, index % 2 === 1 && { borderColor: colors.sea }]}>
            <View style={styles.clubTop}><Text style={type.eyebrow}>TICKET 0{index + 1}</Text><Text style={type.meta}>예시</Text></View>
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={type.body}>{club.note}</Text>
            <View style={styles.rule} />
            <Text style={styles.clubMeta}>{club.schedule}</Text>
            <Text style={styles.clubMeta}>{club.chapter}</Text>
            <View style={styles.clubAction}><Tap label={joined ? '모임 나가기' : '모임 참여'} filled={!joined} onPress={() => toggle(club.id)} /></View>
          </View>
        );
      })}
      <Text style={[type.section, styles.sectionTitle]}>밤의 책방 · 장별 감상</Text>
      <Text style={[type.meta, { marginBottom: 10 }]}>예시 감상 · 내가 읽은 장까지만 내용이 보여요.</Text>
      {sampleReflections.map((item) => item.chapter <= state.maxReadChapter ? (
        <View key={item.chapter} style={styles.communityNote}>
          <Text style={type.eyebrow}>{item.chapter}장</Text>
          <Text style={styles.noteText}>{item.text}</Text>
          <Text style={type.meta}>{item.by}</Text>
        </View>
      ) : (
        <View
          key={item.chapter}
          accessible
          accessibilityLabel={`${item.chapter}장 감상, 아직 읽지 않아 잠김`}
          style={styles.lockedNote}
        >
          <Text style={styles.lockedTitle}>{item.chapter}장 감상</Text><Text style={type.meta}>읽은 뒤 열려요</Text>
        </View>
      ))}
    </Shell>
  );
}

export function RecordsView({ state, openReader }: { state: LocalState; openReader: (chapter?: number) => void }) {
  const reflections = visibleReflections(state);
  return (
    <Shell>
      <Header eyebrow="MY READING NOTES" title="내 기록" />
      <View style={styles.recordSummary}>
        <Text style={styles.recordNumber}>{state.completed ? '완독' : `${state.maxReadChapter} / 3`}</Text>
        <Text style={type.meta}>{state.completed ? '밤의 책방을 모두 읽었어요.' : '밤의 책방 읽은 장'}</Text>
      </View>
      <View style={styles.statRow}>
        <View style={styles.stat}><Text style={styles.statNumber}>{state.bookmarks.length}</Text><Text style={type.meta}>북마크</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>{reflections.length}</Text><Text style={type.meta}>감상</Text></View>
        <View style={styles.stat}><Text style={styles.statNumber}>{state.joinedClubIds.length}</Text><Text style={type.meta}>참여 모임</Text></View>
      </View>
      <Text style={[type.section, styles.sectionTitle]}>북마크</Text>
      {state.bookmarks.length > 0 ? state.bookmarks.slice().sort().map((chapter) => (
        <Pressable
          key={chapter}
          accessibilityRole="button"
          accessibilityLabel={`${chapter}장 북마크 열기`}
          onPress={() => openReader(chapter)}
          style={styles.bookmarkRow}
        >
          <Text style={styles.bookmarkDiamond}>◇</Text>
          <View style={{ flex: 1 }}><Text style={styles.lockedTitle}>{chapters[chapter - 1].title}</Text><Text style={type.meta}>{chapter}장으로 이동</Text></View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      )) : <Text style={styles.empty}>리더에서 장을 북마크하면 이곳에서 바로 열 수 있어요.</Text>}
      <Text style={[type.section, styles.sectionTitle]}>남긴 감상</Text>
      {reflections.map((item) => (
        <Pressable key={item.id} onPress={() => openReader(item.chapter)} style={styles.noteCard} accessibilityRole="button">
          <Text style={type.eyebrow}>{item.chapter}장</Text>
          <Text style={styles.noteText}>{item.text}</Text>
          <Text style={type.meta}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
        </Pressable>
      ))}
      {reflections.length === 0 && <Text style={styles.empty}>읽는 중에 남긴 감상이 이곳에 모여요.</Text>}
    </Shell>
  );
}

export function ReaderView({ state, update, initialChapter, close }: {
  state: LocalState; update: Update; initialChapter: number; close: () => void;
}) {
  const [chapterNumber, setChapterNumber] = useState(Math.min(Math.max(initialChapter, 1), chapters.length));
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const scrollRef = useRef<ScrollView>(null);
  const chapter = chapters[chapterNumber - 1];
  const draft = drafts[chapterNumber] ?? '';
  const bookmarked = state.bookmarks.includes(chapterNumber);
  const fontSize = Math.round(18 * state.fontScale);
  const lineHeight = Math.round(32 * state.fontScale);
  const visit = (next: number) => {
    setChapterNumber(next);
    update((current) => markChapterRead(current, next));
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: false }));
  };
  const finish = () => update(completeBook);
  const addReflection = () => {
    const text = draft.trim();
    if (!text) return;
    update((current) => ({ ...current, reflections: [...current.reflections, {
      id: `${Date.now()}-${chapterNumber}`, chapter: chapterNumber, text, createdAt: new Date().toISOString(),
    }] }));
    setDrafts((current) => ({ ...current, [chapterNumber]: '' }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.readerBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="리더 닫기" onPress={close} style={styles.iconTap}><Text style={styles.iconText}>‹</Text></Pressable>
        <Text style={styles.readerBook}>밤의 책방</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? '이 장 북마크 해제' : '이 장 북마크'}
          accessibilityState={{ selected: bookmarked }}
          onPress={() => update((current) => ({ ...current, bookmarks: bookmarked ? current.bookmarks.filter((n) => n !== chapterNumber) : [...current.bookmarks, chapterNumber] }))}
          style={styles.iconTap}
        ><Text style={[styles.bookmark, bookmarked && styles.bookmarkOn]}>◇</Text></Pressable>
      </View>
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.readerPage}>
        <View style={styles.readerColumn}>
          <Text style={type.eyebrow}>CHAPTER {chapterNumber} / 3</Text>
          <Text accessibilityRole="header" style={styles.chapterTitle}>{chapter.title}</Text>
          <View style={styles.readerRule} />
          {chapter.body.map((paragraph, index) => <Text key={index} style={[styles.paragraph, { fontSize, lineHeight }]}>{paragraph}</Text>)}
          <View style={styles.fontControls}>
            <Text style={type.meta}>글자 크기</Text>
            <Tap label="가−" accessibilityLabel="글자 크기 줄이기" disabled={state.fontScale <= .9} onPress={() => update((s) => ({ ...s, fontScale: Math.max(.9, +(s.fontScale - .1).toFixed(1)) }))} />
            <Tap label="가＋" accessibilityLabel="글자 크기 키우기" disabled={state.fontScale >= 1.4} onPress={() => update((s) => ({ ...s, fontScale: Math.min(1.4, +(s.fontScale + .1).toFixed(1)) }))} />
          </View>
          <View style={styles.readerNav}>
            <Tap label="이전 장" disabled={chapterNumber === 1} onPress={() => visit(chapterNumber - 1)} />
            {chapterNumber < 3 ? <Tap label="다음 장" filled onPress={() => visit(chapterNumber + 1)} /> : <Tap label={state.completed ? '완독했어요' : '완독하기'} filled onPress={finish} />}
          </View>
          <View style={styles.reflectionBox}>
            <Text style={type.section}>이 장에 감상 남기기</Text>
            <Text style={type.meta}>내 기록에만 저장됩니다.</Text>
            <TextInput
              accessibilityLabel={`${chapterNumber}장 감상`}
              multiline
              value={draft}
              onChangeText={(text) => setDrafts((current) => ({ ...current, [chapterNumber]: text }))}
              placeholder="마음에 남은 문장이나 생각을 적어 보세요."
              placeholderTextColor={colors.muted}
              style={[shared.input, styles.reflectionInput]}
            />
            <View style={{ alignItems: 'flex-end' }}><Tap label="감상 저장" filled disabled={!draft.trim()} onPress={addReflection} /></View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: layout.pagePadding, paddingTop: 30, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 88, marginBottom: 18 },
  tap: { ...shared.button, alignSelf: 'flex-start' }, tapFilled: { backgroundColor: colors.amber },
  tapText: { ...shared.buttonText }, tapTextFilled: { color: colors.ink }, disabled: { opacity: .4 }, pressed: { opacity: .68 },
  continueCard: { minHeight: 142, padding: 14, borderWidth: 1, borderColor: '#555650', flexDirection: 'row', alignItems: 'center', backgroundColor: '#171A18' },
  continueCopy: { flex: 1, paddingHorizontal: 16 }, continueTitle: { color: colors.paper, fontSize: 23, fontWeight: '700', marginVertical: 5 }, arrow: { color: colors.amber, fontSize: 34 },
  progress: { height: 2, backgroundColor: '#484A46', marginTop: 14 }, progressFill: { height: 2, backgroundColor: colors.sea },
  localNotice: { ...type.meta, marginTop: 9, marginBottom: 26 }, search: { marginBottom: 12 }, chips: { gap: 8, paddingBottom: 4 },
  chip: { minHeight: 44, minWidth: 58, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#4A4C48', paddingHorizontal: 15 },
  chipActive: { backgroundColor: colors.paper }, chipText: { color: colors.paperDeep, fontSize: 14 }, chipTextActive: { color: colors.ink, fontWeight: '700' },
  sectionTitle: { marginTop: 30, marginBottom: 16 }, bookGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  bookCard: { width: 168, maxWidth: '47%', marginBottom: 18 }, bookTitle: { color: colors.paper, fontSize: 17, fontWeight: '700', marginTop: 12, marginBottom: 3 },
  bookNote: { marginTop: 7, minHeight: 40 }, introOnly: { color: colors.sea, fontSize: 12, marginTop: 13 },
  cover: { width: 148, maxWidth: '100%', aspectRatio: .68, borderWidth: 1, padding: 13, overflow: 'hidden', justifyContent: 'flex-end' },
  coverCompact: { width: 72, height: 104, aspectRatio: undefined, padding: 7 }, coverMoon: { position: 'absolute', width: 54, height: 54, borderWidth: 1, borderRadius: 30, top: 22, right: -13 },
  coverLine: { position: 'absolute', width: 1, height: '74%', left: 20, top: 0, opacity: .7 }, coverTitle: { fontSize: 19, lineHeight: 23, fontWeight: '700', letterSpacing: -1 },
  coverTitleCompact: { fontSize: 13, lineHeight: 16, letterSpacing: -.4 },
  coverMark: { fontSize: 9, letterSpacing: 3, marginTop: 10 }, empty: { ...type.body, color: colors.muted, paddingVertical: 30 },
  ticketNotice: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.amber, paddingVertical: 18, marginBottom: 22 }, ticketNumber: { ...type.eyebrow, marginBottom: 7 },
  clubCard: { borderWidth: 1, borderColor: colors.amber, padding: 20, marginBottom: 18 }, clubTop: { flexDirection: 'row', justifyContent: 'space-between' },
  clubName: { ...type.section, fontSize: 24, marginVertical: 14 }, rule: { ...shared.divider, marginVertical: 18 }, clubMeta: { color: colors.paper, fontSize: 14, marginBottom: 6 }, clubAction: { alignItems: 'flex-end', marginTop: 13 },
  recordSummary: { paddingVertical: 28, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.sea }, recordNumber: { color: colors.paper, fontSize: 42, fontWeight: '700', marginBottom: 5 },
  statRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#4A4C48' }, stat: { flex: 1, paddingVertical: 20 }, statNumber: { color: colors.amber, fontSize: 23, fontWeight: '700' },
  noteCard: { paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#545650' }, noteText: { ...type.body, color: colors.paper, marginVertical: 8 },
  communityNote: { paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#545650' },
  lockedNote: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#41433F', opacity: .68 },
  lockedTitle: { color: colors.paper, fontSize: 15, fontWeight: '700' },
  bookmarkRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#545650' },
  bookmarkDiamond: { color: colors.amber, fontSize: 25 },
  readerBar: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#555650', paddingHorizontal: 10 },
  readerBook: { color: colors.paper, fontSize: 15, fontWeight: '700' }, iconTap: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }, iconText: { color: colors.paper, fontSize: 34 }, bookmark: { color: colors.paper, fontSize: 29 }, bookmarkOn: { color: colors.amber },
  readerPage: { paddingHorizontal: 22, paddingTop: 42, paddingBottom: 90 }, readerColumn: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  chapterTitle: { color: colors.paper, fontFamily: readerFontFamily, fontSize: 30, lineHeight: 40, fontWeight: '700', marginTop: 8 }, readerRule: { width: 42, height: 2, backgroundColor: colors.amber, marginVertical: 28 },
  paragraph: { color: colors.paperDeep, fontFamily: readerFontFamily, marginBottom: 25, letterSpacing: .1 }, fontControls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 18, paddingVertical: 18, borderTopWidth: 1, borderColor: '#4A4C48' },
  readerNav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }, reflectionBox: { marginTop: 46, borderTopWidth: 1, borderColor: colors.sea, paddingTop: 25, gap: 8 },
  reflectionInput: { minHeight: 120, paddingTop: 14, textAlignVertical: 'top', marginVertical: 10 },
});
