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
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}}`,
      // `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // to check the API rate limit request per day
        // Validate symbol for StockForm: a valid symbol has a current price
        const price = data["Global Quote"]["05. price"];
        // resolves with null if symbol is invalid, else resolves price
        return price ? parseFloat(price) : null;
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
        <StockForm />
        <StockList />
      </div>
    </StockContext.Provider>
  );
}

export default App;
