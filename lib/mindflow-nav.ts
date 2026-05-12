import { router, type Href } from 'expo-router';

/**
 * Open the note editor. Use a string href so Expo Go / linking always get a path
 * after `/--/` (object + pathname `[id]` can resolve to an empty path → Unmatched Route).
 */
export function openNoteEditor(noteId: string): void {
  const href = `/note/${noteId}`;
  router.push(href as Href);
}

export function goNotesTab(): void {
  router.replace('/' as Href);
}

export function pushNotesTab(): void {
  router.push('/' as Href);
}

export function openSettingsTab(): void {
  router.push('/settings' as Href);
}
