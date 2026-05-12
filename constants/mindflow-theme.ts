import type { ColorSchemeName } from 'react-native';

export type MindflowScheme = 'light' | 'dark';

export function resolveMindflowScheme(
  system: ColorSchemeName,
  followSystem: boolean,
  forceDark: boolean,
): MindflowScheme {
  if (followSystem) {
    return system === 'dark' ? 'dark' : 'light';
  }
  return forceDark ? 'dark' : 'light';
}

export const MindflowPalette = {
  light: {
    screen: '#F6F0E8',
    surface: '#FFFFFF',
    surfaceMuted: '#FFF5ED',
    text: '#1C1917',
    textMuted: '#57534E',
    border: '#E7E5E4',
    accent: '#EA580C',
    accentMuted: '#FDBA74',
    success: '#16A34A',
    successSoft: '#DCFCE7',
    searchBg: '#FFEDD5',
    headerTitle: '#C2410C',
    tabPill: '#BBF7D0',
    fab: '#EA580C',
    cardShadow: '#00000018',
  },
  dark: {
    screen: '#0C0A09',
    surface: '#1C1917',
    surfaceMuted: '#292524',
    text: '#FAFAF9',
    textMuted: '#A8A29E',
    border: '#44403C',
    accent: '#FB923C',
    accentMuted: '#9A3412',
    success: '#4ADE80',
    successSoft: '#14532D',
    searchBg: '#292524',
    headerTitle: '#FDBA74',
    tabPill: '#166534',
    fab: '#F97316',
    cardShadow: '#00000055',
  },
} as const;

export type CategoryKey = 'WORK' | 'HEALTH' | 'PERSONAL' | 'IDEAS';

export const CategoryColors: Record<CategoryKey, string> = {
  WORK: '#2563EB',
  HEALTH: '#16A34A',
  PERSONAL: '#A855F7',
  IDEAS: '#EA580C',
};
