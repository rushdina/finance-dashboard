import { useState } from "react";
import "./App.css";
import StockForm from "./components/StockForm.jsx";
import StockList from "./components/StockList.jsx";
import StockContext from "./context/StockContext.jsx";

function App() {
  // shared stock list state
  const [stocks, setStocks] = useState([]); // array of objects

  function addStock(newStock) {
    setStocks((prevStockArray) => [...prevStockArray, newStock]);
  }

  return (
    <StockContext.Provider value={{ stocks, setStocks, addStock }}>
      <div className="app">
        <h1 className="page-title heading">Finance Dashboard</h1>
        <StockForm />
        <StockList />
      </div>
    </StockContext.Provider>
  );
}

export default App;
