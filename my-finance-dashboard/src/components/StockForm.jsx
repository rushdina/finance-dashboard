import { nanoid } from "nanoid";
import "./StockForm.css";
import { useContext, useState } from "react";
import StockContext from "../context/StockContext.jsx";

export default function StockForm() {
  // useContext: Access the stock list state from the StockContext in the necessary components.
  const { addOrMergeStock, fetchStockData } = useContext(StockContext);

  // Local states
  // useState: Manage the state of the stock form inputs.
  const [formInput, setFormInput] = useState({
    symbol: "",
    quantity: "",
    purchasePrice: "",
  }); // object keys match form input "name" attributes

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [symbolError, setSymbolError] = useState("");
  const [apiError, setApiError] = useState("");

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormInput((prevInput) => ({
      ...prevInput,
      [name]: value, // [event.target.name]: event.target.value
    }));

    setSymbolError("");
    setApiError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const symbol = formInput.symbol.trim().toUpperCase();
    setIsSubmitting(true);

    // Validate symbol
    // use .then because fetchStockData is asynchronous function returns a Promise
    fetchStockData(symbol).then((result) => {
      // result is the resolved object returned from fetchStockData
      if (result.error === "rate-limit") {
        setApiError(
          "Too many requests. Please wait a few seconds and try again.",
        );
        setIsSubmitting(false);
        setSymbolError("");
        return;
      }

      if (result.error === "invalid-symbol") {
        setSymbolError(`Invalid Stock Symbol: ${symbol}`);
        setIsSubmitting(false);
        setApiError("");
        return;
      }

      if (result.error === "network") {
        setApiError("Network error. Please try again.");
        setIsSubmitting(false);
        setSymbolError("");
        return;
      }

      // When symbol is valid, add price to stock list
      addOrMergeStock({
        id: nanoid(), // generate unique id for each symbol added
        symbol,
        quantity: parseInt(formInput.quantity),
        purchasePrice: parseFloat(formInput.purchasePrice),
        currentPrice: result.price,
      });

      // Clear form and error on success
      setFormInput({
        symbol: "",
        quantity: "",
        purchasePrice: "",
      });

      setSymbolError("");
      setApiError("");
      setIsSubmitting(false);
    });
  }

  return (
    <header className="header">
      <div className="container">
        <h1 className="dashboard-heading">Finance Dashboard</h1>
        <form className="stock-form" onSubmit={handleSubmit}>
          <div className="stock-label-input">
            <label htmlFor="symbol">Stock Symbol:</label>
            <input
              type="text"
              name="symbol"
              id="symbol"
              value={formInput.symbol}
              onChange={handleInputChange}
              placeholder="AAPL"
              className={`form-input ${symbolError ? "input-error" : ""}`}
              required
            />
            {symbolError && (
              <p className="error-text" aria-live="polite">
                {symbolError}
              </p>
            )}
          </div>
          <div className="stock-label-input">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              min="1" // prevent -ve values
              step="1" // whole numbers only
              value={formInput.quantity}
              onChange={handleInputChange}
              placeholder="1"
              className="form-input"
              required
            />
          </div>
          <div className="stock-label-input">
            <label htmlFor="purchasePrice">Purchase Price:</label>
            <input
              type="number"
              name="purchasePrice"
              id="purchasePrice"
              min="0.01" // prevent - ve values
              step="0.01" // 2 decimals for price
              value={formInput.purchasePrice}
              onChange={handleInputChange}
              placeholder="0.01"
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`add-stock-btn ${symbolError ? "center-btn" : "end-btn"}`}
          >
            {isSubmitting ? "Adding..." : "Add Stock"}
          </button>
        </form>
        {apiError && (
          <p
            className="error-text api-error-text"
            aria-live="polite"
            style={{ textAlign: "center", marginTop: "10px" }}
          >
            {apiError}
          </p>
        )}
      </div>
    </header>
  );
}
