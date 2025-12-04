import { getItem, saveItem } from "./asyncStorage";
import pharmaciesData from "../data/pharmacieList.json";

const PHARMACIE_KEY = "pharmacies";

export const getPharmacies = async () => {
  // Always return fresh data from JSON for instant updates
  return pharmaciesData;
};

export const addPharmacie = async (pharmacie) => {
  const pharmacies = await getPharmacies();
  const newList = [...pharmacies, pharmacie];
  await saveItem(PHARMACIE_KEY, newList);
  return newList;
};

export const updatePharmacie = async (id, updated) => {
  const pharmacies = await getPharmacies();
  const newList = pharmacies.map((p) => (p.id === id ? { ...p, ...updated } : p));
  await saveItem(PHARMACIE_KEY, newList);
  return newList;
};

export const deletePharmacie = async (id) => {
  const pharmacies = await getPharmacies();
  const newList = pharmacies.filter((p) => p.id !== id);
  await saveItem(PHARMACIE_KEY, newList);
  return newList;
};