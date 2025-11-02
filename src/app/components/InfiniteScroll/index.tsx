"use client";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Coin } from "@/interfaces/Coininterface";
import CoinRowItem from "../CoinRowItem";

import { useCoinContext } from "@/app/hooks/useCoinContext";

const InfiniteScrollComponent = () => {
  const { coinData, fetchMoreData, hasMore } = useCoinContext();

  return (
    <div className="w-full">
      <div className="hidden sm:flex  justify-between p-[20px] text-[#424286] dark:text-white h-[50px]">
        <div className="w-4">#</div>
        <div className="w-32">Name</div>
        <div className="w-20">Price</div>
        <div className="w-14">1h%</div>
        <div className="w-14">24h%</div>
        <div className="w-14">7d%</div>
        <div className="w-48">24h Volume/Market Cap</div>
        <div className="w-48">Circulating/Total Supply</div>
        <div className="w-20">Last 7 day</div>
      </div>
      <InfiniteScroll
        dataLength={coinData.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center items-center my-10">
            <div className="w-10 h-10 border-2 border-[#424286] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {coinData.map((coin: Coin, index: number) => (
          <CoinRowItem coin={coin} index={index} key={`${coin.id}-${index}`} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
export default InfiniteScrollComponent;
