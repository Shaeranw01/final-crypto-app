"use client";

import { useState, useEffect, useContext, ChangeEvent, useRef } from "react";
import { useOutsideClick } from "@/app/hooks/useClickOutside";

import { Coin } from "@/interfaces/Coininterface";

import { CoinDataContext } from "@/app/context/coinDataContext";
import Image from "next/image";
interface CoinRowProps {
  currentCoin: Coin | null;
  amount: number;
  handleCoinSelect: (coin: Coin) => void;
  handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const ConvertorRow = ({
  currentCoin,
  amount,
  handleCoinSelect,
  handleAmountChange,
}: CoinRowProps) => {
  const { coinData } = useContext(CoinDataContext);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [coinSearch, setCoinSearch] = useState("");
  const dropDownRef = useRef(null);

  // const [amount, setAmount] = useState<number>(1);
  // const [selectCoin, onSelectCoin] = useState<boolean>(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setCoinSearch(searchValue);
    setShowDropdown(true);
  };

  // const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const amountValue = parseInt(e.target.value);
  //   setAmount(amountValue);
  // };
  const coinList = coinData.filter((coin: Coin) =>
    coin.name.toLowerCase().includes(coinSearch)
  );

  function closeDropDown() {
    setShowDropdown(false);
  }
  const onSelectCoin = (coin: Coin) => {
    setShowDropdown(false);
    handleCoinSelect(coin);
    setCoinSearch(coin.name);
  };
  useOutsideClick(dropDownRef, closeDropDown);
  useEffect(() => {
    if (currentCoin) {
      setCoinSearch(currentCoin.name);
    }
  }, [currentCoin]);
  useEffect(() => {
    if (coinSearch === "") setShowDropdown(false);
  }, [coinSearch]);

  return (
    <div className="w-full dark:bg-[#191932] flex flex-col gap-10 rounded-xl p-6 bg-white">
      <div className="text-base dark:text-white text-[#424286] ">You Sell</div>
      <div className="relative w-full flex flex-col">
        <div className="relative w-full flex items-center justify-between overflow-visible">
          <div className="flex gap-2">
            {currentCoin && (
              <Image
                src={currentCoin.image}
                alt={currentCoin.name}
                width={25}
                height={25}
                className=""
              />
            )}
            <input
              className="w-full h-8 flex  dark:bg-[#191932] dark:text-white focus:outline-none bg-[#F3F5F9] text-[#424286] rounded-lg p-3"
              value={coinSearch}
              onChange={handleSearch}
              onFocus={() => setShowDropdown(true)}
            ></input>
          </div>

          <input
            className="w-14 h-8 dark:bg-[#191932] dark:text-white focus:outline-none bg-[#F3F5F9] text-[#424286] rounded-lg p-2"
            value={amount}
            onChange={handleAmountChange}
          ></input>

          {showDropdown && coinList.length > 0 && (
            <div
              className="absolute top-full left-7 mt-2 w-52 flex flex-col overflow-y-scroll  dark:bg-[#191932] dark:text-white bg-[#F3F5F9] text-[#424286] p-2 rounded-md  z-50 overflow-auto max-h-80"
              ref={dropDownRef}
            >
              {coinList.length > 0 &&
                coinList.map((coin: Coin, index: number) => (
                  <button
                    key={`${coin.id}-${index}`}
                    className="p-2 h-12 text-left"
                    onClick={() => onSelectCoin(coin)}
                  >
                    {coin.name}
                  </button>
                ))}
            </div>
          )}
        </div>
        <hr className="border-gray-400   dark:border-white mt-5 mb-3" />
        {currentCoin && (
          <div className="flex items-center gap-2 text-gray-400 dark:text-white text-sm">
            <span>1 {currentCoin.symbol.toUpperCase()}</span>

            {currentCoin.current_price}
          </div>
        )}
      </div>
    </div>
  );
};
export default ConvertorRow;
