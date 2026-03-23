# 💹 Finance Dashboard

A React-based Finance Dashboard that allows users to track stock investments. Users can add stocks with quantity and purchase price, fetch real-time market prices using the `Alpha Vantage API`, and view profit or loss dynamically.

## 🌐 Live Demo

🔗 View app: https://rushdina.github.io/finance-dashboard/

![Finance Dashboard Preview](./src/assets/screenshot-financeDashboard.png)

## 🛠️ Technologies Used

- **Frontend:** `React (Vite)`, `JavaScript`, `CSS`
- **State Management:** `Context API` – Centralises global stock state and shared logic across components
- **React Hooks:**
  - `useState`: Manages component state
  - `useEffect`: Handles conditional API fetching
  - `useContext`: Provides shared state across components
  - `useCallback`: Stabilises function references for performance optimisation
  - `useMemo`: Memoises context value to reduce unnecessary re-renders
- **External APIs:** [Alpha Vantage API](https://www.alphavantage.co/documentation/) – Provides real-time stock market data
- **npm Packages:** `nanoid` – Generates unique IDs for stable React keys
- **Testing:** `Vitest`, `React Testing Library`

## ✨ Features

- Add stocks with symbol, quantity, and purchase price
- Fetch real-time stock prices via API
- Compute and display color-coded profit/loss
- Automatically merge duplicate stocks with recalculated average purchase price
- Handle API errors (rate limits, invalid symbols, network issues)
- Responsive UI using `Flexbox` and `CSS Grid` with loading indicators

## 🧩 Architecture Overview

The application is structured using a modular and scalable frontend architecture:

- **Components** → UI rendering (`StockForm`, `StockList`, `StockItem`)
- **Custom Hook** (`useStocks`) → Centralised state and business logic
- **Context API** → Shared global state across components
- **API Layer** (`stockAPI.js`) → External data fetching
- **Utility Layer** (`stockUtils.js`) → Reusable calculations

This separation improves maintainability, reusability, and scalability.

## 🧠 Key Challenges & Solutions

**1. Shared State Management**  
Managing stock data across multiple components led to duplicated logic.  
**Solution:** Centralised state and business logic using a custom hook (`useStocks`) with Context API.

**2. Unnecessary Re-renders with Context**  
Context updates caused all consumers to re-render.  
**Solution:** Optimised provider value using `useMemo` and stabilised functions with `useCallback`.

**3. Scalable Code Structure**  
Tightly coupled API, state, and UI logic reduced maintainability.  
**Solution:** Refactored into modular layers (custom hook, API service, utility functions).

**4. API Reliability & Edge Cases**  
Handling rate limits, invalid symbols, and network errors.  
**Solution:** Implemented structured error handling with consistent response states and UI feedback.

**5. Testing Modularised Architecture**  
Refactoring introduced multiple logic layers to test.  
**Solution:** Adopted layered testing (components, hooks, utilities, API with mocks).

## ✨ Improvements Beyond Baseline Requirements

- **Enhanced User Experience**:
  - Inline validation for invalid stock symbols
  - Separate error messages for input errors vs API errors
  - Loading indicators when fetching stock prices
  - Responsive interface for different screen sizes
- **Improved State Logic**:
  - Automatically merges duplicate stocks
  - Recalculates average purchase price dynamically
  - Uses nanoid to generate stable React keys
- **Performance Considerations**:
  - Memoized API functions with `useCallback`, `useMemo`
  - Conditional state updates to avoid unnecessary re-renders

## 📚 Key Learnings

- Designed scalable frontend architecture using custom hooks, `Context API`, and modular layers
- Improved understanding of React rendering behaviour and performance optimisation (`useMemo`, `useCallback`)
- Built reusable component-based UI with clear separation of concerns
- Implemented structured error handling for real-world API constraints (rate limits, invalid data, network failures)
- Applied layered testing strategies across components, hooks, utilities, and API using `Vitest` and `React Testing Library`

## 💻 Installation & Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/<username>/<repository>.git
cd <repository>
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

- Create a `.env` file in the root folder and add your `Alpha Vantage API` key:

```bash
VITE_ALPHA_KEY=your_alpha_vantage_api_key
```

You can obtain a free API key from: https://www.alphavantage.co/support/#api-key

4. **Run development server**

```bash
npm run dev
```

Open the localhost URL shown in your terminal (usually `http://localhost:5173`).

## 💡 Future Improvements

- Manual refresh button to update stock prices
- Persistent storage using localStorage or a backend database
- Stock price history visualization
- Portfolio summary statistics (total investment, total profit/loss)
- API request caching to reduce rate limit issues
