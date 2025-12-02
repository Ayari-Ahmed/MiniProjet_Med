import { create } from "zustand";
import { getPatients, addPatient, updatePatient, deletePatient } from "../api/patientService";

export const usePatientStore = create((set) => ({
  patients: [],

  loadPatients: async () => {
    const data = await getPatients();
    set({ patients: data });
  },

  addPatient: async (patient) => {
    const updated = await addPatient(patient);
    set({ patients: updated });
  },

  updatePatient: async (id, updated) => {
    const newList = await updatePatient(id, updated);
    set({ patients: newList });
  },

  deletePatient: async (id) => {
    const newList = await deletePatient(id);
    set({ patients: newList });
  }
}));