import "./StockList.css";

export default function StockList() {
  return (
    <>
      <h2 className="heading">Stock List</h2>
      <div>
        <p>No stocks added yet.</p>
      </div>
      <div className="stock-list-container">
        <div className="stock-list-card">
          <p>
            Symbol: <span></span>
          </p>
          <p>
            Quantity: <span></span>
          </p>
          <p>
            Purchase Price: <span></span>
          </p>
          <p>
            Current Price: <span></span>
          </p>
          <p>
            Profit/Loss: <span></span>
          </p>
        </div>
      </div>
    </>
  );
}
