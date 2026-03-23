export async function fetchStockQuote(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  // Validate symbol to get current price
  function validateSymbolAndGetPrice(data) {
    // ?. checks if data exists, then checks data["Global Quote"], then checks data["Global Quote"]["05. price"]
    // if at any point is null/undefined, returns undefined
    const priceString = data?.["Global Quote"]?.["05. price"];
    const price = parseFloat(priceString); // parseFloat(undefined || "") = NaN
    return Number.isNaN(price) || price === 0 ? null : price;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data); // to check the API rate limit response

    // Rate limit or API message
    if (data.Information || data.Note) {
      return { error: "rate-limit" };
    }

    // Invalid symbol / no quote
    if (!data["Global Quote"]) {
      return { error: "invalid-symbol" };
    }

    const price = validateSymbolAndGetPrice(data);

    if (price === null) {
      return { error: "invalid-symbol" };
    }

    return { price }; // return resolved value
  } catch (error) {
    console.error("API fetch failed:", error);
    return { error: "network" };
  }
}
