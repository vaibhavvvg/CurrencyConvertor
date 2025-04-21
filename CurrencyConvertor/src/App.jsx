import React, { useState, useEffect } from 'react';
import { InputBox } from './components';
import useCurrencyInfo from './hooks/useCurrencyInfo';

function App() {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("conversionHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const { data: currencyInfo, loading, error } = useCurrencyInfo(from);
  const options = Object.keys(currencyInfo || {});

  const swap = () => {
    setFrom(to);
    setTo(from);
    setConvertedAmount(amount);
    setAmount(convertedAmount);
  };

  const convert = () => {
    if (amount <= 0 || isNaN(amount)) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const result = amount * currencyInfo[to];
    setConvertedAmount(result);

    const newEntry = {
      timestamp: new Date().toLocaleString(),
      from,
      to,
      amount,
      result: result.toFixed(2),
    };

    const updatedHistory = [newEntry, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("conversionHistory", JSON.stringify(updatedHistory));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="w-full h-full min-h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat py-10"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load')`,
      }}
    >
      <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            convert();
          }}
        >
          <div className="w-full mb-1">
            <InputBox
              label="From"
              amount={amount}
              currencyOptions={options}
              onCurrencyChange={(currency) => setFrom(currency)}
              selectCurrency={from}
              onAmountChange={(amount) => setAmount(amount)}
            />
          </div>
          <div className="relative w-full h-0.5">
            <button
              type="button"
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5 hover:bg-blue-700 transition duration-300 ease-in-out focus:ring-4 focus:ring-blue-300"
              onClick={swap}
            >
              swap
            </button>
          </div>
          <div className="w-full mt-1 mb-4">
            <InputBox
              label="To"
              amount={convertedAmount}
              currencyOptions={options}
              onCurrencyChange={(currency) => setTo(currency)}
              selectCurrency={to}
              amountDisable
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:ring-4 focus:ring-blue-300"
          >
            Convert {from.toUpperCase()} to {to.toUpperCase()}
          </button>
        </form>

        {/* Conversion History */}
        {history.length > 0 && (
          <div className="mt-6 bg-white/60 p-3 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2">Conversion History</h3>
            <ul className="text-sm space-y-1 max-h-48 overflow-y-auto">
              {history.map((item, index) => (
                <li key={index} className="border-b border-gray-300 pb-1">
                  <div className="font-medium">
                    {item.amount} {item.from.toUpperCase()} → {item.result} {item.to.toUpperCase()}
                  </div>
                  <div className="text-gray-700 text-xs">{item.timestamp}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
