"use client";
import { useOutsideClick } from "@/app/hooks/useClickOutside";
import React, { useRef, useState, useEffect, ReactElement } from "react";

import { LuEuro } from "react-icons/lu";
import { MdCurrencyPound } from "react-icons/md";
import { LuBitcoin } from "react-icons/lu";
import { FaEthereum } from "react-icons/fa6";
import { BiDollar } from "react-icons/bi";
import { useCoinContext } from "@/app/hooks/useCoinContext";

interface Currency {
  name: string;
  symbol: ReactElement;
  id: number;
}
//React element — a JS object that React can render into real DOM.
export const currencyArray: Currency[] = [
  {
    name: "usd",
    symbol: <BiDollar />,
    id: 1,
  },
  {
    name: "eur",
    symbol: <LuEuro />,
    id: 2,
  },
  {
    name: "gbp",
    symbol: <MdCurrencyPound />,
    id: 3,
  },
  {
    name: "btc",
    symbol: <LuBitcoin />,
    id: 6,
  },
  {
    name: "eth",
    symbol: <FaEthereum />,
    id: 7,
  },
];

const Dropdown = () => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    currencySymbol,
    setCurrencySymbol,
  } = useCoinContext();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const handleSelect = (newCurrency: string, newSymbol: React.ReactElement) => {
    setSelectedCurrency(newCurrency);
    setCurrencySymbol(newSymbol);
  };

  return (
    <div
      className=" w-12 sm:w-24 flex h-10 dark:bg-[#191925] flex-col items-center relative  dark:text-white transition delay-150 duration-700 ease-in-out rounded-lg  bg-[#CCCCFA66] text-[#424286]"
      ref={ref}
    >
      <button
        className="w-full flex justify-center sm:items-center p-2 dark:text-white  text-[#424286] gap-1 "
        onClick={toggleDropDown}
      >
        <span className="hidden sm:inline-flex">{currencySymbol}</span>

        <span className="text-base  ">{selectedCurrency.toUpperCase()}</span>
      </button>
      {isOpen && (
        <div className="w-full absolute rounded-lg mt-11 dark:bg-[#191925] bg-[#CCCCFA66] z-50">
          {currencyArray.map(({ name, symbol, id }) => {
            if (name === selectedCurrency) {
              return null;
            }
            return (
              <button
                key={id}
                className="w-full flex justify-center sm:items-center p-2 dark:text-white  text-[#424286] "
                onClick={() => handleSelect(name, symbol)}
              >
                <span className="hidden sm:inline-flex">{symbol}</span>

                <span className="text-base sm:ml-4">{name.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Dropdown;
