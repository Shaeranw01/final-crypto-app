"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CiLink } from "react-icons/ci";
import { FiCopy } from "react-icons/fi";
import PriceChange from "../PriceChange";
import { LuLayers3 } from "react-icons/lu";
import { MdArrowDropUp } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";
import DetailLine from "../DetailLine";
import LinkDiv from "../LinkDiv";
import { CoinPage } from "@/interfaces/CoinPageInterface";
import formatDate from "@/utlis/getFormattedDate";
import { trimName } from "@/utlis/trimName";
import { useCoinContext } from "@/app/hooks/useCoinContext";
import { useCallback } from "react";

const CoinData = ({ coinId }: { coinId: string }) => {
  const { selectedCurrency, currencySymbol } = useCoinContext();
  const [coinData, setData] = useState<CoinPage>(Object);
  const price24Change: number =
    coinData?.market_data?.price_change_percentage_24h;
  const imageLink: string = coinData?.image?.thumb;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoreData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://corsproxy.io/?url=https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      if (!data || data.error) {
        throw new Error("Coin data not found");
      }

      setData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load coin data");
      }
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  useEffect(() => {
    fetchMoreData();
  }, [fetchMoreData]);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-medium">Loading coin data...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-center bg-gray-50 dark:bg-[#0f0f1a] transition-colors duration-300">
        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
          Failed to load coin data
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
          {error}
        </p>
        <button
          onClick={fetchMoreData}
          className="px-5 py-2 mt-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className=" w-full min-h-screen relative flex flex-col gap-10 dark:bg-[#13121A] dark:text-white font-[Space_Grotesk] bg-[#F3F5F9] text-[#353570] px-4 sm:px-8 md:px-12 lg:px-20 box-border my-20">
      <div className=" h-auto flex flex-col sm:flex-row justify-between gap-10 ">
        <div className="flex-1 h-80 flex flex-col gap-4">
          <div className="h-32 sm:h-64 w-full rounded-xl flex flex-col justify-center items-center gap-6 dark:bg-[#1E1932] bg-[#CCCCFA66]">
            <div className="w-8 h-8 p-2 sm:w-16 sm:h-16 rounded-lg sm:p-4 dark: bg-[#2C2C4A] bg-[#CCCCFA66]  ">
              {imageLink && (
                <Image src={imageLink} width={32} height={32} alt="coin-logo" />
              )}
            </div>
            <div className="w-44 h-7 text-lg sm:text-2xl font-light sm:font-bold text-center ">
              {coinData.name}
              <span> ({coinData?.symbol?.toUpperCase()})</span>
            </div>
          </div>
          <div className="w-full rounded-xl p-4 flex gap-4 justify-around items-center dark:bg-[#1E1932] bg-[#CCCCFA66]">
            <CiLink className="w-5 h-5 dark:fill-white fill-[#353570]">
              <a href={coinData?.links?.homepage}></a>
            </CiLink>
            <div className="text-base font-light">
              {coinData?.links?.homepage}
            </div>
            <FiCopy className="w-3 h-3 sm:w-5 sm:h-5"></FiCopy>
          </div>
        </div>
        <div className="flex-1 rounded-xl py-10 px-14 flex flex-col gap-6 dark:bg-[#1E1932] bg-[#CCCCFA66]">
          <div className="flex flex-row items-center gap-4">
            <div className="font-bold text-4xl">
              {selectedCurrency.toUpperCase()}&nbsp;
              <span>
                {coinData?.market_data?.current_price?.[selectedCurrency]}
              </span>
            </div>
            <PriceChange value={price24Change} />
          </div>

          <div className="flex justify-center items-center m-5">
            <LuLayers3 className="w-6 h-6" />
          </div>

          <div className=" flex flex-col gap-6">
            <div className="flex flex-row gap-1">
              <MdArrowDropUp className="fill-[#01F1E3] h-8 w-8" />
              <div className="flex flex-col">
                <div className="font-normal text-base">
                  All time high:&nbsp;&nbsp;
                  <span className="font-medium text-lg">
                    {coinData?.market_data?.ath?.[selectedCurrency]}
                  </span>
                </div>
                <div className="text-sm dark:text-gray-500 sm:text-gray-700">
                  {formatDate(
                    coinData?.market_data?.ath_date?.[selectedCurrency]
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-1 ">
              <MdArrowDropDown className="fill-[#FE2264] h-8 w-8" />
              <div className="flex flex-col ">
                <div className="font-normal text-base">
                  All time Low:&nbsp;&nbsp;
                  <span className="font-medium text-lg">
                    {coinData?.market_data?.atl?.[selectedCurrency]}
                  </span>
                </div>
                <div className="text-sm  dark:text-gray-500 sm:text-gray-700 ">
                  {formatDate(
                    coinData?.market_data?.atl_date?.[selectedCurrency]
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[1.5] rounded-xl p-10 flex flex-col gap-4 dark:bg-[#1E1932]  bg-[#CCCCFA66]">
          <div className="h-36 flex flex-col gap-4 ">
            <DetailLine
              text={"Market Cap"}
              value={coinData?.market_data?.market_cap?.[selectedCurrency]}
              symbol={currencySymbol}
            />
            <DetailLine
              text={"Fully Diluted Valuation"}
              value={
                coinData?.market_data?.fully_diluted_valuation?.[
                  selectedCurrency
                ]
              }
              symbol={currencySymbol}
            />

            <DetailLine
              text={"Volume/Market"}
              value={Number(
                (
                  coinData?.market_data?.total_volume?.[selectedCurrency] /
                  coinData?.market_data?.market_cap?.[selectedCurrency]
                ).toFixed(2)
              )}
              symbol={currencySymbol}
            />
          </div>
          <div className="w-full h-28 flex flex-col gap-4">
            <DetailLine
              text={"Total Volume"}
              value={coinData?.market_data?.total_volume?.[selectedCurrency]}
              symbol={currencySymbol}
            />
            <DetailLine
              text={"Circulating Supply"}
              value={coinData?.market_data?.circulating_supply}
              symbol={currencySymbol}
            />
            <DetailLine
              text={"Max Supply"}
              value={21000000}
              symbol={currencySymbol}
            />
          </div>
        </div>
      </div>

      <div className="max-w-full flex flex-col sm:flex-row gap-16">
        <div className="flex flex-1 flex-col gap-5 order-2 sm:order-1">
          <div className="font-medium text-xl ">Description</div>
          <div className="text-sm">{coinData?.description?.en}</div>
        </div>
        <div className=" flex flex-1 flex-col gap-6 mt-8 order-1 sm:order-2">
          <LinkDiv link={coinData?.links?.homepage[0]} />
          <LinkDiv link={trimName(coinData?.links?.blockchain_site[0], 30)} />
          <LinkDiv link={trimName(coinData?.links?.blockchain_site[1], 30)} />
        </div>
      </div>
    </div>
  );
};
export default CoinData;
