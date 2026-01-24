// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import StockForm from "./components/StockForm.jsx";
import StockList from "./components/StockList.jsx";

function App() {
  return (
    <div className="app">
      <StockForm />
      <StockList />
    </div>
  );
}

export default App;
