import { getItem, saveItem } from "./asyncStorage";
import pharmacyStockData from "../data/pharmacyStock.json";

const PHARMACY_STOCK_KEY = "pharmacyStock";

export const getPharmacyStock = async () => {
  const saved = await getItem(PHARMACY_STOCK_KEY);
  return saved || pharmacyStockData;
};

export const updateStock = async (pharmacieId, medicamentId, newStock) => {
  const stocks = await getPharmacyStock();
  const existingStockIndex = stocks.findIndex(stock =>
    stock.pharmacieId === pharmacieId && stock.medicamentId === medicamentId
  );

  let oldStock = 0;
  let updatedStocks;

  if (existingStockIndex >= 0) {
    // Update existing stock entry
    oldStock = stocks[existingStockIndex].stock;
    updatedStocks = stocks.map((stock, index) =>
      index === existingStockIndex
        ? { ...stock, stock: newStock }
        : stock
    );
  } else {
    // Create new stock entry
    const newStockEntry = {
      pharmacieId,
      medicamentId,
      stock: newStock
    };
    updatedStocks = [...stocks, newStockEntry];
  }

  await saveItem(PHARMACY_STOCK_KEY, updatedStocks);

  let cancelledOrders = [];
  let restoredOrders = [];

  // If stock decreased, check and cancel orders if stock became insufficient
  if (newStock < oldStock) {
    cancelledOrders = await checkAndCancelOrdersForLowStock(pharmacieId, medicamentId);
  }
  // If stock increased, check and restore orders if stock became sufficient
  else if (newStock > oldStock) {
    restoredOrders = await checkAndRestoreOrdersForAvailableStock(pharmacieId, medicamentId);
  }

  return { stocks: updatedStocks, cancelledOrders, restoredOrders };
};

export const getStockForPharmacy = async (pharmacieId, medicamentId) => {
  const stocks = await getPharmacyStock();
  const stockEntry = stocks.find(
    stock => stock.pharmacieId === pharmacieId && stock.medicamentId === medicamentId
  );
  return stockEntry ? stockEntry.stock : 0;
};

export const checkStockAvailability = async (pharmacieId, medicamentId, requiredQuantity) => {
  const currentStock = await getStockForPharmacy(pharmacieId, medicamentId);
  return currentStock >= requiredQuantity;
};

export const checkAndCancelOrdersForLowStock = async (pharmacieId, medicamentId) => {
  const { getCommandes, updateCommandeStatus } = await import('./commandeService');
  const { getOrdonnances } = await import('./ordonnanceService');

  const commandes = await getCommandes();
  const ordonnances = await getOrdonnances();

  // Find pending orders for this pharmacy that include this medicine
  const affectedOrders = commandes.filter(cmd =>
    (cmd.status === 'en_attente' || cmd.status === 'en_preparation') &&
    cmd.pharmacieId === pharmacieId &&
    ordonnances.find(ord =>
      ord.id === cmd.ordonnanceId &&
      ord.medicaments.some(med =>
        (med.idMedicament || med.id) === medicamentId
      )
    )
  );

  const cancelledOrders = [];

  for (const order of affectedOrders) {
    const ordonnance = ordonnances.find(ord => ord.id === order.ordonnanceId);
    if (!ordonnance) continue;

    // Check if any medicine in this order is now out of stock
    let shouldCancel = false;
    for (const med of ordonnance.medicaments) {
      const requiredQuantity = med.quantiteParJour * med.duree;
      const isAvailable = await checkStockAvailability(pharmacieId, med.idMedicament || med.id, requiredQuantity);
      if (!isAvailable) {
        shouldCancel = true;
        break;
      }
    }

    if (shouldCancel) {
      await updateCommandeStatus(order.id, 'annule_stock_insuffisant');
      cancelledOrders.push(order.id);
    }
  }

  return cancelledOrders;
};

export const checkAndRestoreOrdersForAvailableStock = async (pharmacieId, medicamentId) => {
  const { getCommandes, updateCommandeStatus } = await import('./commandeService');
  const { getOrdonnances } = await import('./ordonnanceService');

  const commandes = await getCommandes();
  const ordonnances = await getOrdonnances();

  // Find cancelled orders due to stock insufficiency for this pharmacy that include this medicine
  const affectedOrders = commandes.filter(cmd =>
    cmd.status === 'annule_stock_insuffisant' &&
    cmd.pharmacieId === pharmacieId &&
    ordonnances.find(ord =>
      ord.id === cmd.ordonnanceId &&
      ord.medicaments.some(med =>
        (med.idMedicament || med.id) === medicamentId
      )
    )
  );

  const restoredOrders = [];

  for (const order of affectedOrders) {
    const ordonnance = ordonnances.find(ord => ord.id === order.ordonnanceId);
    if (!ordonnance) continue;

    // Check if all medicines in this order are now available
    let canRestore = true;
    for (const med of ordonnance.medicaments) {
      const requiredQuantity = med.quantiteParJour * med.duree;
      const isAvailable = await checkStockAvailability(pharmacieId, med.idMedicament || med.id, requiredQuantity);
      if (!isAvailable) {
        canRestore = false;
        break;
      }
    }

    if (canRestore) {
      // Restore to 'en_attente' status
      await updateCommandeStatus(order.id, 'en_attente');
      restoredOrders.push(order.id);
    }
  }

  return restoredOrders;
};