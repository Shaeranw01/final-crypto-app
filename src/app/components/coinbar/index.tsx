"use client";

import { PiCurrencyDollarFill } from "react-icons/pi";

import { BiSolidUpArrow } from "react-icons/bi";

import { useState, useEffect } from "react";
import Image from "next/image";

import { GoDotFill } from "react-icons/go";

import formatCompactNumber from "@/utlis/getFormattedPrice";
const Coinbar = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState({
    activeCurrencies: 0,
    btcCap: 0,
    ethCap: 0,
    volume: 0,
    marketCap: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://corsproxy.io/?url=https://api.coingecko.com/api/v3/global"
      );
      if (!response.ok) {
        throw new Error(`Network Error`);
      }
      const { data } = await response.json();
      if (!data) throw new Error("No data received from API");

      setMarketData({
        activeCurrencies: data.active_cryptocurrencies,
        btcCap: data.market_cap_percentage.btc,
        ethCap: data.market_cap_percentage.eth,
        volume: data.total_volume.btc,
        marketCap: data.total_market_cap.btc,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch coinbar data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="w-full h-14 flex justify-center items-center text-gray-600 dark:text-gray-300">
        Loading market data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-14 flex flex-col justify-center items-center text-center text-gray-600 dark:text-gray-300 gap-1">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div>
      <div className=" w-full dark:bg-[#1E1932] bg-[#353570] h-14 flex-center ">
        <div className="w-28 h-5 text-white text-xs font-mono flex  justify-center items-center gap-1">
          <PiCurrencyDollarFill className="w-5 fill-white">
            {" "}
          </PiCurrencyDollarFill>
          <div>Coins</div>
          <div> {marketData.activeCurrencies}</div>
        </div>

        <div className="w-16 h-5 text-white text-xs font-mono flex  justify-center items-center">
          <BiSolidUpArrow className="w-5 fill-teal-500 "></BiSolidUpArrow>
          <div>{formatCompactNumber(marketData?.marketCap)}</div>
        </div>
        <div className="w-16 h-5 text-white text-xs font-mono flex  justify-center items-center">
          <GoDotFill fill="white"></GoDotFill>
          <div>{formatCompactNumber(marketData?.volume)} </div>
        </div>
        <div className="w-28 h-5 text-white text-xs font-mono gap-2  hidden sm:flex  justify-center items-center">
          <div className=" rounded-full">
            <Image
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
              }
              width={80}
              height={80}
              alt="Picture of the coin"
            />
          </div>

          <div>{marketData.btcCap.toFixed(2)} </div>
          <div className="bg-gray-400 rounded-full w-[15rem] h-2">
            <div
              className="bg-yellow-500 rounded-full h-2 "
              style={{ width: `${marketData?.btcCap}%` }}
            ></div>
          </div>
        </div>
        <div className="w-28 h-5 text-white text-xs font-mono gap-2  hidden sm:flex  justify-center items-center">
          <div className=" rounded-full  bg-blue-400 hidden md:block">
            <Image
              src={"https://files.coinswitch.co/public/coins/eth.png"}
              width={80}
              height={80}
              alt="Picture of the coin"
            />
          </div>

          <div>{marketData.ethCap.toFixed(2)}</div>
          <div className="bg-gray-400 rounded-full w-[15rem] h-2">
            <div
              className=" bg-blue-400 rounded-full  h-2"
              style={{ width: `${marketData?.ethCap}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Coinbar;
