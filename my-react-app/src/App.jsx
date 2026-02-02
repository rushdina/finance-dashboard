import { useCallback, useState } from "react";
import "./App.css";
import StockForm from "./components/StockForm.jsx";
import StockList from "./components/StockList.jsx";
import StockContext from "./context/StockContext.jsx";

function App() {
  // shared stock list state
  const [stocks, setStocks] = useState([]); // array of objects
  /*
  stocks = [
    {
      symbol: "",
      quantity: "",
      purchasePrice: "",
      currentPrice: ""
    },
    {...},
  ]
  */

  // if have current price meaning the symbol is valid
  const fetchStockData = useCallback((symbol) => {
    const API_KEY = "42ZEWT4IRU5YGZ8I";
    return fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
          return null; // resolves with null if symbol invalid
        } else {
          return {
            symbol,
            currentPrice: parseFloat(data["Global Quote"]["05. price"]),
          }; // resolves with valid object
        }
      })
      .catch((error) => {
        console.error("Invalid symbol:", symbol, error);
        return null; // resolves with null if fetch fails
      });
  }, []);

  function addStock(newStock) {
    setStocks((prevStockArray) => [...prevStockArray, newStock]);
  }

  return (
    <StockContext.Provider
      value={{ stocks, setStocks, addStock, fetchStockData }}
    >
      <div className="app">
        <h1 className="page-title heading">Finance Dashboard</h1>
        <StockForm />
        <StockList />
      </div>
    </StockContext.Provider>
  );
}

export default App;
