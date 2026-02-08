import "./StockList.css";
import StockContext from "../context/StockContext";
import { useContext, useEffect } from "react";

export default function StockList() {
  // useContext: Access the stock list state from the StockContext in the necessary components.
  const { stocks, fetchStockData, updateStockPrice } = useContext(StockContext);

  // useEffect: Fetch the current stock prices from the API when the component mounts and whenever the stock list is updated.
  useEffect(() => {
    stocks.forEach((stock) => {
      // only fetch if currentPrice: null
      if (stock.currentPrice !== null) return;

      fetchStockData(stock.symbol).then((price) => {
        if (price === null) return;
        updateStockPrice(stock.symbol, price);
      });
    });
  }, [stocks, fetchStockData, updateStockPrice]);

  const stockListElements = stocks.map((stock) => {
    const profitLoss =
      stock.currentPrice !== null
        ? (stock.currentPrice - stock.purchasePrice) * stock.quantity
        : null;

    return (
      <li key={stock.id} className="stocklist-card">
        <p>
          <b>Symbol:</b> {stock.symbol}
        </p>
        <p>Quantity: {stock.quantity}</p>
        <p>Purchase Price: ${stock.purchasePrice.toFixed(2)}</p>
        {stock.currentPrice !== null ? (
          <>
            <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
            <p
              style={{
                color:
                  profitLoss > 0 ? "green" : profitLoss < 0 ? "red" : "gray",
              }}
              className="profit-loss"
            >
              <strong>
                Profit/Loss: {profitLoss > 0 ? "+" : "-"}$
                {Math.abs(profitLoss).toFixed(2)}
                {/* Math.abs to remove "-" */}
              </strong>
            </p>
          </>
        ) : (
          <p className="profit-loss">Loading price...</p>
        )}
      </li>
    );
  });

  return (
    <main className="container">
      <h2 className="stocklist-heading">Stock List</h2>
      {stocks.length === 0 ? (
        <p style={{ textAlign: "center" }}>No stocks added yet.</p>
      ) : (
        <ul className="stocklist-container">{stockListElements}</ul>
      )}
    </main>
  );
}
