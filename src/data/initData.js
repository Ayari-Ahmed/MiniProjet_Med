import { getItem, saveItem } from '../api/asyncStorage';
const users = require('./initialUsers.json');
const patients = require('./initialPatients.json');
const medicaments = require('./medicamentPresetList.json');
const ordonnances = require('./initialOrdonnances.json');
const pharmacies = require('./pharmacieList.json');

export const initializeData = async () => {
  // Check if users are already loaded
  const existingUsers = await getItem('users');
  if (!existingUsers) {
    await saveItem('users', users);
  }

  const existingPatients = await getItem('patients');
  if (!existingPatients) {
    await saveItem('patients', patients);
  }

  const existingMedicaments = await getItem('medicaments');
  if (!existingMedicaments) {
    await saveItem('medicaments', medicaments);
  }

  const existingOrdonnances = await getItem('ordonnances');
  if (!existingOrdonnances) {
    await saveItem('ordonnances', ordonnances);
  }

  const existingPharmacies = await getItem('pharmacies');
  if (!existingPharmacies) {
    await saveItem('pharmacies', pharmacies);
  }

  const existingCommandes = await getItem('commandes');
  if (!existingCommandes) {
    await saveItem('commandes', []);
  }
};