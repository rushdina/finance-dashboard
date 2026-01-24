import "./StockForm.css";

export default function StockForm() {
  return (
    <div className="stock-form-container">
      <h1 className="page-title heading">Finance Dashboard</h1>
      <form className="stock-form">
        <input
          type="text"
          name="stockSymbol"
          id="stockSymbol"
          placeholder="Stock Symbol"
          className="form-input"
        />
        <input
          type="number"
          name="quantity"
          id="quantity"
          placeholder="Quantity"
          className="form-input"
        />
        <input
          type="number"
          name="purchasePrice"
          id="purchasePrice"
          placeholder="Purchase Price"
          className="form-input"
        />
        <button className="add-stock-btn">Add Stock</button>
      </form>
    </div>
  );
}
