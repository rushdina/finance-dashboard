import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StockItem from "../components/StockItem";

// Test suite for StockItem.jsx
describe("StockItem component", () => {
  // Test 1: Renders a single stock
  it("renders stock item correctly", () => {
    const stock = {
      id: "1",
      symbol: "AAPL",
      quantity: 2,
      purchasePrice: 10,
      currentPrice: 12,
    };

    render(<StockItem stock={stock} profitLoss={4} />);

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

  // Test 2: Render plus sign for profit
  it("calculates profit correctly with + sign", () => {
    const stock = {
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

    render(<StockItem stock={stock} profitLoss={4} />);

    // (12 - 10) * 2 = +4
    expect(screen.getByText(/Profit\/Loss:/i)).toHaveTextContent(
      "Profit/Loss: +$4.00",
    );
  });

  // Test 3: Render minus sign for loss
  it("shows negative loss with minus sign", () => {
    const stock = {
      id: "2",
      symbol: "IBM",
      quantity: 2,
      purchasePrice: 50,
      currentPrice: 20,
    };

    render(<StockItem stock={stock} profitLoss={-60} />);

    // (20 - 50) * 2 = -60
    expect(screen.getByText(/Profit\/Loss:/i)).toHaveTextContent(
      "Profit/Loss: -$60.00",
    );
  });

  // Test 4: Zero profit/loss edge case
  it("shows zero profit/loss correctly with no sign", () => {
    const stock = {
      id: "3",
      symbol: "MSFT",
      quantity: 5,
      purchasePrice: 50,
      currentPrice: 50, // same as purchasePrice, profit/loss = 0
    };

    render(<StockItem stock={stock} profitLoss={0} />);

    // Profit/Loss = (50 - 50) * 5 = 0
    // Check displayed text, text should have no + or -
    expect(screen.getByText(/Profit\/Loss:/i)).toHaveTextContent(
      "Profit/Loss: $0.00",
    );
  });

  // Test 5: Shows "Loading price..." for null currentPrice
  it("shows loading text when current price is null", () => {
    const stock = {
      id: "4",
      symbol: "TSLA",
      quantity: 1,
      purchasePrice: 100,
      currentPrice: null,
    };

    // StockList receives the stock, maps through it, sees currentPrice is null, and renders
    render(<StockItem stock={stock} profitLoss={null} />);

    // Assert: element exists in the DOM
    expect(screen.getByText(/Loading price.../i)).toBeInTheDocument();
  });
});
