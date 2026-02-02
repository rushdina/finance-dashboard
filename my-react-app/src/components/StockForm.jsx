import "./StockForm.css";
import { useContext, useState } from "react";
import StockContext from "../context/StockContext.jsx";

export default function StockForm() {
  const { addStock } = useContext(StockContext);

  const [formInput, setFormInput] = useState({
    symbol: "",
    quantity: "",
    purchasePrice: "",
  }); // object keys match form input "name" attributes

  function handleInputChange(event) {
    const { name, value } = event.target; // object destructure
    setFormInput((prevInput) => ({
      ...prevInput,
      [name]: value, // [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // setStock((prev) => [
    //   ...prev,
    //   {
    //     symbol: formInput.symbol.toUpperCase(),
    //     quantity: parseFloat(formInput.quantity),
    //     purchasePrice: parseFloat(formInput.purchasePrice),
    //   },
    // ]);

    addStock({
      symbol: formInput.symbol.toUpperCase(),
      quantity: parseInt(formInput.quantity),
      purchasePrice: parseFloat(formInput.purchasePrice),
    });

    setFormInput({
      symbol: "",
      quantity: "",
      purchasePrice: "",
    });
  }

  return (
    <div className="stock-form-container">
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
    </div>
  );
}
