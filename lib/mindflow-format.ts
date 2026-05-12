import type { MindflowNote } from '@/lib/mindflow-types';

export function newMindflowId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function previewFromBody(body: string, maxLen = 140): string {
  const oneLine = body.replace(/\s+/g, ' ').trim();
  if (oneLine.length <= maxLen) return oneLine || 'Empty note';
  return `${oneLine.slice(0, maxLen - 1)}…`;
}

export function formatShortDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function sortNotesByUpdatedDesc(notes: MindflowNote[]): MindflowNote[] {
  return [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
