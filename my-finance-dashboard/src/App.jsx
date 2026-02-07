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

  const API_KEY = import.meta.env.VITE_ALPHA_KEY;

  // useCallback: Memoize the function that fetches the stock data from the API to avoid unnecessary re-creations.
  // Shared API data for StockForm and StockList
  // Fetch current price if symbol is valid
  const fetchStockData = useCallback(
    (symbol) => {
      const primaryUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
      const demoUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`;

      // Validate symbol to get current price
      function validateSymbolAndGetPrice(data) {
        // ?. is optional chaining operator, checks if data exists, then checks data["Global Quote"], then checks data["Global Quote"]["05. price"]
        // if at any point is null/undefined, returns undefined
        const priceString = data?.["Global Quote"]?.["05. price"];
        const price = parseFloat(priceString); // parseFloat(undefined) = NaN
        return isNaN(price) || price === 0 ? null : price; // return null for invalid symbol
      }

      return fetch(primaryUrl)
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // to check the API rate limit response

          // if primaryURL API fail (rate limit)
          if (data.Information || data.Note || !data["Global Quote"]) {
            return fetch(demoUrl)
              .then((res) => res.json())
              .then((demoData) => {
                const price = validateSymbolAndGetPrice(demoData);
                return price;
              })
              .catch((error) => {
                console.error("Demo API fetch failed:", error);
                return null; // resolves with null if fetch fails
              });
          }

          // if primaryURL API success
          else {
            const price = validateSymbolAndGetPrice(data);
            return price;
          }
        })
        .catch((error) => {
          console.error("Primary API fetch failed:", error);
          return null;
        });
    },
    [API_KEY],
  );

  // Add new stock to the stock list state
  function addStock(newStock) {
    setStocks((prevStockArray) => [...prevStockArray, newStock]);
  }

  function updateStockPrice(id, price) {
    setStocks((prevStockArray) =>
      prevStockArray.map((stock) =>
        stock.id === id ? { ...stock, currentPrice: price } : stock,
      ),
    );
  }

  return (
    <StockContext.Provider
      value={{ stocks, addStock, fetchStockData, updateStockPrice }}
    >
      <>
        <StockForm />
        <StockList />
        <footer style={{ textAlign: "center", fontSize: "0.875rem" }}>
          &copy; 2026 MyFinanceDashboard
        </footer>
      </>
    </StockContext.Provider>
  );
}

export default App;
