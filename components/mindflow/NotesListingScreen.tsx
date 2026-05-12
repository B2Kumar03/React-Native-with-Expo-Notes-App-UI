import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NoteCard } from '@/components/mindflow/NoteCard';
import { useMindflow } from '@/context/mindflow-context';
import { openNoteEditor, openSettingsTab } from '@/lib/mindflow-nav';
import type { MindflowNote } from '@/lib/mindflow-types';

export function NotesListingScreen() {
  const {
    hydrated,
    sortedNotes,
    tags,
    activeTagFilter,
    setActiveTagFilter,
    prefs,
    setPrefs,
    colors,
    effectiveScheme,
    createNote,
    toggleStar,
    noteDisplay,
  } = useMindflow();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');

  const isDark = effectiveScheme === 'dark';
  const contentWidth = Math.min(width - 32, 560);
  const horizontalPad = Math.max(16, (width - contentWidth) / 2);

  const tagFiltered = useMemo(() => {
    if (!activeTagFilter) return sortedNotes;
    return sortedNotes.filter((n) => n.tagIds.includes(activeTagFilter));
  }, [sortedNotes, activeTagFilter]);

  const activeTagName = useMemo(
    () => tags.find((t) => t.id === activeTagFilter)?.name,
    [tags, activeTagFilter],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tagFiltered;
    return tagFiltered.filter((n) => {
      const { preview } = noteDisplay(n);
      return (
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        preview.toLowerCase().includes(q)
      );
    });
  }, [query, tagFiltered, noteDisplay]);

  const cardBase = useMemo(
    () =>
      StyleSheet.flatten([
        styles.card,
        {
          maxWidth: contentWidth,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          shadowColor: colors.cardShadow,
        },
      ]),
    [colors.border, colors.cardShadow, colors.surface, contentWidth],
  );

  const renderItem: ListRenderItem<MindflowNote> = useCallback(
    ({ item, index }) => {
      const { preview, dateLabel } = noteDisplay(item);
      const featured = prefs.focusFeatured && index === 0 && filtered.length > 0;
      return (
        <NoteCard
          note={item}
          preview={preview}
          dateLabel={dateLabel}
          featured={featured}
          colors={colors}
          isDark={isDark}
          cardBase={cardBase}
          onOpen={() => openNoteEditor(item.id)}
          onToggleStar={() => toggleStar(item.id)}
        />
      );
    },
    [cardBase, colors, filtered.length, isDark, noteDisplay, prefs.focusFeatured, toggleStar],
  );

  const onFab = useCallback(() => {
    const id = createNote();
    openNoteEditor(id);
  }, [createNote]);

  const onMenu = useCallback(() => {
    Alert.alert(
      'MindFlow',
      'Quick tips: pull-down search filters all text. Starred notes appear in the Starred tab. Tags are shared across notes.',
    );
  }, []);

  if (!hydrated) {
    return (
      <View style={[styles.boot, { backgroundColor: colors.screen }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={StyleSheet.compose(styles.safe, { backgroundColor: colors.screen })}
      edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: horizontalPad }]}>
        <Pressable accessibilityLabel="Menu" hitSlop={12} onPress={onMenu} style={styles.iconBtn}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.brand, { color: colors.headerTitle }]}>MindFlow</Text>
        <Pressable
          accessibilityLabel="Open settings"
          hitSlop={12}
          onPress={() => openSettingsTab()}
          style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      {activeTagFilter && activeTagName ? (
        <View style={[styles.filterBanner, { paddingHorizontal: horizontalPad }]}>
          <View style={[styles.filterPill, { backgroundColor: colors.successSoft, borderColor: colors.success }]}>
            <Ionicons name="pricetag" size={16} color={colors.success} />
            <Text style={[styles.filterPillText, { color: colors.text }]} numberOfLines={1}>
              {activeTagName}
            </Text>
            <Pressable hitSlop={8} onPress={() => setActiveTagFilter(null)} accessibilityLabel="Clear tag filter">
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={[styles.searchWrap, { paddingHorizontal: horizontalPad }]}>
        <View style={[styles.searchInner, { backgroundColor: colors.searchBg }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your mind…"
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
            autoCorrect={false}
            autoCapitalize="sentences"
          />
        </View>
      </View>

      <View style={[styles.switchPanel, { paddingHorizontal: horizontalPad }]}>
        <View style={[styles.switchRow, { borderColor: colors.border }]}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Follow system theme</Text>
          <Switch
            accessibilityLabel="Follow system light or dark mode"
            value={prefs.followSystem}
            onValueChange={(v) => setPrefs({ followSystem: v })}
            trackColor={{ false: colors.border, true: colors.accentMuted }}
            thumbColor={prefs.followSystem ? colors.accent : '#f4f3f4'}
          />
        </View>
        <View style={[styles.switchRow, { borderColor: colors.border, opacity: prefs.followSystem ? 0.45 : 1 }]}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Dark mode (manual)</Text>
          <Switch
            accessibilityLabel="When not following system, use dark theme"
            value={prefs.forceDark}
            onValueChange={(v) => setPrefs({ forceDark: v })}
            disabled={prefs.followSystem}
            trackColor={{ false: colors.border, true: colors.accentMuted }}
            thumbColor={prefs.forceDark ? colors.accent : '#f4f3f4'}
          />
        </View>
        <View style={[styles.switchRow, { borderColor: colors.border }]}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Focus featured note</Text>
          <Switch
            accessibilityLabel="Highlight the first visible note"
            value={prefs.focusFeatured}
            onValueChange={(v) => setPrefs({ focusFeatured: v })}
            trackColor={{ false: colors.border, true: colors.successSoft }}
            thumbColor={prefs.focusFeatured ? colors.success : '#f4f3f4'}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: horizontalPad,
            paddingBottom: 100,
          },
        ]}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            {query.trim() ? 'No notes match your search.' : 'No notes yet. Tap + to create one.'}
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create new note"
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.fab,
            right: horizontalPad + 8,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
        onPress={onFab}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 12,
  },
  iconBtn: {
    padding: 4,
    width: 40,
    alignItems: 'center',
  },
  brand: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterBanner: {
    marginBottom: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '100%',
  },
  filterPillText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  searchWrap: {
    marginBottom: 12,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  switchPanel: {
    gap: 0,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  switchLabel: {
    fontSize: 14,
    flex: 1,
    paddingRight: 12,
  },
  listContent: {
    paddingTop: 8,
    gap: 12,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
});
