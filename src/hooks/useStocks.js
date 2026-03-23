import { useCallback, useState } from "react";
import { fetchStockQuote } from "../api/stockAPI";
import { mergeStock } from "../utils/stockUtils";

export default function useStocks() {
  // useState: Manage the state of the stock list
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

  const apiKey = import.meta.env.VITE_ALPHA_KEY;

  // useCallback: Memoize the function that fetches the stock data from the API to avoid unnecessary re-creations.
  // Fetch current price if symbol is valid
  const fetchStockData = useCallback(
    async (symbol) => {
      return await fetchStockQuote(symbol, apiKey);
    },
    [apiKey],
  );

  // Add new stock to the stock list state
  const addOrMergeStock = useCallback((newStock) => {
    setStocks((prevStocks) => {
      const existingStock = prevStocks.find(
        (stock) => stock.symbol === newStock.symbol,
      ); // if true, return stock obj item

      if (!existingStock) {
        return [...prevStocks, newStock];
      } // exit addStock function

      return prevStocks.map((stock) =>
        stock.symbol === newStock.symbol ? mergeStock(stock, newStock) : stock,
      );
    });
  }, []);

  // Update current price in stock state
  const updateStockPrice = useCallback((symbol, price) => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.symbol === symbol ? { ...stock, currentPrice: price } : stock,
      ),
    );
  }, []);

  return {
    stocks,
    addOrMergeStock,
    fetchStockData,
    updateStockPrice,
  };
}
