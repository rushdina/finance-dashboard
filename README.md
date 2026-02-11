# 💹 Finance Dashboard

A React-based Finance Dashboard that allows users to track their stocks. Users can add stocks with quantity and purchase price, fetch the latest stock prices using the Alpha Vantage API, and view profit/loss for each stock.

## 🖼️ Preview

🔗 Live Demo: https://rushdina.github.io/NurulRushdinaBinteRosli-Capstone/

![Finance Dashboard Preview](./my-finance-dashboard/src/assets/screenshot-financeDashboard.png)

## 🛠️ Technologies Used

- `React`, `JavaScript`, `CSS`
- `Context API` for state management
- React Hooks:
  - `useState`: Manages form inputs and stock list state.
  - `useEffect`: Fetches current stock prices when the stock list changes.
  - `useContext`: Accesses shared state and functions from `StockContext`.
  - `useCallback`: Memoizes the API fetch function to avoid unnecessary recreations.
- `Alpha Vantage API` for fetching real-time stock prices
- `nanoid` for unique ID generation

## 💻 Installation & Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/my-finance-dashboard.git
cd my-finance-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
Create a .env file in the root folder and add your Alpha Vantage API key:

```bash
VITE_ALPHA_KEY=your_alpha_vantage_api_key
```

> Note: The app has a fallback demo stock (IBM) if your API key hits the free-tier limit.

4. **Run development server**

```bash
npm run dev
```

5. Open the **Localhost URL** (`http://localhost:5173`) shown in your terminal in your browser.

## 🚀 Usage

1. Enter a **stock symbol**, **quantity**, and **purchase price** in the form.
2. Click **Add Stock** button.
3. The stock will appear in the list below with:

- Current price (fetched from API)
- Profit/Loss (colour-coded)

4. Duplicate stock symbols will merge automatically, adjusting quantity and average purchase price.
5. Invalid stock symbols will display an error and will not be added.

## 🧠 Challenges & Bugs Encountered

- **API Rate Limiting**: Alpha Vantage free API has rate limit of 25 requests per day.
  - Solution: Added a fallback demo API default to stock symbol **IBM** to keep the dashboard functional, though prices do not reflect the actual price of the user’s stock.
- **Duplicate API Calls Between Components**: `StockForm` and `StockList` both shared the same API, resulting in duplicate fetch calls when a stock was added.
  - Solution: Centralized API fetch function in the parent component and shared it via `Context` to ensure the data is fetched only once and reused, avoiding duplicate requests.
- **Invalid Stock Symbols**: Needed to prevent adding invalid symbols to the list.
  - Solution: Used optional chaining (`?.`) to safely access nested API data, and `isNaN()` to verify the price. Return `null` and show an error message for invalid symbols.
- **Duplicate Stocks**: Users could add the same stock multiple times.
  - Solution: Checked if the stock already exists using `.find()`. If it does, updated the quantity and calculated the average purchase price using `.map()` and the spread operator (`...`). Otherwise, added it as a new stock.
- **Unnecessary API Calls During Price Fetching**: Updating stock prices triggers state changes, causing `useEffect` to run again and potentially make repeated API calls.
  - Solution: Added a **guard condition** to fetch prices only when `currentPrice` is `null`, preventing unnecessary API requests.
- **Testing App component logic**: Testing `App` component directly failed because it combines state, context, child components, and API calls, making it hard to isolate and test specific logic.
  - Solution: Recreated the context functions (`addOrMergeStock`, `updateStockPrice`, `fetchStockData`) inside a test wrapper and used a mock context provider, so the logic can be tested in isolation without rendering the full app or making API calls.

## ✨ Improvements Beyond Baseline Requirements

- **Enhanced UX**:
  - Inline error feedback with red highlights in the form for invalid stock symbols.
  - Loading indicators while fetching stock prices.
- **State Management**:
  - Duplicate stocks merge automatically instead of creating multiple entries.
  - Computes updated quantity and average purchase price for merged stocks.
  - `nanoid` used for unique IDs for each stock entry to ensure stable keys in React.
- **Responsive Design Enhancements**
  - Dynamic adjustments for errors and screen sizes.
  - Used **Flexbox** and **CSS Grid** for cleaner, more flexible layouts.
