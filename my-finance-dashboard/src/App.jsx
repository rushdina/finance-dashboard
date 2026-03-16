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
      id: "",
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
    async (symbol) => {
      const primaryUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

      // Validate symbol to get current price
      function validateSymbolAndGetPrice(data) {
        // ?. is optional chaining operator, checks if data exists, then checks data["Global Quote"], then checks data["Global Quote"]["05. price"]
        // if at any point is null/undefined, returns undefined
        const priceString = data?.["Global Quote"]?.["05. price"];
        const price = parseFloat(priceString); // parseFloat(undefined || "") = NaN
        return isNaN(price) || price === 0 ? null : price; // return null for invalid symbol
      }

      try {
        const res = await fetch(primaryUrl);
        const data = await res.json();

        console.log(data); // to check the API rate limit response

        // Rate limit or API message
        if (data.Information || data.Note) {
          return { error: "rate-limit" };
        }

        // Invalid symbol / no quote
        if (!data["Global Quote"]) {
          return { error: "invalid-symbol" };
        }

        const price = validateSymbolAndGetPrice(data);

        if (price === null) {
          return { error: "invalid-symbol" };
        }

        return { price }; // return resolved value
      } catch (error) {
        console.error("API fetch failed:", error);
        return { error: "network" };
      }
    },
    [API_KEY],
  );

  // Add new stock to the stock list state
  function addOrMergeStock(newStock) {
    // setStocks((prevStockArray) => [...prevStockArray, newStock]);

    setStocks((prevStockArray) => {
      const existingStock = prevStockArray.find(
        (stock) => stock.symbol === newStock.symbol,
      ); // if true, return stock obj item

      if (!existingStock) {
        return [...prevStockArray, newStock]; // exit addStock function
      }

      const totalQty = existingStock.quantity + newStock.quantity;
      const avgPurchasePrice =
        (existingStock.purchasePrice * existingStock.quantity +
          newStock.purchasePrice * newStock.quantity) /
        totalQty;

      // .map loops through each array item, transform it, returns new array
      return prevStockArray.map((stock) => {
        return stock.symbol === newStock.symbol
          ? // {...} creates new stock object, copying all properties and overriding values if user added same stock symbol
            { ...stock, quantity: totalQty, purchasePrice: avgPurchasePrice }
          : stock;
      });
    });
  }

  // update price in stock state
  function updateStockPrice(symbol, price) {
    setStocks((prevStockArray) =>
      prevStockArray.map((stock) =>
        stock.symbol === symbol ? { ...stock, currentPrice: price } : stock,
      ),
    );
  }

  return (
    <StockContext.Provider
      value={{ stocks, addOrMergeStock, fetchStockData, updateStockPrice }}
    >
      <>
        <StockForm />
        <StockList />
        <footer>&copy; 2026 Finance Dashboard</footer>
      </>
    </StockContext.Provider>
  );
}

export default App;
