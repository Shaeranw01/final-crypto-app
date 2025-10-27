"use client";
import { FaCoins } from "react-icons/fa";
import { RiHome5Fill } from "react-icons/ri";
import { GoStack } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import SearchBar from "../SearchBar";
import Dropdown from "../DropDown";
import ThemeSwitch from "../ThemeSwitcher";

import { PiCurrencyDollarFill } from "react-icons/pi";

import { BiSolidUpArrow } from "react-icons/bi";

import { useState, useEffect } from "react";
import Image from "next/image";

import { GoDotFill } from "react-icons/go";

import formatCompactNumber from "@/utlis/getFormattedPrice";
import Link from "next/link";
import { useCoinContext } from "@/app/hooks/useCoinContext";

const Navbar = () => {
  const { setShowConvertor } = useCoinContext();
  const [loading, setLoading] = useState<boolean>(true);
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
    } catch (err: unknown) {
      let message = "Failed to fetch coinbar data";
      if (err instanceof Error) message = err.message;
      setError(message);
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
    <div className="w-full flex flex-col ">
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
      <div className=" dark:bg-[#13121A] bg-[#FFFFFF] h-20 px-4 sm:px-8 md:px-12 lg:px-20 py-5">
        <div className=" text-white text-2xl flex justify-between">
          <div className="flex justify-start gap-2 text-xl font-bold items-end">
            <FaCoins className="w-7 h-7 sm:w-10 sm:h-10 dark:fill-white fill-[#6161D6]"></FaCoins>
            <span className="hidden sm:inline text-[#353570] dark:text-white">
              Coin Trade
            </span>
          </div>

          <div className="hidden sm:flex justify-between items-center text-lg gap-4">
            <Link
              href="/"
              className="flex gap-2 "
              onClick={() => setShowConvertor(false)}
            >
              <RiHome5Fill className="w-5 h-5 dark:fill-white fill-[#353570]"></RiHome5Fill>
              <span className=" dark:text-white text-[#353570] text-sm">
                Home
              </span>
            </Link>

            <Link href="/portfolio" className="flex gap-2 items-end">
              <GoStack className="w-5 h-5 dark:fill-white fill-[#353570]"></GoStack>
              <span className="dark:text-white text-[#353570] text-sm">
                Portfolio
              </span>
            </Link>
          </div>

          <div className="flex justify-between items-center gap-4 -mr-4 text-lg ml-0 sm:ml-10">
            <div className="flex w-36 sm:w-56 relative justify-start items-center dark:bg-[#191925] bg-[#CCCCFA66] rounded-xl gap-4 px-3">
              <CiSearch className="w-6 h-6 dark:fill-white fill-[#424286]"></CiSearch>
              <SearchBar isMobile={false} />
            </div>

            {/* <div className="flex md:hidden">
              <CiSearch
                className="w-4 h-4 sm:w-6 sm:h-6 dark:fill-white fill-[#424286] cursor-pointer"
                onClick={() => setShowMobileSearch(true)}
              ></CiSearch>
            </div> */}
            <Dropdown />
            <ThemeSwitch />
            <div></div>
          </div>
        </div>
      </div>
      {/* {showMobileSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-[#191925] w-full max-w-md rounded-2xl shadow-lg p-4 mt-10">
            <div className="flex items-center gap-3 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 relative">
              <CiSearch className="w-6 h-6 dark:fill-white fill-[#424286]" />
              <SearchBar isMobile={showMobileSearch} />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="text-[#6161D6] text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
export default Navbar;
