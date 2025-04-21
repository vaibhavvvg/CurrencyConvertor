import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedData = localStorage.getItem(`currency-${currency}`);

    if (cachedData) {
      setData(JSON.parse(cachedData));
      setLoading(false);
    } else {
      fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((res) => {
          setData(res[currency]);
          localStorage.setItem(`currency-${currency}`, JSON.stringify(res[currency]));
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch currency data.");
          setLoading(false);
        });
    }
  }, [currency]);

  return { data, loading, error };
}

export default useCurrencyInfo;