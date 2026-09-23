export type Chapter = { id: number; title: string; body: string[] };
export type Book = {
  id: string;
  title: string;
  author: string;
  category: '소설' | '에세이' | '시';
  note: string;
  colors: [string, string];
  available: boolean;
};

export const books: Book[] = [
  {
    id: 'night-bookshop', title: '밤의 책방', author: '여백 편집부', category: '소설',
    note: '파도 소리가 닿는 작은 책방의 세 밤', colors: ['#122220', '#D4AD75'], available: true,
  },
  {
    id: 'sea-margin', title: '바다가 남긴 여백', author: '서 해원', category: '에세이',
    note: '천천히 걷고 오래 바라본 기록', colors: ['#6F9692', '#ECE6D8'], available: false,
  },
  {
    id: 'lamp-poems', title: '등불 아래 짧은 시', author: '문 윤', category: '시',
    note: '잠들기 전 한 편씩 읽는 시', colors: ['#9A7659', '#101311'], available: false,
  },
];

export const chapters: Chapter[] = [
  {
    id: 1, title: '첫째 밤 · 문을 여는 시간',
    body: [
      '광안리의 마지막 버스가 지나가면, 책방은 비로소 조용해졌다. 유리창에는 바다의 검은 빛이 얇게 붙고, 오래된 스탠드 하나가 책등을 천천히 훑었다.',
      '수안은 닫힘 팻말을 뒤집지 않았다. 오늘은 누군가 늦게 올 것 같은 밤이었다. 예감은 근거가 없어서 오래 남았다.',
      '아홉 시 십칠 분, 문 위의 작은 종이 울렸다. 비에 젖은 손님은 책을 찾는 대신 빈 의자를 가리켰다. “여기서 조금 읽어도 될까요?” 수안은 대답 대신 마른 수건을 건넸다.',
    ],
  },
  {
    id: 2, title: '둘째 밤 · 같은 문장',
    body: [
      '손님은 얇은 초록색 책을 골랐다. 반쯤 읽다 덮고, 다시 같은 쪽을 펼쳤다. 파도가 방파제를 칠 때마다 종이 위의 그림자가 흔들렸다.',
      '“같은 문장을 세 번 읽었어요.” 손님이 말했다. 수안은 찻잔을 내려놓았다. “좋아서요, 아니면 어려워서요?”',
      '손님은 잠시 생각했다. “오늘의 나한테 필요한 문장이라서요.” 둘은 더 묻지 않았다. 말하지 않은 이야기가 책장 사이에 조용히 자리를 잡았다.',
    ],
  },
  {
    id: 3, title: '셋째 밤 · 여백의 자리',
    body: [
      '사흘째 밤에는 비가 그쳤다. 손님은 책을 제자리에 꽂고 작은 종이 한 장을 내밀었다. 거기에는 단 한 줄이 적혀 있었다. 오래 머물 수 있는 곳은 대답을 재촉하지 않는다.',
      '수안은 종이를 계산대 아래에 붙였다. 책방을 오래 지켰지만, 이곳이 누군가에게 어떤 자리인지 처음 알 것 같았다.',
      '문을 닫은 뒤 수안은 바다 쪽 창을 조금 열었다. 밤공기와 멀리서 오는 파도 소리가 빈 의자에 앉았다. 여백은 비어 있는 것이 아니라, 다음 사람이 머물 자리였다.',
    ],
  },
];

export const sampleClubs = [
  { id: 'club-night', name: '광안리 밤 독서', schedule: '매주 목요일 · 밤 9시', chapter: '이번 주 1장', note: '조용히 읽고 한 문장만 나눠요.' },
  { id: 'club-slow', name: '천천히, 세 개의 밤', schedule: '9월 18일–10월 2일', chapter: '주 1장', note: '각자의 속도로 읽는 짧은 모임이에요.' },
];

export const sampleReflections = [
  { chapter: 1, by: '예시 감상 · 해변의 독자', text: '늦게 온 사람을 위해 닫힘 팻말을 미뤄 둔 마음이 오래 남았어요.' },
  { chapter: 2, by: '예시 감상 · 느린 문장', text: '필요한 문장은 이해하는 데보다 머무는 데 시간이 드는 것 같아요.' },
  { chapter: 3, by: '예시 감상 · 파도 노트', text: '여백을 다음 사람이 머물 자리라고 부르는 마지막 문장이 좋았습니다.' },
];
