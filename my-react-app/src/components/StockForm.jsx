import "./StockForm.css";
import { useState } from "react";

export default function StockForm() {
  const [formInput, setFormInput] = useState({
    stockSymbol: "",
    quantity: "",
    purchasePrice: "",
  }); // object keys match form input "name" attributes

  function handleInputChange(event) {
    const { name, value } = event.target; // object destructure
    setFormInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value, // formInput[event.target.name]: event.target.value
      };
    });
  }

  return (
    <div className="stock-form-container">
      <h1 className="page-title heading">Finance Dashboard</h1>
      <form className="stock-form">
        <input
          type="text"
          name="stockSymbol"
          value={formInput.stockSymbol}
          onChange={handleInputChange}
          placeholder="Stock Symbol"
          className="form-input"
        />
        <input
          type="number"
          name="quantity"
          value={formInput.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          className="form-input"
        />
        <input
          type="number"
          name="purchasePrice"
          value={formInput.purchasePrice}
          onChange={handleInputChange}
          placeholder="Purchase Price"
          className="form-input"
        />
        <button className="add-stock-btn">Add Stock</button>
      </form>
    </div>
  );
}
