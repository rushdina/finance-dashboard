import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useContext, useState } from "react";
import App from "../App.jsx";
import StockContext from "../context/StockContext.jsx";

// Helper component to access context object in tests
function TestContextAccessor({ callback }) {
  // context obj contains Provider’s value={{ stocks, addOrMergeStock, fetchStockData, updateStockPrice }} provided by <StockContext.Provider>
  const context = useContext(StockContext); // useContext gives current value of context
  callback(context);
  return null; // renders nothing
}

// Wrapper to provide StockContext in tests
function StockProviderWrapper({ callback }) {
  const [stocks, setStocks] = useState([]);

  const addOrMergeStock = (newStock) => {
    setStocks((prevStocks) => {
      const existing = prevStocks.find((s) => s.symbol === newStock.symbol);
      if (existing) {
        const totalQuantity = existing.quantity + newStock.quantity;
        const avgPrice =
          (existing.quantity * existing.purchasePrice +
            newStock.quantity * newStock.purchasePrice) /
          totalQuantity;
        return prevStocks.map((s) =>
          s.symbol === newStock.symbol
            ? { ...s, quantity: totalQuantity, purchasePrice: avgPrice }
            : s,
        );
      } else {
        return [...prevStocks, newStock];
      }
    });
  };

  const updateStockPrice = (symbol, price) => {
    setStocks((prev) =>
      prev.map((s) =>
        s.symbol === symbol ? { ...s, currentPrice: price } : s,
      ),
    );
  };

  const fetchStockData = async () => {
    return null; // mock fetch
  };

  return (
    <StockContext.Provider
      value={{ stocks, addOrMergeStock, updateStockPrice, fetchStockData }}
    >
      <TestContextAccessor callback={callback} />
    </StockContext.Provider>
  );
}

// Test suite for App.jsx
describe("App component", () => {
  // Test 1: App renders children: StockForm, StockList, footer
  it("renders StockForm, StockList, and footer", () => {
    // Arrange: render App
    render(<App />);
    // Act: No additional actions needed
    // Assert:
    expect(
      screen.getByRole("heading", { level: 1, name: /Finance Dashboard/i }),
    ).toBeInTheDocument(); // StockForm heading <h1>
    expect(
      screen.getByRole("heading", { level: 2, name: /Stock List/i }),
    ).toBeInTheDocument(); // StockList heading <h2>
    expect(screen.getByText(/© 2026 Finance Dashboard/i)).toBeInTheDocument(); // Footer
  });

  // Test 2: context provides required functions and initial state
  it("provides stocks array and functions in context", () => {
    // Arrange
    let contextValue;
    render(<StockProviderWrapper callback={(v) => (contextValue = v)} />); // contextValue now contains the context value object

    // Assert that contextValue provides required properties
    expect(contextValue).toHaveProperty("stocks"); // checks context has property "stocks"
    expect(Array.isArray(contextValue.stocks)).toBe(true); // initialize stocks as empty array
    expect(contextValue).toHaveProperty("addOrMergeStock");
    expect(typeof contextValue.addOrMergeStock).toBe("function"); // property is a function
    expect(contextValue).toHaveProperty("updateStockPrice");
    expect(typeof contextValue.updateStockPrice).toBe("function");
    expect(contextValue).toHaveProperty("fetchStockData");
    expect(typeof contextValue.fetchStockData).toBe("function");
  });

  // Test 3: add a new stock
  it("adds a new stock to the stocks state", () => {
    // Arrange
    let contextValue;
    render(<StockProviderWrapper callback={(v) => (contextValue = v)} />);

    // Act: add a stock
    // Calls the addOrMergeStock function from context
    // Adds a new stock object to the stocks state in App
    act(() => {
      contextValue.addOrMergeStock({
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 0,
      });
    });

    // Assert: stocks array has length 1 and correct values
    expect(contextValue.stocks).toHaveLength(1);
    expect(contextValue.stocks[0].symbol).toBe("AAPL");
    expect(contextValue.stocks[0].quantity).toBe(2);
    expect(contextValue.stocks[0].purchasePrice).toBe(10);
  });

  // Test 4: merge duplicate stocks
  it("merges duplicate stock symbols with correct quantity and average price", () => {
    // Arrange
    let contextValue;
    render(<StockProviderWrapper callback={(v) => (contextValue = v)} />);

    // Act: add initial stock to array
    act(() => {
      contextValue.addOrMergeStock({
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 0,
      });

      // Act: add same stock symbol with different quantity & purchase price
      // to trigger merging logic in addOrMergeStock
      contextValue.addOrMergeStock({
        id: "2",
        symbol: "AAPL",
        quantity: 3,
        purchasePrice: 20,
        currentPrice: 0,
      });
    });

    // Assert: stocks array has length 1
    expect(contextValue.stocks).toHaveLength(1);
    expect(contextValue.stocks[0].symbol).toBe("AAPL");
    expect(contextValue.stocks[0].quantity).toBe(5); // total sum of quantity
    // use .toBeCloseTo() for floats / decimals, because of rounding errors
    expect(contextValue.stocks[0].purchasePrice).toBeCloseTo(
      (2 * 10 + 3 * 20) / 5,
    ); // avg purchase price calculation
  });

  // Test 5: update current price
  it("updates the current price of an existing stock", () => {
    // Arrange
    let contextValue;
    render(<StockProviderWrapper callback={(v) => (contextValue = v)} />);

    // Act: add stock to array
    act(() => {
      contextValue.addOrMergeStock({
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 0,
      });

      // Act: update the price
      // Calls updateStockPrice function, looks for symbol "AAPL" and updates currentPrice
      contextValue.updateStockPrice("AAPL", 100);
    });

    // Assert: currentPrice updated
    expect(contextValue.stocks[0].currentPrice).toBe(100);
  });
});
