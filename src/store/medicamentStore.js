import { create } from "zustand";
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from "../api/medicamentService";

export const useMedicamentStore = create((set) => ({
  medicaments: [],

  loadMedicaments: async () => {
    const data = await getMedicaments();
    set({ medicaments: data });
  },

  addMedicament: async (med) => {
    const updated = await addMedicament(med);
    set({ medicaments: updated });
  },

  updateMedicament: async (id, updated) => {
    const newList = await updateMedicament(id, updated);
    set({ medicaments: newList });
  },

  deleteMedicament: async (id) => {
    const newList = await deleteMedicament(id);
    set({ medicaments: newList });
  }
}));