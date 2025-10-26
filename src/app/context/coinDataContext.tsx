"use client";

import { useState, useEffect, createContext, ReactElement } from "react";

import { Coin } from "@/interfaces/Coininterface";
import { CoinContextType } from "@/interfaces/CoinContextType";
import { BiDollar } from "react-icons/bi";

export const CoinDataContext = createContext<CoinContextType | null>(null);

export const CoinContext = ({ children }: { children: React.ReactNode }) => {
  const [coinData, setData] = useState<Coin[]>([]);
  const [page, setPage] = useState<number>(1);
  const [showConvertor, setShowConvertor] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("usd");
  const [currencySymbol, setCurrencySymbol] = useState<ReactElement>(
    <BiDollar />
  );

  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
  }
  const debouncedCurrency = useDebouncedValue(selectedCurrency, 600);
  useEffect(() => {
    // Reset data and page, then fetch fresh
    setData([]);
    setPage(1);
    fetchInitialData();
  }, [debouncedCurrency]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${debouncedCurrency}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );
      console.log("respones", response);
      if (!response.ok)
        throw new Error(
          `Server error (${response.status})-Too many Requests!!! Please try again later!`
        );

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0)
        throw new Error("No data received from API");

      setData(data);
      setPage(1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch coin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${debouncedCurrency}&order=market_cap_desc&per_page=50&page=${nextPage}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
      );

      if (!response.ok) throw new Error(`Server error (${response.status})`);

      const data = await response.json();

      if (!Array.isArray(data)) throw new Error("Invalid data format");

      setData((prev) => prev.concat(data));
      setPage(nextPage);
    } catch (err: any) {
      setError(err.message || "Failed to fetch more coins");
    }
  };

  return (
    <CoinDataContext.Provider
      value={{
        coinData,
        fetchMoreData,
        showConvertor,
        setShowConvertor,
        showComparison,
        setShowComparison,
        selectedCurrency,
        setSelectedCurrency,
        debouncedCurrency,
        currencySymbol,
        setCurrencySymbol,
        loading,
        error,
        refetch: fetchInitialData,
      }}
    >
      {children}
    </CoinDataContext.Provider>
  );
};
