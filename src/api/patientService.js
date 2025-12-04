import { getItem, saveItem } from "./asyncStorage";
import patientsData from "../data/initialPatients.json";

const PATIENT_KEY = "patients";

export const getPatients = async () => {
  // Always return fresh data from JSON for instant updates
  return patientsData;
};

export const addPatient = async (patient) => {
  const patients = await getPatients();
  const newList = [...patients, patient];
  await saveItem(PATIENT_KEY, newList);
  return newList;
};

export const updatePatient = async (id, updated) => {
  const patients = await getPatients();
  const newList = patients.map((p) => (p.id === id ? { ...p, ...updated } : p));
  await saveItem(PATIENT_KEY, newList);
  return newList;
};

export const deletePatient = async (id) => {
  const patients = await getPatients();
  const newList = patients.filter((p) => p.id !== id);
  await saveItem(PATIENT_KEY, newList);
  return newList;
};