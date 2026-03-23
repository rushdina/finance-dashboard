import { describe, it, expect } from "vitest";
import { mergeStock, calculateProfitLoss } from "../utils/stockUtils";

// Test suite for stockUtils.js
describe("stockUtils", () => {
  // Test suite for mergeStock function in stockUtils.js
  describe("mergeStock", () => {
    // Test 1: Tests total quanity in mergeStock function
    it("merges duplicate stocks with correct total quantity", () => {
      const existingStock = {
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 100,
      };

      const newStock = {
        id: "2",
        symbol: "AAPL",
        quantity: 3,
        purchasePrice: 20,
        currentPrice: 100,
      };

      const merged = mergeStock(existingStock, newStock);

      expect(merged.quantity).toBe(5);
    });

    // Test 2: Test calculated average price in mergestock function
    it("calculates weighted average purchase price correctly", () => {
      const existingStock = {
        id: "1",
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 100,
      };

      const newStock = {
        id: "2",
        symbol: "AAPL",
        quantity: 3,
        purchasePrice: 20,
        currentPrice: 100,
      };

      const merged = mergeStock(existingStock, newStock);

      expect(merged.purchasePrice).toBeCloseTo((2 * 10 + 3 * 20) / 5);
    });
  });

  // Test suite for calculateProfitLoss function
  describe("calculateProfitLoss", () => {
    // Test 1: Calculate profit
    it("returns profit correctly", () => {
      const stock = {
        symbol: "AAPL",
        quantity: 2,
        purchasePrice: 10,
        currentPrice: 12,
      };

      // (12 - 10) * 2 = +4
      expect(calculateProfitLoss(stock)).toBe(4);
    });

    // Test 2: Calculate loss
    it("returns loss correctly", () => {
      const stock = {
        symbol: "IBM",
        quantity: 2,
        purchasePrice: 50,
        currentPrice: 20,
      };

      // (20 - 50) * 2 = -60
      expect(calculateProfitLoss(stock)).toBe(-60);
    });

    // Test 3: Test for no profit/loss if user input price the same as stock's current price
    it("returns zero when there is no gain or loss", () => {
      const stock = {
        symbol: "MSFT",
        quantity: 5,
        purchasePrice: 50,
        currentPrice: 50,
      };

      expect(calculateProfitLoss(stock)).toBe(0);
    });

    // Test 4: currentPrice is null
    it("returns null when currentPrice is null", () => {
      const stock = {
        symbol: "TSLA",
        quantity: 1,
        purchasePrice: 100,
        currentPrice: null,
      };

      expect(calculateProfitLoss(stock)).toBeNull();
    });
  });
});
