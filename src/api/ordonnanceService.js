import { getItem, saveItem } from "./asyncStorage";
import ordonnancesData from "../data/initialOrdonnances.json";

const ORDONNANCE_KEY = "ordonnances";

export const getOrdonnances = async () => {
  const saved = await getItem(ORDONNANCE_KEY);
  return saved || ordonnancesData;
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

export const updateOrdonnanceStatus = async (id, status) => {
  const ords = await getOrdonnances();
  const newList = ords.map((o) =>
    o.id === id ? { ...o, status } : o
  );
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};

export const deleteOrdonnance = async (id) => {
  const ords = await getOrdonnances();
  const newList = ords.filter((o) => o.id !== id);
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};