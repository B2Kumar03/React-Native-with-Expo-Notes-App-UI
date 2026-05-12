import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NoteCard } from '@/components/mindflow/NoteCard';
import { useMindflow } from '@/context/mindflow-context';
import { openNoteEditor, pushNotesTab } from '@/lib/mindflow-nav';
import type { MindflowNote } from '@/lib/mindflow-types';

export function StarredNotesScreen() {
  const {
    hydrated,
    sortedNotes,
    prefs,
    colors,
    effectiveScheme,
    toggleStar,
    noteDisplay,
  } = useMindflow();
  const { width } = useWindowDimensions();

  const starred = useMemo(
    () => sortedNotes.filter((n) => n.starred),
    [sortedNotes],
  );

  const isDark = effectiveScheme === 'dark';
  const contentWidth = Math.min(width - 32, 560);
  const horizontalPad = Math.max(16, (width - contentWidth) / 2);

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
      const featured = prefs.focusFeatured && index === 0 && starred.length > 0;
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
    [cardBase, colors, isDark, noteDisplay, prefs.focusFeatured, starred.length, toggleStar],
  );

  if (!hydrated) {
    return (
      <View style={[styles.boot, { backgroundColor: colors.screen }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screen }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.title, { color: colors.headerTitle }]}>Starred</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>{starred.length} saved</Text>
      </View>
      <FlatList
        data={starred}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingHorizontal: horizontalPad, paddingBottom: 48, gap: 12 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="star-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No starred notes</Text>
            <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
              Open a note and tap the star in the header or on a card.
            </Text>
            <Pressable
              onPress={() => pushNotesTab()}
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: colors.accent, opacity: pressed ? 0.9 : 1 },
              ]}>
              <Text style={styles.ctaText}>Browse notes</Text>
            </Pressable>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
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
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  sub: {
    fontSize: 14,
  },
  list: {
    paddingTop: 8,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  cta: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
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
