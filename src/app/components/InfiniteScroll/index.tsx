"use client";
import { useState, useEffect, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Coin } from "@/interfaces/Coininterface";
import CoinRowItem from "../CoinRowItem";
import { CoinDataContext } from "@/app/context/coinDataContext";

export default function InfiniteScrollComponent() {
  //   const [coinData, setData] = useState<Coin[]>([]);
  //   const [page, setPage] = useState(1);

  const { coinData, fetchMoreData } = useContext(CoinDataContext);

  useEffect(() => {
    fetchMoreData();
  }, []);

  //   const fetchMoreData = async () => {
  //     const response = await fetch(
  //       `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
  //     );
  //     const data = await response.json();

  //     setData(coinData.concat(data));

  //     setPage(page + 1);
  //     console.log(coinData);
  //   };

  return (
    <div className="w-full">
      <div className="flex  justify-between p-[20px] text-[#424286] dark:text-white  dark:bg-[#191925] h-[50px] ">
        <div className="w-4">#</div>
        <div className="w-24">Name</div>
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
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {coinData.map((coin, index) => (
          <CoinRowItem coin={coin} index={index} key={coin.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
}
