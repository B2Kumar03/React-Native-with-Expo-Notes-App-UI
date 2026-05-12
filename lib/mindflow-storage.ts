import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildSeedPersisted } from '@/lib/mindflow-seed';
import type { MindflowPersisted } from '@/lib/mindflow-types';

const STORAGE_KEY = '@mindflow/persisted_v1';

export async function loadMindflowPersisted(): Promise<MindflowPersisted> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return buildSeedPersisted();
    }
    const parsed = JSON.parse(raw) as MindflowPersisted;
    if (!parsed?.notes || !Array.isArray(parsed.notes)) {
      return buildSeedPersisted();
    }
    return {
      notes: parsed.notes,
      tags: Array.isArray(parsed.tags) ? parsed.tags : buildSeedPersisted().tags,
      prefs: {
        ...buildSeedPersisted().prefs,
        ...(parsed.prefs ?? {}),
      },
    };
  } catch {
    return buildSeedPersisted();
  }
}

export async function saveMindflowPersisted(data: MindflowPersisted): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore disk errors for demo app */
  }
}

export async function clearMindflowStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
