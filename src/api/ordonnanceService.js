import { getItem, saveItem } from "./asyncStorage";

const ORDONNANCE_KEY = "ordonnances";

export const getOrdonnances = async () => {
  return (await getItem(ORDONNANCE_KEY)) || [];
};

export const addOrdonnance = async (ordonnance) => {
  const ords = await getOrdonnances();
  const newList = [...ords, ordonnance];
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};

export const updateOrdonnance = async (id, updated) => {
  const ords = await getOrdonnances();
  const newList = ords.map((o) => (o.id === id ? { ...o, ...updated } : o));
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};