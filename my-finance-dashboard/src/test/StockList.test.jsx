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

  // Test 2: Renders a single stock
  it("renders a stock item correctly", () => {
    const stock = {
      id: "1",
      symbol: "AAPL",
      quantity: 2,
      purchasePrice: 10,
      currentPrice: 12,
    };

    // pass an array with the single stock as initialStocks
    render(<TestStockProvider initialStocks={[stock]} />);

    // Finds the elements and checks its full string
    expect(screen.getByText(/Symbol:/i)).toHaveTextContent("Symbol: AAPL");
    expect(screen.getByText(/Quantity:/i)).toHaveTextContent("Quantity: 2");
    expect(screen.getByText(/Purchase Price:/i)).toHaveTextContent(
      "Purchase Price: $10.00",
    );
    expect(screen.getByText(/Current Price:/i)).toHaveTextContent(
      "Current Price: $12.00",
    );
    expect(screen.getByText(/Profit\/Loss:/i)).toHaveTextContent(
      "Profit/Loss: +$4.00",
    ); // \ is escape character
  });

  // Test 3: Renders multiple stocks
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

  // Test 4: Shows "Loading price..." for null currentPrice
  it("shows loading text when current price is null", () => {
    const stock = {
      id: "1",
      symbol: "AAPL",
      quantity: 2,
      purchasePrice: 10,
      currentPrice: null,
    };

    // StockList receives the stock, maps through it, sees currentPrice is null, and renders
    render(<TestStockProvider initialStocks={[stock]} />);

    // Assert: element exists in the DOM
    expect(screen.getByText(/Loading price.../i)).toBeInTheDocument();
  });

  // Test 5: useEffect calls fetchStockData to fetche missing prices on mount for null price
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

  // Test 6: Correct profit math calculation
  it("displays profit correctly with + sign", () => {
    const profitStock = {
      id: "1",
      symbol: "AAPL",
      quantity: 2,
      purchasePrice: 10,
      currentPrice: 12,
    };

    /**
     * Profit/Loss = (currentPrice - purchasePrice) * quantity
     * = (12 - 10) * 2 = +4
     */

    render(<TestStockProvider initialStocks={[profitStock]} />);

    // (12 - 10) * 2 = +4
    expect(screen.getByText(/Profit\/Loss:/i)).toHaveTextContent(
      "Profit/Loss: +$4.00",
    );
  });

  // Test 7: Correct loss math calculation
  it("displays loss correctly with - sign", () => {
    const lossStock = {
      id: "2",
      symbol: "IBM",
      quantity: 2,
      purchasePrice: 50,
      currentPrice: 20,
    };
    render(<TestStockProvider initialStocks={[lossStock]} />);

    // (20 - 50) * 2 = -60
    expect(screen.getByText(/Profit\/Loss:/i)).toHaveTextContent(
      "Profit/Loss: -$60.00",
    );
  });

  // Test 8: Zero profit/loss edge case
  it("displays zero profit/loss correctly with no sign", () => {
    const zeroStock = {
      id: "3",
      symbol: "MSFT",
      quantity: 5,
      purchasePrice: 50,
      currentPrice: 50, // same as purchasePrice, profit/loss = 0
    };

    render(<TestStockProvider initialStocks={[zeroStock]} />);

    // Profit/Loss = (50 - 50) * 5 = 0
    const profitLossElement = screen.getByText(/Profit\/Loss:/i);

    // Check displayed text, text should have no + or -
    expect(profitLossElement).toHaveTextContent("Profit/Loss: $0.00");
  });
});
