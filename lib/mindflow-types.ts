import type { CategoryKey } from '@/constants/mindflow-theme';

export type MindflowNote = {
  id: string;
  title: string;
  body: string;
  category: CategoryKey;
  starred: boolean;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type MindflowTag = {
  id: string;
  name: string;
};

export type MindflowPrefs = {
  followSystem: boolean;
  forceDark: boolean;
  focusFeatured: boolean;
};

export type MindflowPersisted = {
  notes: MindflowNote[];
  tags: MindflowTag[];
  prefs: MindflowPrefs;
};
