import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { NoteEditorScreen } from '@/components/mindflow/NoteEditorScreen';

export default function NoteRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = Array.isArray(id) ? id[0] : id;
  if (!noteId) {
    return null;
  }
  return <NoteEditorScreen noteId={noteId} />;
}
