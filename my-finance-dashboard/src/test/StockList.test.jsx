import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import StockList from "../components/StockList";
import StockContext from "../context/StockContext";

// Helper component to access mocked context
function TestStockProvider({
  initialStocks = [],
  fetchStockDataMock,
  updateStockPriceMock,
}) {
  const [stocks, setStocks] = useState(initialStocks);

  const fetchStockData = fetchStockDataMock || vi.fn(async () => null); // mock passed from test, else default mock function
  const updateStockPrice =
    updateStockPriceMock ||
    vi.fn((symbol, price) => {
      setStocks((prev) =>
        prev.map((stock) =>
          stock.symbol === symbol ? { ...stock, currentPrice: price } : stock,
        ),
      );
    }); // mock passed from test, else default mock that updates stocks state

  return (
    <StockContext.Provider value={{ stocks, fetchStockData, updateStockPrice }}>
      <StockList />
    </StockContext.Provider>
  );
}

// Test suite for StockList.jsx
describe("StockList component", () => {
  // Test 1: Heading and empty state
  it("renders heading and empty message when no stocks", () => {
    render(<TestStockProvider />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Stock List/i }),
    ).toBeInTheDocument(); // heading <h2>
    expect(screen.getByText(/No stocks added yet./i)).toBeInTheDocument();

    // Searches for an element with role="list" (<ul> or <ol>)
    // Asserts that no list element is rendered
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  // Test 2: Renders multiple stocks
  it("renders multiple stock items", () => {
    const stocks = [
      {
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 12,
      },
      {
        id: "2",
        symbol: "IBM",
        quantity: 1,
        purchasePrice: 20,
        currentPrice: 15,
      },
    ];

    // <StockList /> maps through the stocks array and renders two <li> elements
    render(<TestStockProvider initialStocks={stocks} />);

    // Finds all elements with role="listitem" (<li> elements)
    // Returns an array of matching elements
    // items now contains 2 <li> DOM elements corresponding to the two stocks
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2); // checks that exactly 2 <li> elements were rendered
  });

  // Test 3: useEffect calls fetchStockData to fetche missing prices on mount for null price
  it("calls fetchStockData only for stocks with currentPrice null", async () => {
    // mock function that tracks how many times it was called, with what arguments
    const fetchStockDataMock = vi.fn(async () => 50);
    const updateStockPriceMock = vi.fn();

    const stocks = [
      {
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: null, // should trigger fetch
      },
      {
        id: "2",
        symbol: "IBM",
        quantity: 1,
        purchasePrice: 20,
        currentPrice: 25, // should NOT trigger fetch
      },
    ];

    // await act(async () => render(...)) waits for useEffect AND resolved promises inside it
    await act(async () => {
      // <StockList /> renders, useEffect triggers, iterates through stocks, calls
      render(
        <TestStockProvider
          initialStocks={stocks}
          fetchStockDataMock={fetchStockDataMock} // fetchStockDataMock("AAPL"), waits for promise, then calls updateStockPriceMock("AAPL", 50)
          updateStockPriceMock={updateStockPriceMock}
        />,
      );
    });

    // Only AAPL should trigger fetch
    expect(fetchStockDataMock).toHaveBeenCalledTimes(1); // called once for AAPL
    expect(fetchStockDataMock).toHaveBeenCalledWith("AAPL");
    // And updateStockPrice should be called with resolved price
    expect(updateStockPriceMock).toHaveBeenCalledTimes(1);
    expect(updateStockPriceMock).toHaveBeenCalledWith("AAPL", 50); // called with resolved price value
  });
});
