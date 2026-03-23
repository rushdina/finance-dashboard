import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useStocks from "../hooks/useStocks";
import * as stockApi from "../api/stockAPI";

describe("useStocks", () => {
  // beforeEach runs before every test case
  beforeEach(() => {
    vi.restoreAllMocks(); // resets all spies and mocks back to their original real implementations (keeps each test independent)
  });

  // Test 1: Checks when useStocks() is first used, the stocks state starts as an empty array
  it("initialises with an empty stocks array", () => {
    const { result } = renderHook(() => useStocks());

    expect(result.current.stocks).toEqual([]);
  });

  // Test 2: Checks that calling addOrMergeStock() with a new stock actually adds that stock into the stocks array
  it("adds a new stock", () => {
    // renderHook from RTL for testing custom React hooks directly
    // Because custom hook useStocks() cannot just be called like a normal function in tests if they use React state internally. Hooks need a React environment.
    // renderHook gives the hook that React test environment to test its current value and functions
    // renderHook() returns an object. One of its properties is result.
    const { result } = renderHook(() => useStocks());

    /* result.current is the returned value from the hook
result.current = {
  stocks,
  addOrMergeStock,
  updateStockPrice,
  fetchStockData,
};
    */

    // act() is used because test causes a React state update
    act(() => {
      result.current.addOrMergeStock({
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 100,
      });
    });

    expect(result.current.stocks).toHaveLength(1);
    expect(result.current.stocks[0]).toMatchObject({
      symbol: "AAPL",
      quantity: 2,
      purchasePrice: 10,
      currentPrice: 100,
    }); // toMatchObject() checks the object contains at least those expected values
  });

  // Test 3: Checks if the same stock symbol is added again, hook does not create a second separate AAPL item.
  // Instead, it merges them into one stock entry.
  it("merges duplicate stock symbols correctly", () => {
    const { result } = renderHook(() => useStocks());

    act(() => {
      result.current.addOrMergeStock({
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 100,
      });

      result.current.addOrMergeStock({
        id: "2",
        symbol: "AAPL",
        quantity: 3,
        purchasePrice: 20,
        currentPrice: 100,
      });
    });

    expect(result.current.stocks).toHaveLength(1);
    expect(result.current.stocks[0].quantity).toBe(5);
    expect(result.current.stocks[0].purchasePrice).toBeCloseTo(
      (2 * 10 + 3 * 20) / 5,
    ); // use toBeCloseTo because decimal calculations can produce tiny floating point differences, e.g 0.1 + 0.2 = 0.300000004, so toBe() may fail when the logic is correct
  });

  // Test 4: Checks that updateStockPrice() finds the stock with symbol "AAPL" and updates its currentPrice to 150
  it("updates the current price of an existing stock", () => {
    const { result } = renderHook(() => useStocks());

    act(() => {
      result.current.addOrMergeStock({
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: null,
      });
    });

    act(() => {
      result.current.updateStockPrice("AAPL", 150);
    });

    expect(result.current.stocks[0].currentPrice).toBe(150);
  });

  // Test 5: Checks that when fetchStockData("AAPL") is called, it internally calls fetchStockQuote and it returns the mocked API response
  it("fetchStockData delegates to fetchStockQuote", async () => {
    // creates spy on existing fetchStockQuote func to confirm then fetchStockData() really calls fetchStockQuote internally
    // use mockResolvedValue() when mocking async func fetchStockQuote that should succeed, return resolved Promise
    const fetchStockQuoteSpy = vi
      .spyOn(stockApi, "fetchStockQuote")
      .mockResolvedValue({ price: 123.45 });

    const { result } = renderHook(() => useStocks());

    const response = await result.current.fetchStockData("AAPL");

    expect(fetchStockQuoteSpy).toHaveBeenCalled();
    expect(response).toEqual({ price: 123.45 });
  });
});
