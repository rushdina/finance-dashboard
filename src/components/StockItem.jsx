import "./StockList.css";

export default function StockItem({ stock, profitLoss }) {
  const profitLossClass =
    profitLoss > 0
      ? "profit-positive"
      : profitLoss < 0
        ? "profit-negative"
        : "profit-neutral";

  return (
    <li className="stocklist-card">
      <p className="symbol">Symbol: {stock.symbol}</p>
      <p>Quantity: {stock.quantity}</p>
      <p>Purchase Price: ${stock.purchasePrice.toFixed(2)}</p>

      {stock.currentPrice !== null ? (
        <>
          <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
          <p className={`profit-loss ${profitLossClass}`}>
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
