import { create } from "zustand";
import { getMedicaments, addMedicament, updateMedicament, deleteMedicament } from "../api/medicamentService";
import { getCommandes, updateCommandeStatus } from "../api/commandeService";
import { getOrdonnances } from "../api/ordonnanceService";
import { updateStock } from "../api/pharmacyStockService";
import { useAuthStore } from "./authStore";

export const useMedicamentStore = create((set) => ({
  medicaments: [],

  loadMedicaments: async () => {
    const data = await getMedicaments();
    set({ medicaments: data });
  },

  addMedicament: async (med) => {
    const updated = await addMedicament(med);
    set({ medicaments: updated });

    // If current user is a pharmacist, add initial stock for their pharmacy
    const { currentUser } = useAuthStore.getState();
    if (currentUser && currentUser.role === 'pharmacien' && med.quantiteStock) {
      await updateStock(currentUser.id, med.id, med.quantiteStock);
    }
  },

  updateMedicament: async (id, updated) => {
    const oldMedicament = (await getMedicaments()).find(m => m.id === id);
    const newList = await updateMedicament(id, updated);
    set({ medicaments: newList });

    // If stock level changed and current user is a pharmacist, update pharmacy stock
    if (oldMedicament && updated.quantiteStock !== undefined &&
        oldMedicament.quantiteStock !== updated.quantiteStock) {
      const { currentUser } = useAuthStore.getState();
      if (currentUser && currentUser.role === 'pharmacien') {
        // Update stock for this pharmacy and medicament
        await updateStock(currentUser.id, id, updated.quantiteStock);
      }
    }
  },

  deleteMedicament: async (id) => {
    // Delete the medicament
    const newList = await deleteMedicament(id);
    set({ medicaments: newList });
  }
}));