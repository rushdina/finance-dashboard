// StockForm.test.jsx
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StockForm from "../components/StockForm.jsx";
import StockContext from "../context/StockContext.jsx";

// Helper component to access mocked context
function TestStockProvider({ addOrMergeStockMock, fetchStockDataMock }) {
  const addOrMergeStock = addOrMergeStockMock || vi.fn(); // use mock fn if exist
  const fetchStockData =
    fetchStockDataMock || vi.fn(async () => ({ price: 100 })); // use mock fn if exist, else create mock fn returning 100

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
    // Assert: Checks inputs by its <label> text
    expect(screen.getByLabelText(/Stock Symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Purchase Price/i)).toBeInTheDocument();

    // Checks button exist in DOM
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

  // Test 5: Test rate-limit error
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

  // Test 6: Test network error
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
