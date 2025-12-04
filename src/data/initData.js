import { getItem, saveItem, clearAll } from '../api/asyncStorage';

export const initializeData = async () => {
  // Data is now loaded directly from JSON files for instant updates
  // Only initialize commandes which are created at runtime
  const existingCommandes = await getItem('commandes');
  if (!existingCommandes) {
    await saveItem('commandes', []);
  }
};

export const resetData = async () => {
  await clearAll();
  await initializeData();
};