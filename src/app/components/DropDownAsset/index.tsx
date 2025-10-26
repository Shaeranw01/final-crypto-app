"use client";
import { CoinDataContext } from "@/app/context/coinDataContext";
import { useOutsideClick } from "@/app/hooks/useClickOutside";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Coin } from "@/interfaces/Coininterface";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { coinData } = useContext(CoinDataContext);

  const [currentCurrency, setCurrency] = useState("Select Coin");
  //   const [currentSymbol, setSymbol] = useState(
  //     <AiOutlineDollar></AiOutlineDollar>
  //   );

  const ref = useRef(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropDown = () => {
    setIsOpen(false);
  };

  useOutsideClick(ref, closeDropDown);
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSelect = (newCurrency: string) => {
    setCurrency(newCurrency);
    // setSymbol(newSymbol);
  };

  return (
    <div
      className="w-[461px] h-10  dark:bg-[#191925]  relative  dark:text-white transition delay-150 duration-700 ease-in-out rounded-xl  bg-[#CCCCFA66] text-[#424286] "
      ref={ref}
    >
      <button
        className="p-2 dark:text-white text-[#424286] rounded-xl"
        onClick={toggleDropDown}
      >
        <span className="text-lg  ">{currentCurrency}</span>
      </button>
      {isOpen &&
        coinData.map((coin: Coin, index: number) => {
          if (coin.name !== currentCurrency)
            return (
              <button
                key={`${coin.id}-${index}`}
                className="flex gap-2 items-center p-1 dark:text-white dark:bg-[#191925] w-full bg-[#CCCCFA66] text-[#424286] "
                onClick={() => handleSelect(coin.name)}
              >
                <span className="text-lg">{coin.name}</span>
              </button>
            );
        })}
    </div>
  );
}
