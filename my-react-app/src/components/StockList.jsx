import "./StockList.css";
import StockContext from "../context/StockContext";
import { useContext } from "react";

export default function StockList() {
  const { stocks } = useContext(StockContext);

  const stockListElements = stocks.map((stock) => (
    <li key={stock.symbol}>
      <p>Symbol: {stock.symbol}</p>
      <p>Quantity: {stock.quantity}</p>
      <p>Purchase Price: {stock.purchasePrice}</p>
      <p>Current Price: {stock.currentPrice}</p>
      <p>Profit/Loss: </p>
    </li>
  ));

  return (
    <section>
      <h2 className="heading">Stock List</h2>
      <div className="stock-list-container">
        {stocks.length === 0 ? (
          <p>No stocks added yet.</p>
        ) : (
          <ul className="stock-list-card">{stockListElements}</ul>
        )}
      </div>
    </section>
  );
}
