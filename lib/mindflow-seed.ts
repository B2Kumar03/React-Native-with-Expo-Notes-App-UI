import type { MindflowNote, MindflowPersisted, MindflowTag } from '@/lib/mindflow-types';

const TAG_PERSONAL = 'tag_personal';
const TAG_Q3 = 'tag_q3';
const TAG_WORK = 'tag_work';

export const SEED_TAGS: MindflowTag[] = [
  { id: TAG_PERSONAL, name: 'Personal' },
  { id: TAG_Q3, name: 'Q3 Planning' },
  { id: TAG_WORK, name: 'Work' },
];

const now = new Date();

function iso(d: Date): string {
  return d.toISOString();
}

export const SEED_NOTES: MindflowNote[] = [
  {
    id: 'seed_1',
    title: 'Research Findings',
    body:
      'Key insights from the Q3 user interviews. Participants valued speed and clarity above visual flair.\n\nNext steps: synthesize themes and share with design.',
    category: 'WORK',
    starred: true,
    tagIds: [TAG_WORK, TAG_Q3],
    createdAt: iso(new Date(now.getFullYear(), 9, 20)),
    updatedAt: iso(new Date(now.getFullYear(), 9, 24)),
  },
  {
    id: 'seed_2',
    title: 'Morning Routine',
    body:
      'Hydrate, stretch, ten minutes of journaling. Keep the streak going for at least 21 days.\n\nOptional: short walk before deep work.',
    category: 'HEALTH',
    starred: false,
    tagIds: [TAG_PERSONAL],
    createdAt: iso(new Date(now.getFullYear(), 9, 18)),
    updatedAt: iso(new Date(now.getFullYear(), 9, 22)),
  },
  {
    id: 'seed_3',
    title: 'Book highlights — Deep Work',
    body: '“Clarity about what matters provides clarity about what does not.”\n\n— Cal Newport',
    category: 'PERSONAL',
    starred: true,
    tagIds: [TAG_PERSONAL],
    createdAt: iso(new Date(now.getFullYear(), 9, 15)),
    updatedAt: iso(new Date(now.getFullYear(), 9, 20)),
  },
  {
    id: 'seed_4',
    title: 'App ideas backlog',
    body:
      '1. Habit tracker with gentle reminders\n2. Offline-first notes with sync\n3. Voice capture for quick capture on the go',
    category: 'IDEAS',
    starred: false,
    tagIds: [TAG_Q3],
    createdAt: iso(new Date(now.getFullYear(), 9, 12)),
    updatedAt: iso(new Date(now.getFullYear(), 9, 18)),
  },
  {
    id: 'seed_5',
    title: 'Weekly retro',
    body:
      'What went well: shipping the MVP. What to improve: estimation and scope.\n\nAction items: smaller slices, earlier spikes.',
    category: 'WORK',
    starred: false,
    tagIds: [TAG_WORK],
    createdAt: iso(new Date(now.getFullYear(), 9, 10)),
    updatedAt: iso(new Date(now.getFullYear(), 9, 15)),
  },
];

export const DEFAULT_PREFS: MindflowPersisted['prefs'] = {
  followSystem: true,
  forceDark: false,
  focusFeatured: true,
};

export function buildSeedPersisted(): MindflowPersisted {
  return {
    notes: SEED_NOTES,
    tags: SEED_TAGS,
    prefs: { ...DEFAULT_PREFS },
  };
}
