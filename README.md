# 💹 Finance Dashboard

A React-based Finance Dashboard that allows users to track their stocks purchased. Users can add stocks with quantity and purchase price, fetch the latest stock market prices using the `Alpha Vantage API`, and view real-time profit or loss for each stock.

## 🖼️ Preview
🔗 Live Demo: https://rushdina.github.io/finance-dashboard/

![Finance Dashboard Preview](./my-finance-dashboard/src/assets/screenshot-financeDashboard.png)

## 🛠️ Technologies Used
- **Frontend:** `React`, `JavaScript`, `CSS`
- **State Management:** `Context API` – Centralized global stock state and shared logic
- React Hooks:
  - `useState`: Manages form inputs and stock list 
  - `useEffect`: Fetches current stock prices on updates
  - `useContext`: Accesses shared states/functions from `StockContext`
  - `useCallback`: Memoizes API fetch function to prevent unnecessary recreations
- **External APIs:** [Alpha Vantage API](https://www.alphavantage.co/documentation/) – Real-time stock data
- **npm Packages:** `nanoid` – Generates unique IDs for stable React keys

## ✨ Features
- Add stocks (symbol, quantity, purchase price)
- Validate symbols using `Alpha Vantage API`
- Fetch and display current stock prices
- Compute and display color-coded profit/loss
- Merge duplicate stocks with recalculated average purchase price
- Handle API errors and loading states 
- Responsive UI using `Flexbox` and `CSS Grid`

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
- Create a .env file in the root folder and add your Alpha Vantage API key:

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
1. Enter a **stock symbol**, **quantity**, and **purchase price**.
2. Click **Add Stock**.
3. The stock appears in the list with:
  - Current market price (fetched from API)
  - Calculated profit/Loss (color-coded)
4. Duplicate symbols automatically merge and update quantity and average purchase price.
5. Invalid symbols display inline error feedback and are not added.

## 🧠 Challenges Encountered
- **API Rate Limits**: Alpha Vantage free-tier allows only 25 requests/day.
  - Solution: Added a fallback demo stock (IBM) to maintain functionality, though prices may not reflect user input.
- **Duplicate API Calls**: `StockForm` and `StockList` both triggered fetches when adding stocks.
  - Solution: Centralized fetch logic in the parent and shared via `Context` to fetch once and reuse data.
- **Invalid Stock Symbols**: Users could add invalid symbols.
  - Solution: Used optional chaining (`?.`) to safely access nested API data and `isNaN()` to validate prices, returning `null` and displaying an error.
- **Duplicate Stocks**: Users could add the same stock multiple times.
  - Solution: Used `.find()` to detect duplicates and `.map()` to merge quantities and recalculate average price.
- **useEffect Re-triggering**: State updates caused repeated API calls.
  - Solution: Added **guard conditions** and conditional updates to prevent unnecessary re-renders.
- **Testing `App` logic**: Direct testing was complex due to context, children and API calls.
  - Solution: Created a mock `Context` provider and recreated logic functions in a test wrapper to test logic in isolation.

## ✨ Improvements Beyond Baseline Requirements
- **Enhanced User Experience**:
  - Inline validation with visual error feedback
  - Loading indicators during API fetches
  - Responsive interface for various screen sizes
- **Improved State Logic**:
  - Automatically merges duplicate stocks, updating quantity and recalculating average purchase price
  - Stable React rendering using `nanoid` for unique keys
- **Performance Considerations**
  - Memoized API functions with `useCallback`
  - Conditional state updates to prevent unnecessary re-renders
 
## 💡 Future Improvements
- Manual refresh for stock market price updates
