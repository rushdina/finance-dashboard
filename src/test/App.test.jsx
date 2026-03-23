import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App.jsx";

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
});
