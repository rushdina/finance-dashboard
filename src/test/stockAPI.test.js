import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchStockQuote } from "../api/stockAPI";

describe("fetchStockQuote", () => {
  // Runs before every test
  beforeEach(() => {
    globalThis.fetch = vi.fn(); // replace the real fetch with mock function so not to call the real API
  });

  // Runs after every test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Valid API response
  it("returns price for a valid API response", async () => {
    // Mock fetch to return successful response Promise.resolve
    globalThis.fetch.mockResolvedValue({
      // Mocking .json() method of a real fetch response
      json: async () => ({
        "Global Quote": {
          "05. price": "123.45",
        }, // fake api response to simulate what Alpha Vantage returns
      }),
    });

    const result = await fetchStockQuote("AAPL", "test-key");

    // Checks if fetch is called and returned result
    expect(globalThis.fetch).toHaveBeenCalled();
    expect(result).toEqual({ price: 123.45 });
  });

  // Test 2: "Infomation" rate limit
  it('returns "rate-limit" when API returns Information message', async () => {
    globalThis.fetch.mockResolvedValue({
      json: async () => ({
        Information: "API rate limit reached",
      }),
    });

    const result = await fetchStockQuote("AAPL", "test-key");

    expect(result).toEqual({ error: "rate-limit" });
  });

  // Test 3: "Note" rate limit
  it('returns "rate-limit" when API returns Note message', async () => {
    globalThis.fetch.mockResolvedValue({
      json: async () => ({
        Note: "Thank you for using Alpha Vantage",
      }),
    });

    const result = await fetchStockQuote("AAPL", "test-key");

    expect(result).toEqual({ error: "rate-limit" });
  });

  // Test 4: Missing "Global Quote"
  it('returns "invalid-symbol" when Global Quote is missing', async () => {
    globalThis.fetch.mockResolvedValue({
      json: async () => ({}),
    }); // invalid api response

    const result = await fetchStockQuote("INVALID", "test-key");

    expect(result).toEqual({ error: "invalid-symbol" });
  });

  // Test 5: Invalid price (edge case price exist but invalid)
  it('returns "invalid-symbol" when price is invalid', async () => {
    globalThis.fetch.mockResolvedValue({
      json: async () => ({
        "Global Quote": {
          "05. price": "0",
        },
      }),
    });

    const result = await fetchStockQuote("INVALID", "test-key");

    expect(result).toEqual({ error: "invalid-symbol" });
  });

  // Test 6: Network error
  it('returns "network" when fetch throws an error', async () => {
    globalThis.fetch.mockRejectedValue(new Error("Network failure"));

    const result = await fetchStockQuote("AAPL", "test-key");

    expect(result).toEqual({ error: "network" });
  });
});
