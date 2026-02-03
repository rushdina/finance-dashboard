import { useCallback, useState } from "react";
import "./App.css";
import StockForm from "./components/StockForm.jsx";
import StockList from "./components/StockList.jsx";
import StockContext from "./context/StockContext.jsx";

function App() {
  // useState: Manage the state of the stock list.
  const [stocks, setStocks] = useState([]);
  console.log("Added stock list:", stocks); // array of objects
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

  // useCallback: Memoize the function that fetches the stock data from the API to avoid unnecessary re-creations.
  // Shared API data for StockForm and StockList
  // Fetch current price if symbol is valid
  const fetchStockData = useCallback((symbol) => {
    const API_KEY = "GUMKPIWP8O8HWRR5";
    return fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // to check the API rate limit request per day
        // Validate symbol for StockForm: a valid symbol has a current price
        if (!data["Global Quote"] || !data["Global Quote"]["05. price"]) {
          return null; // resolves with null if symbol is invalid
        } else {
          console.log(data); // only logs if symbol is valid
          // return {
          //   currentPrice: parseFloat(data["Global Quote"]["05. price"]),
          // };
          // return resolves object of currentPrice (for StockList)
        }
      })
      .catch((error) => {
        console.error(error);
        return null; // resolves with null if fetch fails
      });
  }, []);

  // Add new stock to the stock list state
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
