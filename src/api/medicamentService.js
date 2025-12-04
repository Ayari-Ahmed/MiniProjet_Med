import { getItem, saveItem } from "./asyncStorage";
import medicamentsData from "../data/initialMedicaments.json";

const MEDICAMENT_KEY = "medicaments";

export const getMedicaments = async () => {
  // Check asyncStorage first, fall back to JSON data if nothing stored
  const stored = await getItem(MEDICAMENT_KEY);
  return stored || medicamentsData;
};

export const addMedicament = async (medicament) => {
  const meds = await getMedicaments();
  const newList = [...meds, medicament];
  await saveItem(MEDICAMENT_KEY, newList);
  return newList;
};

export const updateMedicament = async (id, updated) => {
  const meds = await getMedicaments();
  const newList = meds.map((m) => (m.id === id ? { ...m, ...updated } : m));
  await saveItem(MEDICAMENT_KEY, newList);
  return newList;
};

export const deleteMedicament = async (id) => {
  const meds = await getMedicaments();
  const newList = meds.filter((m) => m.id !== id);
  await saveItem(MEDICAMENT_KEY, newList);
  return newList;
};

export const getMedicamentById = async (id) => {
  const meds = await getMedicaments();
  return meds.find((m) => m.id === id);
};