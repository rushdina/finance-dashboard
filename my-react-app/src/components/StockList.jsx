import "./StockList.css";
import StockContext from "../context/StockContext";
import { useContext, useEffect } from "react";

export default function StockList() {
  // useContext: Access the stock list state from the StockContext in the necessary components.
  const { stocks, fetchStockData, setStocks } = useContext(StockContext);

  // useEffect: Fetch the current stock prices from the API when the component mounts and whenever the stock list is updated.
  useEffect(() => {
    stocks.forEach((stock) => {
      fetchStockData(stock.symbol).then((price) => {
        if (price) {
          setStocks((prevStockArray) =>
            prevStockArray.map((s) =>
              s.symbol === stock.symbol ? { ...s, currentPrice: price } : s,
            ),
          );
        }
      });
    });
  }, [stocks, fetchStockData, setStocks]);

  const stockListElements = stocks.map((stock) => {
    const profitLoss =
      stock.currentPrice !== null
        ? (stock.currentPrice - stock.purchasePrice) * stock.quantity
        : null;

    return (
      <li key={stock.symbol}>
        <p>Symbol: {stock.symbol}</p>
        <p>Quantity: {stock.quantity}</p>
        <p>Purchase Price: ${stock.purchasePrice}</p>
        {stock.currentPrice !== null ? (
          <>
            <p>Current Price: ${stock.currentPrice}</p>
            <p style={{ color: profitLoss > 0 ? "green" : "red" }}>
              Profit/Loss: {profitLoss > 0 ? "+" : "-"}${profitLoss.toFixed(2)}
            </p>
          </>
        ) : (
          <p>Loading current price and profit/loss...</p>
        )}
      </li>
    );
  });

  return (
    <section>
      <h2 className="heading">Stock List</h2>
      <div className="stock-list">
        {stocks.length === 0 ? (
          <p>No stocks added yet.</p>
        ) : (
          <ul className="stock-list-card">{stockListElements}</ul>
        )}
      </div>
    </section>
  );
}
