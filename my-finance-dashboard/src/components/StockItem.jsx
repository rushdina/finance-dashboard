import "./StockList.css";

export default function StockItem({ stock, calculateProfitLoss }) {
  const profitLoss = calculateProfitLoss(stock);

  return (
    <li key={stock.id} className="stocklist-card">
      <p className="symbol">Symbol: {stock.symbol}</p>
      <p>Quantity: {stock.quantity}</p>
      <p>Purchase Price: ${stock.purchasePrice.toFixed(2)}</p>
      {stock.currentPrice !== null ? (
        <>
          <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
          <p
            style={{
              color: profitLoss > 0 ? "green" : profitLoss < 0 ? "red" : "gray",
            }}
            className="profit-loss"
          >
            <strong>
              Profit/Loss: {profitLoss > 0 ? "+" : profitLoss < 0 ? "-" : ""}$
              {Math.abs(profitLoss).toFixed(2)}
            </strong>
          </p>
        </>
      ) : (
        <p className="profit-loss">Loading price...</p>
      )}
    </li>
  );
}
