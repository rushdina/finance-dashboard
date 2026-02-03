import "./StockList.css";
import StockContext from "../context/StockContext";
import { useContext } from "react";

export default function StockList() {
  // useContext: Access the stock list state from the StockContext in the necessary components.
  const { stocks } = useContext(StockContext);

  const stockListElements = stocks.map((stock) => {
    const profitLoss =
      (stock.currentPrice - stock.purchasePrice) * stock.quantity;

    return (
      <li key={stock.symbol}>
        <p>Symbol: {stock.symbol}</p>
        <p>Quantity: {stock.quantity}</p>
        <p>Purchase Price: ${stock.purchasePrice}</p>
        <p>Current Price: ${stock.currentPrice}</p>
        <p style={{ color: profitLoss > 0 ? "green" : "red" }}>
          Profit/Loss: {profitLoss > 0 ? "+" : "-"}${profitLoss.toFixed(2)}
        </p>
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
