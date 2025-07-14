"use client";

import { useState } from "react";

import { HiCurrencyDollar } from "react-icons/hi";
import { AiOutlineEuroCircle } from "react-icons/ai";
import { AiOutlinePoundCircle } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa6";
import { FaBitcoin } from "react-icons/fa";

export default function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="w-24 bg-[#191925] flex justify-start items-center p-7  relative">
      <button onClick={toggleDropDown}>Search...</button>
      {isOpen && (
        <div className="absolute  w-32 top-20 right-0 "></div>
      )}

      {isOpen && (
        <div className="absolute w-32 top-20 right-0 ">
          <div className="flex-col">
            <div className="currency">
              <HiCurrencyDollar></HiCurrencyDollar>
              <p>USD</p>
            </div>
            <div className="currency">
              <AiOutlineEuroCircle></AiOutlineEuroCircle>
              <p>Euro</p>
            </div>
            <div className="currency">
              <AiOutlinePoundCircle></AiOutlinePoundCircle>
              <p>Pound</p>
            </div>
            <div className="currency">
              <FaEthereum></FaEthereum>
              <p>Ethereum</p>
            </div>
            <div className="currency">
              <FaBitcoin></FaBitcoin>
              <p>Bitcoin</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
