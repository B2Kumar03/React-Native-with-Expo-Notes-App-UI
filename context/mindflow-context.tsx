import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { MindflowPalette, resolveMindflowScheme } from '@/constants/mindflow-theme';
import { formatShortDate, newMindflowId, previewFromBody, sortNotesByUpdatedDesc } from '@/lib/mindflow-format';
import { buildSeedPersisted, DEFAULT_PREFS } from '@/lib/mindflow-seed';
import { clearMindflowStorage, loadMindflowPersisted, saveMindflowPersisted } from '@/lib/mindflow-storage';
import type { MindflowNote, MindflowPrefs, MindflowTag } from '@/lib/mindflow-types';

type MindflowContextValue = {
  hydrated: boolean;
  notes: MindflowNote[];
  tags: MindflowTag[];
  prefs: MindflowPrefs;
  sortedNotes: MindflowNote[];
  activeTagFilter: string | null;
  setActiveTagFilter: (tagId: string | null) => void;
  effectiveScheme: 'light' | 'dark';
  colors: (typeof MindflowPalette)['light'] | (typeof MindflowPalette)['dark'];
  setPrefs: (patch: Partial<MindflowPrefs>) => void;
  createNote: () => string;
  updateNote: (id: string, patch: Partial<Pick<MindflowNote, 'title' | 'body' | 'category' | 'starred' | 'tagIds'>>) => void;
  deleteNote: (id: string) => void;
  toggleStar: (id: string) => void;
  getNote: (id: string) => MindflowNote | undefined;
  addTag: (name: string) => string | null;
  deleteTag: (tagId: string) => void;
  toggleTagOnNote: (noteId: string, tagId: string) => void;
  resetToSeed: () => void;
  noteDisplay: (note: MindflowNote) => { preview: string; dateLabel: string };
};

const MindflowContext = createContext<MindflowContextValue | null>(null);

export function MindflowProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [hydrated, setHydrated] = useState(false);
  const [notes, setNotes] = useState<MindflowNote[]>([]);
  const [tags, setTags] = useState<MindflowTag[]>([]);
  const [prefs, setPrefsState] = useState<MindflowPrefs>(DEFAULT_PREFS);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadMindflowPersisted();
      if (cancelled) return;
      setNotes(data.notes);
      setTags(data.tags);
      setPrefsState({ ...DEFAULT_PREFS, ...data.prefs });
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((nextNotes: MindflowNote[], nextTags: MindflowTag[], nextPrefs: MindflowPrefs) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveMindflowPersisted({ notes: nextNotes, tags: nextTags, prefs: nextPrefs });
    }, 280);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(notes, tags, prefs);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [hydrated, notes, tags, prefs, persist]);

  const setPrefs = useCallback((patch: Partial<MindflowPrefs>) => {
    setPrefsState((p) => ({ ...p, ...patch }));
  }, []);

  const effectiveScheme = resolveMindflowScheme(systemScheme, prefs.followSystem, prefs.forceDark);
  const colors = MindflowPalette[effectiveScheme];

  const sortedNotes = useMemo(() => sortNotesByUpdatedDesc(notes), [notes]);

  const getNote = useCallback((id: string) => notes.find((n) => n.id === id), [notes]);

  const createNote = useCallback(() => {
    const id = newMindflowId('n');
    const now = new Date().toISOString();
    const note: MindflowNote = {
      id,
      title: '',
      body: '',
      category: 'PERSONAL',
      starred: false,
      tagIds: [],
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    return id;
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<MindflowNote, 'title' | 'body' | 'category' | 'starred' | 'tagIds'>>) => {
      const now = new Date().toISOString();
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: now } : n)),
      );
    },
    [],
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    const now = new Date().toISOString();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred, updatedAt: now } : n)),
    );
  }, []);

  const addTag = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const exists = tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return null;
    const id = newMindflowId('t');
    setTags((prev) => [...prev, { id, name: trimmed }]);
    return id;
  }, [tags]);

  const deleteTag = useCallback((tagId: string) => {
    setActiveTagFilter((current) => (current === tagId ? null : current));
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    setNotes((prev) =>
      prev.map((n) => ({
        ...n,
        tagIds: n.tagIds.filter((tid) => tid !== tagId),
      })),
    );
  }, []);

  const toggleTagOnNote = useCallback((noteId: string, tagId: string) => {
    const now = new Date().toISOString();
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        const has = n.tagIds.includes(tagId);
        const tagIds = has ? n.tagIds.filter((t) => t !== tagId) : [...n.tagIds, tagId];
        return { ...n, tagIds, updatedAt: now };
      }),
    );
  }, []);

  const resetToSeed = useCallback(async () => {
    await clearMindflowStorage();
    const seed = buildSeedPersisted();
    setNotes(seed.notes);
    setTags(seed.tags);
    setPrefsState(seed.prefs);
    setActiveTagFilter(null);
    void saveMindflowPersisted(seed);
  }, []);

  const noteDisplay = useCallback(
    (note: MindflowNote) => ({
      preview: previewFromBody(note.body),
      dateLabel: formatShortDate(note.updatedAt),
    }),
    [],
  );

  const value = useMemo<MindflowContextValue>(
    () => ({
      hydrated,
      notes,
      tags,
      prefs,
      sortedNotes,
      activeTagFilter,
      setActiveTagFilter,
      effectiveScheme,
      colors,
      setPrefs,
      createNote,
      updateNote,
      deleteNote,
      toggleStar,
      getNote,
      addTag,
      deleteTag,
      toggleTagOnNote,
      resetToSeed,
      noteDisplay,
    }),
    [
      hydrated,
      notes,
      tags,
      prefs,
      sortedNotes,
      activeTagFilter,
      setActiveTagFilter,
      effectiveScheme,
      colors,
      setPrefs,
      createNote,
      updateNote,
      deleteNote,
      toggleStar,
      getNote,
      addTag,
      deleteTag,
      toggleTagOnNote,
      resetToSeed,
      noteDisplay,
    ],
  );

  return <MindflowContext.Provider value={value}>{children}</MindflowContext.Provider>;
}

export function useMindflow(): MindflowContextValue {
  const ctx = useContext(MindflowContext);
  if (!ctx) {
    throw new Error('useMindflow must be used within MindflowProvider');
  }
  return ctx;
}
