import { create } from "zustand";
import { getCommandes, addCommande, updateCommandeStatus } from "../api/commandeService";

export const useCommandeStore = create((set) => ({
  commandes: [],

  loadCommandes: async () => {
    const data = await getCommandes();
    set({ commandes: data });
  },

  addCommande: async (commande) => {
    const updated = await addCommande(commande);
    set({ commandes: updated });
  },

  updateCommandeStatus: async (id, status) => {
    const newList = await updateCommandeStatus(id, status);
    set({ commandes: newList });
  }
}));