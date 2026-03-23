import { useMemo } from "react";
import "./App.css";
import StockForm from "./components/StockForm.jsx";
import StockList from "./components/StockList.jsx";
import StockContext from "./context/StockContext.jsx";
import useStocks from "./hooks/useStocks.js";

function App() {
  const { stocks, addOrMergeStock, fetchStockData, updateStockPrice } =
    useStocks();

  // without useMemo, this object is recreated as new object in memory
  const contextValue = useMemo(
    () => ({
      stocks,
      addOrMergeStock,
      fetchStockData,
      updateStockPrice,
    }),
    [stocks, fetchStockData, addOrMergeStock, updateStockPrice],
  );

  // useMemo helps keep the context value reference stable.
  // Without it, a new value object is created on every render,
  // which can cause all context consumers to re-render unnecessarily.
  return (
    <StockContext.Provider value={contextValue}>
      <StockForm />
      <StockList />
      <footer>&copy; 2026 Finance Dashboard</footer>
    </StockContext.Provider>
  );
}

export default App;
