// Merge stock if user added the same stock
export function mergeStock(existingStock, newStock) {
  const totalQty = existingStock.quantity + newStock.quantity;

  const avgPurchasePrice =
    (existingStock.purchasePrice * existingStock.quantity +
      newStock.purchasePrice * newStock.quantity) /
    totalQty;

  // {...} creates new stock object, copying all properties and overriding values
  return {
    ...existingStock,
    quantity: totalQty,
    purchasePrice: avgPurchasePrice,
  };
}

// Calculate profit/loss
export function calculateProfitLoss(stock) {
  if (stock.currentPrice === null) return null;
  return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
}
