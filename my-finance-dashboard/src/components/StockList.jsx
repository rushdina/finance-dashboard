import "./StockList.css";
import StockContext from "../context/StockContext";
import { useContext, useEffect } from "react";
import StockItem from "./StockItem";

export default function StockList() {
  // useContext: Access the stock list state from the StockContext in the necessary components.
  const { stocks, fetchStockData, updateStockPrice } = useContext(StockContext);

  // useEffect: Fetch the current stock prices from the API when the component mounts and whenever the stock list is updated.
  useEffect(() => {
    stocks.forEach((stock) => {
      // only fetch if currentPrice is null to prevent unnecessary calls
      if (stock.currentPrice !== null) return;

      fetchStockData(stock.symbol).then((result) => {
        if (result.error) return;
        updateStockPrice(stock.symbol, result.price);
      });
    });
  }, [stocks, fetchStockData, updateStockPrice]);

  function calculateProfitLoss(stock) {
    if (stock.currentPrice === null) return null;
    return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
  }

  return (
    <main className="container">
      <h2 className="stocklist-heading">Stock List</h2>
      {stocks.length === 0 ? (
        <p style={{ textAlign: "center" }}>No stocks added yet.</p>
      ) : (
        <ul className="stocklist-container">
          {stocks.map((stock) => (
            <StockItem
              key={stock.id}
              stock={stock}
              calculateProfitLoss={calculateProfitLoss}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
