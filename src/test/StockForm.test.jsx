// StockForm.test.jsx
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import StockForm from "../components/StockForm.jsx";
import StockContext from "../context/StockContext.jsx";

// Helper component to access mocked context
function TestStockProvider({ addOrMergeStockMock, fetchStockDataMock }) {
  const [, setStocks] = useState([]);

  const addOrMergeStock =
    addOrMergeStockMock || ((stock) => setStocks((prev) => [...prev, stock])); // use mock fn if exist, else use default fn updating stock
  const fetchStockData = fetchStockDataMock || (async () => ({ price: 100 })); // use mock fn if exist, else use default fn returning 100

  return (
    <StockContext.Provider value={{ addOrMergeStock, fetchStockData }}>
      <StockForm />
    </StockContext.Provider>
  );
}

// Test suite for StockForm.jsx
describe("StockForm component", () => {
  // Test 1: Render form elements
  it("renders heading, inputs, and submit button", () => {
    // Arrange: StockForm rendered with mocked context in test DOM
    render(<TestStockProvider />);
    // Act: No user interaction
    // Assert: Checks heading, inputs, and button exist in DOM
    expect(
      screen.getByRole("heading", { level: 1, name: /Finance Dashboard/i }),
    ).toBeInTheDocument(); // Heading <h1>

    // Assert: Checks inputs by its <label> text
    expect(screen.getByLabelText(/Stock Symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Purchase Price/i)).toBeInTheDocument();

    // Button
    expect(
      screen.getByRole("button", { name: /Add Stock/i }),
    ).toBeInTheDocument();
  });

  // Test 2: Input change updates form state
  it("updates input values on change", () => {
    render(<TestStockProvider />);

    // Get input elements linked to <label>
    const symbolInput = screen.getByLabelText(/Stock Symbol/i); // returns <input> element DOM node
    const quantityInput = screen.getByLabelText(/Quantity/i);
    const priceInput = screen.getByLabelText(/Purchase Price/i);

    // Act: Triggers onChange to update input state
    // fireEvent simulates DOM events
    fireEvent.change(symbolInput, { target: { value: "AAPL" } }); // .change simulates onChange event of input
    fireEvent.change(quantityInput, { target: { value: "5" } }); // mimics event.target.value in React
    fireEvent.change(priceInput, { target: { value: "10.5" } });

    // Assert: Checks input values match what was typed
    expect(symbolInput.value).toBe("AAPL");
    expect(quantityInput.value).toBe("5");
    expect(priceInput.value).toBe("10.5");
  });

  // Test 3: Submitting valid stock calls addOrMergeStock and resets form
  // async required because form submission triggers async logic: fetchStockData
  it("submits valid stock and resets form", async () => {
    // mock functions, vi = vitest mocking API
    const addOrMergeStockMock = vi.fn(); // vi.fn creates fake fn to test if the fn was called or with what arguments
    const fetchStockDataMock = vi.fn(async () => ({ price: 100 })); // mock returns price

    render(
      <TestStockProvider
        addOrMergeStockMock={addOrMergeStockMock}
        fetchStockDataMock={fetchStockDataMock}
      />,
    );

    // Get input elements and button
    const symbolInput = screen.getByLabelText(/Stock Symbol/i); // returns <input> element DOM node
    const quantityInput = screen.getByLabelText(/Quantity/i);
    const priceInput = screen.getByLabelText(/Purchase Price/i);
    const button = screen.getByRole("button", { name: /Add Stock/i }); // returns <button> element DOM node

    // Act: simulates changing input value, updating input state
    fireEvent.change(symbolInput, { target: { value: "AAPL" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(priceInput, { target: { value: "10" } });

    // act() ensures state updates and effects triggered by the click are processed before assertions
    // Clicking button triggers async fetch, state updates and form reset
    // use async/await because fetchStockDataMock returns a Promise
    await act(async () => {
      fireEvent.click(button); // simulates clicking submit button
    });

    // Assert
    expect(fetchStockDataMock).toHaveBeenCalledWith("AAPL"); // checks function was called with stock symbol
    expect(addOrMergeStockMock).toHaveBeenCalledOnce(); // ensures no double-submit
    expect(addOrMergeStockMock).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 100,
      }),
    ); // checks function was called with these fields exist and match

    // Checks form reset
    expect(symbolInput.value).toBe("");
    expect(quantityInput.value).toBe("");
    expect(priceInput.value).toBe("");
    expect(screen.queryByText(/Invalid Stock Symbol/i)).not.toBeInTheDocument();
  });

  // Test 4: Submitting invalid stock triggers alert
  it("shows error message on invalid stock symbol", async () => {
    // mock functions
    const addOrMergeStockMock = vi.fn();
    const fetchStockDataMock = vi.fn(async () => ({
      error: "invalid-symbol",
    })); // returns error for invalid symbol

    render(
      <TestStockProvider
        addOrMergeStockMock={addOrMergeStockMock}
        fetchStockDataMock={fetchStockDataMock}
      />,
    );

    // Get input elements and button
    const symbolInput = screen.getByLabelText(/Stock Symbol/i);
    const quantityInput = screen.getByLabelText(/Quantity/i);
    const priceInput = screen.getByLabelText(/Purchase Price/i);
    const button = screen.getByRole("button", { name: /Add Stock/i });

    // Act: simulates changing input value, updating input state
    fireEvent.change(symbolInput, { target: { value: "INVALID" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(priceInput, { target: { value: "10" } });

    // simulate submit inside act() because it triggers async state updates
    await act(async () => {
      fireEvent.click(button);
    });

    // Assert
    expect(fetchStockDataMock).toHaveBeenCalledWith("INVALID"); // checks that mock fetch fn was called with "INVALID" argument
    expect(addOrMergeStockMock).not.toHaveBeenCalled(); // checks stock is not added
    expect(
      screen.getByText("Invalid Stock Symbol: INVALID"),
    ).toBeInTheDocument(); // checks error message rendered in DOM
  });

  // Test 5: Merging duplicate stocks
  it("merges duplicate stocks when submitting same symbol twice", async () => {
    const addOrMergeStockMock = vi.fn();
    const fetchStockDataMock = vi.fn(async () => ({ price: 50 })); // simulates api, return price 50

    render(
      <TestStockProvider
        addOrMergeStockMock={addOrMergeStockMock}
        fetchStockDataMock={fetchStockDataMock}
      />,
    );

    // Get input elements and button
    const symbolInput = screen.getByLabelText(/Stock Symbol/i);
    const quantityInput = screen.getByLabelText(/Quantity/i);
    const priceInput = screen.getByLabelText(/Purchase Price/i);
    const button = screen.getByRole("button", { name: /Add Stock/i });

    // Act: Submit first stock
    fireEvent.change(symbolInput, { target: { value: "MSFT" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(priceInput, { target: { value: "10" } });

    await act(async () => {
      fireEvent.click(button);
    });

    // Act: Submit same symbol with different quantity & price
    fireEvent.change(symbolInput, { target: { value: "MSFT" } });
    fireEvent.change(quantityInput, { target: { value: "3" } });
    fireEvent.change(priceInput, { target: { value: "20" } });

    await act(async () => {
      fireEvent.click(button);
    });

    // Assert: Checks functions were called twice (once per submission)
    expect(fetchStockDataMock).toHaveBeenCalledTimes(2);
    expect(addOrMergeStockMock).toHaveBeenCalledTimes(2);

    // Check second call has correct merged quantity & price
    // toHaveBeenLastCalledWith(...) → asserts last call to mock fn had the expected arguments
    expect(addOrMergeStockMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        symbol: "MSFT",
        quantity: 3, // the test is only checking what StockForm sends to the context, not what the final merged quantity would be. merging logic is inside addOrMergeStock in the context, not in StockForm
        purchasePrice: 20,
        currentPrice: 50,
      }), // checks specified keys in the object
    );
  });

  // Edge cases
  // Test 6: Form prevents invalid values and edge cases
  it("prevents submitting invalid values (negative, zero, decimals, letters, empty)", async () => {
    const addOrMergeStockMock = vi.fn();
    const fetchStockDataMock = vi.fn(async () => ({ price: 100 }));

    render(
      <TestStockProvider
        addOrMergeStockMock={addOrMergeStockMock}
        fetchStockDataMock={fetchStockDataMock}
      />,
    );

    // Get input elements and button
    const symbolInput = screen.getByLabelText(/Stock Symbol/i);
    const quantityInput = screen.getByLabelText(/Quantity/i);
    const priceInput = screen.getByLabelText(/Purchase Price/i);
    const button = screen.getByRole("button", { name: /Add Stock/i });

    // Act: Edge case: Negative quantity
    fireEvent.change(symbolInput, { target: { value: "GOOG" } });
    fireEvent.change(quantityInput, { target: { value: "-5" } });
    fireEvent.change(priceInput, { target: { value: "10" } });

    await act(async () => {
      fireEvent.click(button);
    });

    // Assert: stock not added because quantity is invalid
    expect(addOrMergeStockMock).not.toHaveBeenCalled();

    // Act: Edge case: Zero price
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(priceInput, { target: { value: "0" } });

    await act(async () => {
      fireEvent.click(button);
    });

    // Assert: stock not added because price is zero
    expect(addOrMergeStockMock).not.toHaveBeenCalled();

    // Act: Edge case: Decimal quantity (should be rejected because step=1)
    fireEvent.change(quantityInput, { target: { value: "2.5" } }); // invalid whole num
    fireEvent.change(priceInput, { target: { value: "10" } });

    await act(async () => {
      fireEvent.click(button);
    });

    // Assert: stock not added because quantity must be a whole number
    expect(addOrMergeStockMock).not.toHaveBeenCalled();

    // Act: Edge case: More than 2 decimal places for price
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(priceInput, { target: { value: "10.123" } }); // invalid decimal

    await act(async () => {
      fireEvent.click(button);
    });

    // Assert: stock not added because price should have at most 2 decimals (step=0.01)
    expect(addOrMergeStockMock).not.toHaveBeenCalled();

    // Act: Edge case: Letters in numeric fields (should be rejected)
    fireEvent.change(quantityInput, { target: { value: "abc" } });
    fireEvent.change(priceInput, { target: { value: "xyz" } });

    await act(async () => {
      fireEvent.click(button);
    });

    // Assert: stock not added
    expect(addOrMergeStockMock).not.toHaveBeenCalled();

    // Act: Edge case: Empty required fields
    fireEvent.change(symbolInput, { target: { value: "" } });
    fireEvent.change(quantityInput, { target: { value: "" } });
    fireEvent.change(priceInput, { target: { value: "" } });

    await act(async () => {
      fireEvent.click(button);
    });

    // Assert: stock not added because all inputs are required to be filled
    expect(addOrMergeStockMock).not.toHaveBeenCalled();
  });

  // Test 7: Test rate-limit error
  it("shows API error message on rate limit", async () => {
    const addOrMergeStockMock = vi.fn();
    const fetchStockDataMock = vi.fn(async () => ({
      error: "rate-limit",
    }));

    render(
      <TestStockProvider
        addOrMergeStockMock={addOrMergeStockMock}
        fetchStockDataMock={fetchStockDataMock}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Stock Symbol/i), {
      target: { value: "AAPL" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: "10" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Add Stock/i }));
    });

    expect(addOrMergeStockMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        /Too many requests. Please wait a few seconds and try again./i,
      ),
    ).toBeInTheDocument();
  });

  // Test 8: Test network error
  it("shows API error message on network error", async () => {
    const addOrMergeStockMock = vi.fn();
    const fetchStockDataMock = vi.fn(async () => ({
      error: "network",
    }));

    render(
      <TestStockProvider
        addOrMergeStockMock={addOrMergeStockMock}
        fetchStockDataMock={fetchStockDataMock}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Stock Symbol/i), {
      target: { value: "AAPL" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: "10" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Add Stock/i }));
    });

    expect(addOrMergeStockMock).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Network error. Please try again./i),
    ).toBeInTheDocument();
  });
});
