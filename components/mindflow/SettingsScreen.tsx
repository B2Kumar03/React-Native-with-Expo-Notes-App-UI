import Constants from 'expo-constants';
import React, { useCallback } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMindflow } from '@/context/mindflow-context';
import { pushNotesTab } from '@/lib/mindflow-nav';

export function SettingsScreen() {
  const { hydrated, prefs, setPrefs, resetToSeed, colors } = useMindflow();
  const { width } = useWindowDimensions();
  const horizontalPad = Math.max(16, (width - Math.min(width - 32, 560)) / 2);

  const onReset = useCallback(() => {
    Alert.alert('Reset demo data?', 'All notes and tags will be restored to the built-in sample.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => void resetToSeed() },
    ]);
  }, [resetToSeed]);

  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

  if (!hydrated) {
    return (
      <View style={[styles.boot, { backgroundColor: colors.screen }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screen }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: horizontalPad, paddingBottom: 40 }]}>
        <Text style={[styles.title, { color: colors.headerTitle }]}>Settings</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>MindFlow · local-first notes</Text>

        <Text style={[styles.section, { color: colors.textMuted }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, { borderColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Follow system theme</Text>
            <Switch
              value={prefs.followSystem}
              onValueChange={(v) => setPrefs({ followSystem: v })}
              trackColor={{ false: colors.border, true: colors.accentMuted }}
              thumbColor={prefs.followSystem ? colors.accent : '#f4f3f4'}
            />
          </View>
          <View style={[styles.row, { borderColor: colors.border, opacity: prefs.followSystem ? 0.45 : 1 }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Dark mode (manual)</Text>
            <Switch
              value={prefs.forceDark}
              onValueChange={(v) => setPrefs({ forceDark: v })}
              disabled={prefs.followSystem}
              trackColor={{ false: colors.border, true: colors.accentMuted }}
              thumbColor={prefs.forceDark ? colors.accent : '#f4f3f4'}
            />
          </View>
          <View style={[styles.row, { borderColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Featured card on lists</Text>
            <Switch
              value={prefs.focusFeatured}
              onValueChange={(v) => setPrefs({ focusFeatured: v })}
              trackColor={{ false: colors.border, true: colors.successSoft }}
              thumbColor={prefs.focusFeatured ? colors.success : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={[styles.section, { color: colors.textMuted }]}>Data</Text>
        <Pressable
          onPress={onReset}
          style={({ pressed }) => [
            styles.dangerBtn,
            { borderColor: colors.accent, opacity: pressed ? 0.88 : 1 },
          ]}>
          <Text style={[styles.dangerBtnText, { color: colors.accent }]}>Reset to sample data</Text>
        </Pressable>

        <Text style={[styles.section, { color: colors.textMuted }]}>About</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.body, { color: colors.textMuted }]}>
            Built with Expo Router, AsyncStorage persistence, and React Native core primitives (FlatList,
            TextInput, Pressable, Switch, KeyboardAvoidingView, ImageBackground).
          </Text>
          <Text style={[styles.version, { color: colors.text }]}>Version {version}</Text>
        </View>

        <Pressable
          onPress={() => Linking.openURL('https://expo.dev')}
          style={({ pressed }) => [styles.link, { opacity: pressed ? 0.75 : 1 }]}>
          <Text style={[styles.linkText, { color: colors.accent }]}>Expo documentation</Text>
        </Pressable>

        <Pressable onPress={() => pushNotesTab()} style={styles.backNotes}>
          <Text style={[styles.backNotesText, { color: colors.text }]}>← Back to notes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: { flex: 1 },
  scroll: {
    paddingTop: 8,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  sub: {
    fontSize: 14,
    marginBottom: 16,
  },
  section: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    paddingRight: 12,
  },
  dangerBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerBtnText: {
    fontWeight: '700',
    fontSize: 15,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    padding: 14,
  },
  version: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  link: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  backNotes: {
    marginTop: 20,
    paddingVertical: 8,
  },
  backNotesText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
