import { Platform, StyleSheet } from 'react-native';

export const colors = {
  ink: '#101311',
  paper: '#ECE6D8',
  paperDeep: '#D8D0BF',
  amber: '#D4AD75',
  sea: '#82ACA6',
  muted: '#8B8B82',
  white: '#F7F2E8',
  danger: '#C8796E',
};

export const layout = { maxWidth: 1080, pagePadding: 22, radius: 3 };
export const readerFontFamily = Platform.select({ ios: 'Georgia', android: 'serif', web: 'Georgia, serif' });

export const type = StyleSheet.create({
  eyebrow: { color: colors.amber, fontSize: 12, letterSpacing: 2.4, fontWeight: '700' },
  title: { color: colors.paper, fontSize: 32, lineHeight: 40, fontWeight: '700', letterSpacing: -0.8 },
  section: { color: colors.paper, fontSize: 20, lineHeight: 27, fontWeight: '700' },
  body: { color: colors.paperDeep, fontSize: 16, lineHeight: 25 },
  meta: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});

export const shared = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  max: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#52544F' },
  button: {
    minHeight: 44,
    paddingHorizontal: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: layout.radius,
  },
  buttonText: { color: colors.paper, fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#595A54',
    color: colors.paper,
    paddingHorizontal: 14,
    borderRadius: layout.radius,
    fontSize: 16,
  },
});
