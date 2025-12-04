import { create } from "zustand";
import { getOrdonnances, addOrdonnance, updateOrdonnance, updateOrdonnanceStatus, deleteOrdonnance } from "../api/ordonnanceService";

export const useOrdonnanceStore = create((set) => ({
  ordonnances: [],

  loadOrdonnances: async () => {
    const data = await getOrdonnances();
    set({ ordonnances: data });
  },

  addOrdonnance: async (ordonnance) => {
    const updated = await addOrdonnance(ordonnance);
    set({ ordonnances: updated });
  },

  updateOrdonnance: async (id, updated) => {
    const newList = await updateOrdonnance(id, updated);
    set({ ordonnances: newList });
  },

  updateOrdonnanceStatus: async (id, status) => {
    const newList = await updateOrdonnanceStatus(id, status);
    set({ ordonnances: newList });
  },

  deleteOrdonnance: async (id) => {
    const newList = await deleteOrdonnance(id);
    set({ ordonnances: newList });
  }
}));