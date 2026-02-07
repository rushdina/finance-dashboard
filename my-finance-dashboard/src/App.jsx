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

      return fetch(primaryUrl)
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // to check the API rate limit response

          // if primaryURL API fail
          if (data.Information || data.Note || !data["Global Quote"]) {
            return fetch(demoUrl)
              .then((res) => res.json())
              .then((demoData) => {
                // Validate symbol for StockForm: a valid symbol has a current price
                if (
                  demoData["Global Quote"] &&
                  demoData["Global Quote"]["05. price"]
                ) {
                  console.log(demoData);
                  return parseFloat(demoData["Global Quote"]["05. price"]); // resolves with price
                } else {
                  return null; // resolves with null if symbol is invalid
                }
              })
              .catch((error) => {
                console.error(error);
                return null; // resolves with null if fetch fails
              });
          }

          // if primaryURL API success
          else if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
            return parseFloat(data["Global Quote"]["05. price"]); // valid symbol, return price
          } else {
            return null; // invalid symbol, return null
          }
        })
        .catch((error) => {
          console.error(error);
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
