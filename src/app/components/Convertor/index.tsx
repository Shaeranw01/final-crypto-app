"use client";

import { useState, useEffect, useContext, ChangeEvent } from "react";
import { CoinDataContext } from "@/app/context/coinDataContext";
import { Coin } from "@/interfaces/Coininterface";
import ConvertorRow from "../ConvertorRow";
import ConvertorChart from "../ConvertorChart";
import { SiConvertio } from "react-icons/si";
import { useCoinContext } from "@/app/hooks/useCoinContext";

const Convertor = () => {
  const { coinData, loading, error, refetch } = useCoinContext();
  const [toCoin, setToCoin] = useState<Coin | null>(null);
  const [fromCoin, setFromCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [conversionRate, setConversionRate] = useState<number>(1);
  const [switchMode, setSwitch] = useState<boolean>(false);

  const todayDate: string = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) {
      alert("Please enter a number");
      return;
    }
    setAmount(value);
  };
  console.log("convertor rendered");
  useEffect(() => {
    if (coinData.length > 0) {
      const firstCoin: Coin = coinData[0];
      const secondCoin: Coin = coinData[1];
      const rate: number = firstCoin.current_price / secondCoin.current_price;
      setConversionRate(rate);
      setFromCoin(firstCoin);
      setToCoin(secondCoin);
    }
  }, []);

  useEffect(() => {
    if (fromCoin != null && toCoin != null) {
      const rate: number = fromCoin.current_price / toCoin.current_price;
      setConversionRate(rate);
    }
  }, [toCoin, fromCoin]);

  let fromAmount, toAmount;

  const handleSwitch = () => {
    setToCoin(fromCoin);
    setFromCoin(toCoin);
    setSwitch(!setSwitch);
    // console.log("new to", toCoin);
    // console.log("new from", fromCoin);
  };
  if (switchMode) {
    fromAmount = amount;
    toAmount = Math.floor((amount / conversionRate) * 100) / 100;
  } else {
    fromAmount = amount;
    toAmount = amount * conversionRate;
  }
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-lg text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#424286] mb-4"></div>
        <p>Loading currency data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-center bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 max-w-md">
          {error}
        </p>
        <button
          onClick={refetch}
          className="px-5 py-2 mt-2  bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] font-medium rounded-lg "
        >
          Retry
        </button>
      </div>
    );
  }
  if (!coinData || coinData.length < 2) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Not enough coin data available for conversion.
      </div>
    );
  }
  return (
    <div>
      <h2 className="dark:text-[#DEDEDE] pt-20 text-[#424286]">
        Online Currency Converter
      </h2>
      <span className="dark:text-[#DEDEDE] text-[#424286]">{todayDate}</span>
      <div className=" mt-8 flex flex-col sm:flex-row gap-1  justify-between">
        <ConvertorRow
          currentCoin={fromCoin}
          amount={fromAmount}
          handleCoinSelect={(coin: Coin) => setFromCoin(coin)}
          handleAmountChange={handleAmountChange}
        ></ConvertorRow>
        <div className="flex justify-center items-center">
          <button
            className="flex justify-center items-center  dark:fill-white h-10 rounded-full"
            onClick={handleSwitch}
          >
            <SiConvertio className="w-[30px] h-[30px]" />
          </button>
        </div>

        <ConvertorRow
          currentCoin={toCoin}
          amount={toAmount}
          handleCoinSelect={(coin) => setToCoin(coin)}
          handleAmountChange={handleAmountChange}
        ></ConvertorRow>
      </div>
      {fromCoin !== null && toCoin !== null && (
        <ConvertorChart fromCoin={fromCoin} toCoin={toCoin}></ConvertorChart>
      )}
    </div>
  );
};
export default Convertor;
