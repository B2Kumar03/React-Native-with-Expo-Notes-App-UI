import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { CategoryColors, MindflowPalette } from '@/constants/mindflow-theme';
import type { MindflowNote } from '@/lib/mindflow-types';

type Colors = (typeof MindflowPalette)['light'] | (typeof MindflowPalette)['dark'];

type NoteCardProps = {
  note: MindflowNote;
  preview: string;
  dateLabel: string;
  featured: boolean;
  colors: Colors;
  isDark: boolean;
  cardBase: ViewStyle;
  onOpen: () => void;
  onToggleStar: () => void;
};

export function NoteCard({
  note,
  preview,
  dateLabel,
  featured,
  colors,
  isDark,
  cardBase,
  onOpen,
  onToggleStar,
}: NoteCardProps) {
  const accent = CategoryColors[note.category];
  const cardStyle = StyleSheet.compose(
    cardBase,
    featured ? (isDark ? styles.cardFeaturedDark : styles.cardFeaturedLight) : styles.cardPlain,
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open note ${note.title || 'Untitled'}`}
      style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}
      onPress={onOpen}>
      <View style={cardStyle as ViewStyle}>
        <View style={[styles.cardAccent, { backgroundColor: accent }]} />
        <View style={styles.cardInner}>
          <View style={styles.cardTopRow}>
            <Text
              style={StyleSheet.compose(
                styles.cardTitle,
                featured ? styles.cardTitleOnAccent : { color: colors.text },
              )}
              numberOfLines={1}>
              {note.title.trim() || 'Untitled'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={note.starred ? 'Remove star' : 'Star note'}
              hitSlop={10}
              onPress={onToggleStar}>
              <Ionicons
                name={note.starred ? 'star' : 'star-outline'}
                size={20}
                color={featured ? '#FFF7ED' : note.starred ? colors.accent : colors.textMuted}
              />
            </Pressable>
          </View>
          <Text
            style={StyleSheet.compose(
              styles.cardPreview,
              featured ? styles.cardPreviewOnAccent : { color: colors.textMuted },
            )}
            numberOfLines={2}>
            {preview}
          </Text>
          <View style={styles.cardMetaRow}>
            <Text
              style={StyleSheet.compose(
                styles.cardDate,
                featured ? styles.cardDateOnAccent : { color: colors.textMuted },
              )}>
              {dateLabel}
            </Text>
            <View
              style={StyleSheet.compose(
                styles.tag,
                featured ? styles.tagOnAccent : { backgroundColor: colors.surfaceMuted },
              )}>
              <Text
                style={StyleSheet.compose(
                  styles.tagText,
                  featured ? styles.tagTextOnAccent : { color: accent },
                )}>
                {note.category}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardPressable: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardPlain: {},
  cardFeaturedLight: {
    backgroundColor: '#EA580C',
    borderColor: '#C2410C',
  },
  cardFeaturedDark: {
    backgroundColor: '#9A3412',
    borderColor: '#7C2D12',
  },
  cardAccent: {
    width: 5,
  },
  cardInner: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  cardTitleOnAccent: {
    color: '#FFFFFF',
  },
  cardPreview: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardPreviewOnAccent: {
    color: '#FFEDD5',
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 12,
  },
  cardDateOnAccent: {
    color: '#FED7AA',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagOnAccent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  tagTextOnAccent: {
    color: '#FFFFFF',
  },
});
