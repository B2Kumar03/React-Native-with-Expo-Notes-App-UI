import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryColors, type CategoryKey } from '@/constants/mindflow-theme';
import { useMindflow } from '@/context/mindflow-context';
import { goNotesTab, openSettingsTab } from '@/lib/mindflow-nav';

const HEADER_IMAGE = require('@/assets/images/partial-react-logo.png');

const CATEGORIES: CategoryKey[] = ['WORK', 'HEALTH', 'PERSONAL', 'IDEAS'];

function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

type NoteEditorScreenProps = {
  noteId: string;
};

export function NoteEditorScreen({ noteId }: NoteEditorScreenProps) {
  const {
    hydrated,
    notes,
    getNote,
    updateNote,
    deleteNote,
    toggleStar,
    tags,
    toggleTagOnNote,
    addTag,
    colors,
    effectiveScheme,
  } = useMindflow();

  const { width, height } = useWindowDimensions();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedNoteId = useRef<string | null>(null);

  const note = getNote(noteId);

  useEffect(() => {
    if (!hydrated) return;
    const n = getNote(noteId);
    if (!n) {
      goNotesTab();
      return;
    }
    if (lastSyncedNoteId.current !== noteId) {
      lastSyncedNoteId.current = noteId;
      setTitle(n.title);
      setBody(n.body);
      setShowTagInput(false);
      setTagDraft('');
    }
  }, [hydrated, noteId, getNote, notes]);

  const flushSave = useCallback(() => {
    if (!noteId || !getNote(noteId)) return;
    updateNote(noteId, { title, body });
  }, [noteId, title, body, getNote, updateNote]);

  useEffect(() => {
    if (!hydrated || !note) return;
    if (saveDebounce.current) clearTimeout(saveDebounce.current);
    saveDebounce.current = setTimeout(() => {
      updateNote(noteId, { title, body });
    }, 700);
    return () => {
      if (saveDebounce.current) clearTimeout(saveDebounce.current);
    };
  }, [title, body, noteId, hydrated, note, updateNote]);

  const contentMax = Math.min(width - 32, 640);
  const padX = Math.max(16, (width - contentMax) / 2);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0;
  const minEditorHeight = Math.max(220, height * 0.32);

  const words = useMemo(() => countWords(`${title}\n${body}`), [title, body]);

  const headerTintStyle = StyleSheet.flatten([
    styles.headerTint,
    {
      backgroundColor:
        effectiveScheme === 'dark' ? 'rgba(12,10,9,0.82)' : 'rgba(255,247,237,0.88)',
    },
  ]);

  const onBack = useCallback(() => {
    flushSave();
    if (router.canGoBack()) {
      router.back();
    } else {
      goNotesTab();
    }
  }, [flushSave]);

  const onSave = useCallback(() => {
    flushSave();
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved', 'Your note is stored on this device.');
  }, [flushSave]);

  const onShare = useCallback(async () => {
    try {
      await Share.share({
        title: title.trim() || 'Note',
        message: `${title.trim() || 'Untitled'}\n\n${body}`,
      });
    } catch {
      /* user dismissed */
    }
  }, [title, body]);

  const onDelete = useCallback(() => {
    Alert.alert('Delete note', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNote(noteId);
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          goNotesTab();
        },
      },
    ]);
  }, [deleteNote, noteId]);

  const appendToBody = useCallback((snippet: string) => {
    setBody((b) => (b.endsWith('\n') || b.length === 0 ? `${b}${snippet}` : `${b}\n${snippet}`));
  }, []);

  const onAddTagSubmit = useCallback(() => {
    const id = addTag(tagDraft);
    setTagDraft('');
    setShowTagInput(false);
    if (id) {
      toggleTagOnNote(noteId, id);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (tagDraft.trim()) {
      Alert.alert('Tag exists', 'Try a different name.');
    }
  }, [addTag, tagDraft, toggleTagOnNote, noteId]);

  if (!hydrated || !note) {
    return (
      <View style={[styles.boot, { backgroundColor: colors.screen }]}>
        <Text style={{ color: colors.textMuted }}>Loading…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.screen }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={HEADER_IMAGE}
            style={styles.headerBg}
            imageStyle={styles.headerBgImage}
            resizeMode="cover">
            <View style={headerTintStyle}>
              <View style={[styles.headerRow, { paddingHorizontal: padX }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  hitSlop={12}
                  onPress={onBack}
                  style={({ pressed }) => [styles.roundBtn, pressed && styles.roundBtnPressed]}>
                  <Ionicons name="chevron-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.headerTitle }]}>MindFlow</Text>
                <View style={styles.headerActions}>
                  <Pressable
                    accessibilityLabel="Star note"
                    hitSlop={10}
                    onPress={() => toggleStar(noteId)}
                    style={styles.iconGhost}>
                    <Ionicons
                      name={note.starred ? 'star' : 'star-outline'}
                      size={22}
                      color={note.starred ? colors.accent : colors.text}
                    />
                  </Pressable>
                  <Pressable accessibilityLabel="Delete note" hitSlop={10} onPress={onDelete} style={styles.iconGhost}>
                    <Ionicons name="trash-outline" size={21} color={colors.textMuted} />
                  </Pressable>
                  <Pressable hitSlop={10} onPress={onShare} style={styles.iconGhost}>
                    <Ionicons name="share-outline" size={22} color={colors.text} />
                  </Pressable>
                  <Pressable
                    onPress={onSave}
                    style={({ pressed }) =>
                      StyleSheet.compose(styles.saveBtn, pressed && styles.saveBtnPressed)
                    }>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable onPress={() => openSettingsTab()} style={[styles.themeLink, { paddingHorizontal: padX }]}>
                <Text style={[styles.themeLinkText, { color: colors.textMuted }]}>
                  Theme & display → Settings
                </Text>
              </Pressable>
            </View>
          </ImageBackground>

          <View style={[styles.body, { paddingHorizontal: padX }]}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {CATEGORIES.map((cat) => {
                const active = note.category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => updateNote(noteId, { category: cat })}
                    style={({ pressed }) =>
                      StyleSheet.flatten([
                        styles.catChip,
                        {
                          borderColor: active ? CategoryColors[cat] : colors.border,
                          backgroundColor: active ? colors.surfaceMuted : colors.surface,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ])
                    }>
                    <Text style={[styles.catChipText, { color: active ? CategoryColors[cat] : colors.textMuted }]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Tags</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
              {tags.map((tag) => {
                const on = note.tagIds.includes(tag.id);
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() => toggleTagOnNote(noteId, tag.id)}
                    style={({ pressed }) => [
                      styles.tagChip,
                      {
                        backgroundColor: on ? colors.successSoft : colors.surfaceMuted,
                        borderWidth: on ? 1 : 0,
                        borderColor: colors.success,
                        opacity: pressed ? 0.88 : 1,
                      },
                    ]}>
                    <Text style={[styles.tagChipText, { color: colors.text }]}>{tag.name}</Text>
                  </Pressable>
                );
              })}
              {showTagInput ? (
                <View style={[styles.tagInputWrap, { borderColor: colors.border }]}>
                  <TextInput
                    value={tagDraft}
                    onChangeText={setTagDraft}
                    placeholder="New tag"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.tagInput, { color: colors.text }]}
                    onSubmitEditing={onAddTagSubmit}
                    autoFocus
                  />
                  <Pressable onPress={onAddTagSubmit} style={styles.tagInputGo}>
                    <Text style={{ color: colors.accent, fontWeight: '700' }}>Add</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => setShowTagInput(true)}
                  style={[styles.addTag, { borderColor: colors.border }]}>
                  <Text style={[styles.addTagText, { color: colors.accent }]}>+ Add tag</Text>
                </Pressable>
              )}
            </ScrollView>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor={colors.textMuted}
              style={StyleSheet.compose(styles.titleInput, { color: colors.text })}
            />

            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Start writing…"
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              style={StyleSheet.compose(
                StyleSheet.flatten([
                  styles.bodyInput,
                  { color: colors.text, minHeight: minEditorHeight, borderColor: colors.border },
                ]),
                effectiveScheme === 'dark' ? styles.bodyInputDark : styles.bodyInputLight,
              )}
            />
          </View>
        </ScrollView>

        <View
          style={StyleSheet.flatten([
            styles.toolbar,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.surface,
              paddingHorizontal: padX,
            },
          ])}>
          <Pressable hitSlop={8} onPress={() => appendToBody('**important**')} style={styles.toolBtn}>
            <Text style={[styles.toolBold, { color: colors.text }]}>B</Text>
          </Pressable>
          <Pressable hitSlop={8} onPress={() => appendToBody('*emphasis*')} style={styles.toolBtn}>
            <Text style={[styles.toolItalic, { color: colors.text }]}>I</Text>
          </Pressable>
          <Pressable hitSlop={8} onPress={() => appendToBody('- ')} style={styles.toolBtn}>
            <Ionicons name="list" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={8} onPress={() => appendToBody('```\n\n```')} style={styles.toolBtn}>
            <Ionicons name="code-slash-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={8} onPress={() => appendToBody('> ')} style={styles.toolBtn}>
            <Ionicons name="chatbox-ellipses-outline" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.toolbarSpacer} />
          <Text style={[styles.wordCount, { color: colors.textMuted }]}>{words} words</Text>
        </View>
      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerBg: {
    width: '100%',
  },
  headerBgImage: {
    transform: [{ scale: 1.15 }],
    opacity: 0.35,
  },
  headerTint: {
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    gap: 4,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnPressed: {
    opacity: 0.7,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    flexShrink: 0,
  },
  iconGhost: {
    padding: 4,
  },
  saveBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  saveBtnPressed: {
    opacity: 0.88,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  themeLink: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  themeLinkText: {
    fontSize: 12,
    fontWeight: '500',
  },
  body: {
    paddingTop: 16,
    gap: 10,
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  catRow: {
    gap: 8,
    alignItems: 'center',
    paddingRight: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagsRow: {
    gap: 8,
    alignItems: 'center',
    paddingRight: 8,
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tagInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 4,
    minWidth: 140,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    minWidth: 60,
  },
  tagInputGo: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    paddingVertical: 4,
  },
  bodyInput: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  bodyInputLight: {
    backgroundColor: '#FFFFFF',
  },
  bodyInputDark: {
    backgroundColor: '#292524',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 18 : 12,
    gap: 2,
  },
  toolBtn: {
    padding: 8,
    borderRadius: 10,
  },
  toolBold: {
    fontSize: 18,
    fontWeight: '800',
  },
  toolItalic: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  toolbarSpacer: {
    flex: 1,
  },
  wordCount: {
    fontSize: 12,
    fontWeight: '500',
  },
});
