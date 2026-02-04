import { nanoid } from "nanoid";
import "./StockForm.css";
import { useContext, useState } from "react";
import StockContext from "../context/StockContext.jsx";

export default function StockForm() {
  // useContext: Access the stock list state from the StockContext in the necessary components.
  const { addStock, fetchStockData } = useContext(StockContext);

  // useState: Manage the state of the stock form inputs.
  const [formInput, setFormInput] = useState({
    symbol: "",
    quantity: "",
    purchasePrice: "",
  }); // object keys match form input "name" attributes

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormInput((prevInput) => ({
      ...prevInput,
      [name]: value, // [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const symbol = formInput.symbol.trim().toUpperCase();

    // Validate symbol
    // use .then because fetchStockData is asynchronous function returns a Promise
    fetchStockData(symbol).then((price) => {
      // price is the return resolved value
      if (!price) {
        alert(`Invalid Stock Symbol: ${symbol}`);
        return;
      }

      // When symbol is valid, add price to stock list
      addStock({
        id: nanoid(), // generate unique id for each symbol added
        symbol,
        quantity: parseInt(formInput.quantity),
        purchasePrice: parseFloat(formInput.purchasePrice),
        currentPrice: price,
      });

      setFormInput({
        symbol: "",
        quantity: "",
        purchasePrice: "",
      });
    });
  }

  return (
    <section className="header container">
      <h1 className="dashboard-heading">Finance Dashboard</h1>
      <form className="stock-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="symbol"
          value={formInput.symbol}
          onChange={handleInputChange}
          placeholder="Stock Symbol"
          className="form-input"
          required
        />
        <input
          type="number"
          name="quantity"
          min="1" // prevent -ve values
          step="1" // whole numbers only
          value={formInput.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          className="form-input"
          required
        />
        <input
          type="number"
          name="purchasePrice"
          min="0.01" // prevent - ve values
          step="0.01" // 2 decimals for price
          value={formInput.purchasePrice}
          onChange={handleInputChange}
          placeholder="Purchase Price"
          className="form-input"
          required
        />
        <button type="submit" className="add-stock-btn">
          Add Stock
        </button>
      </form>
    </section>
  );
}
