import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMindflow } from '@/context/mindflow-context';
import { pushNotesTab } from '@/lib/mindflow-nav';
import type { MindflowTag } from '@/lib/mindflow-types';

export function TagsScreen() {
  const { hydrated, tags, notes, addTag, deleteTag, colors, setActiveTagFilter } = useMindflow();
  const { width } = useWindowDimensions();
  const [draft, setDraft] = useState('');

  const horizontalPad = Math.max(16, (width - Math.min(width - 32, 560)) / 2);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of tags) map[t.id] = 0;
    for (const n of notes) {
      for (const tid of n.tagIds) {
        if (map[tid] !== undefined) map[tid] += 1;
      }
    }
    return map;
  }, [tags, notes]);

  const onCreate = useCallback(() => {
    const id = addTag(draft);
    setDraft('');
    if (id) {
      /* success */
    } else if (draft.trim()) {
      Alert.alert('Duplicate', 'A tag with that name already exists.');
    }
  }, [addTag, draft]);

  const onDelete = useCallback(
    (tag: MindflowTag) => {
      Alert.alert('Remove tag', `Remove “${tag.name}” from all notes?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => deleteTag(tag.id) },
      ]);
    },
    [deleteTag],
  );

  const renderItem: ListRenderItem<MindflowTag> = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => {
          setActiveTagFilter(item.id);
          pushNotesTab();
        }}
        onLongPress={() => onDelete(item)}
        style={({ pressed }) =>
          StyleSheet.flatten([
            styles.row,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              opacity: pressed ? 0.92 : 1,
            },
          ])
        }>
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
            {counts[item.id] ?? 0} notes · tap to filter · long-press to delete
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Pressable>
    ),
    [colors, counts, onDelete, setActiveTagFilter],
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
        <Text style={[styles.title, { color: colors.headerTitle }]}>Tags</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>Organize and filter at a glance</Text>
      </View>

      <View style={[styles.createRow, { paddingHorizontal: horizontalPad }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="New tag name"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          onSubmitEditing={onCreate}
        />
        <Pressable
          onPress={onCreate}
          style={({ pressed }) =>
            StyleSheet.flatten([
              styles.addBtn,
              { backgroundColor: colors.accent, opacity: pressed ? 0.9 : 1 },
            ])
          }>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={tags}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingHorizontal: horizontalPad, paddingBottom: 32, gap: 10 }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>No tags yet. Create one above.</Text>
        }
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
    paddingBottom: 12,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  sub: {
    fontSize: 14,
  },
  createRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  addBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  list: {
    paddingTop: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  rowMeta: {
    fontSize: 12,
  },
});
