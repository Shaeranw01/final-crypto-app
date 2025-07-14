"use client";

import { TiDeleteOutline } from "react-icons/ti";
import Dropdown from "../DropDownAsset";
import { CoinDataContext } from "@/app/context/coinDataContext";
import { useOutsideClick } from "@/app/hooks/useClickOutside";

import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  ChangeEvent,
} from "react";
import Image from "next/image";

import { GoStack } from "react-icons/go";

import { Coin } from "@/interfaces/Coininterface";
import AssetStats from "../AssetStats";

export default function AddAsset() {
  const [showAsset, setAsset] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [dateValue, setdateValue] = useState<string>("");
  const [showBlur, setBlur] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  const [isOpen, setIsOpen] = useState(false);
  // const [mounted, setMounted] = useState(false);
  const { coinData } = useContext(CoinDataContext);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  const [currentCurrency, setCurrency] = useState("Select Coin");

  const [assetCoins, setAssetCoins] = useState<Coin[]>([]);
  const [showAddPopUp, setPopUp] = useState(false);

  const handlePopUp = () => {
    setPopUp(!showAddPopUp);
  };
  const handleSave = () => {
    setPopUp(!showAddPopUp);
    setAsset(!showAsset);
    console.log("button ");
  };

  const ref = useRef(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropDown = () => {
    setIsOpen(false);
  };

  useOutsideClick(ref, closeDropDown);
  // useEffect only runs on the client, so now we can safely show the UI
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return null;
  // }

  function selectCoin(id: string) {
    const asset: Coin = coinData.find((coin: Coin) => coin.id === id);
    // console.log("asset", asset);
    setSelectedCoin(asset);

    console.log("selected", selectedCoin);
  }

  const handleSelect = (id: string) => {
    // const asset: Coin = coinData.filter((coin: Coin) => coin.id === id);
    const asset: Coin | undefined = coinData.find(
      (coin: Coin) => coin.id === id
    );
    if (!asset) return;

    if (assetCoins.find((c) => c.id === asset.id)) {
      closeDropDown();
      return;
    }
    console.log("asset", asset);
    console.log("name.", asset.name);
    console.log(typeof asset);
    setSelectedCoin(asset);
    // selectCoin(asset.id);
    console.log("id", asset.id);
    // console.log("selected", selectedCoin);

    setAssetCoins([...assetCoins, asset]);

    console.log("asset coins", assetCoins);
    setCurrency(asset.name);
    closeDropDown();
  };

  useEffect(() => {
    const storedAssets = localStorage.getItem("assetCoins");
    const storedDate = localStorage.getItem("assetDate");
    const storedAmount = localStorage.getItem("assetAmount");
    if (storedAssets) {
      try {
        const parsedAssets = JSON.parse(storedAssets);
        if (parsedAssets.length > 0) {
          setAssetCoins(parsedAssets);
          setAsset(true);
        }
      } catch (err) {
        console.error("Failed to parse assetCoins from localStorage", err);
      }
    }
    if (storedDate) setdateValue(storedDate);
    if (storedAmount) setAmount(Number(storedAmount));
  }, []);

  useEffect(() => {
    localStorage.setItem("assetCoins", JSON.stringify(assetCoins));
  }, [assetCoins]);

  useEffect(() => {
    localStorage.setItem("assetDate", dateValue);
  }, [dateValue]);

  useEffect(() => {
    localStorage.setItem("assetAmount", amount.toString());
  }, [amount]);

  return (
    <div>
      <div className=" w-full   dark:bg-[#13121A] relative dark:text-white font-[Space_Grotesk] bg-[#F3F5F9] text-[#353570] p-20 box-border ">
        <div className="w-full h-[100px] flex justify-between">
          <div>Your Statistics</div>
          <div>
            <button onClick={() => handlePopUp()}>Add Asset</button>
          </div>
        </div>
        {showAddPopUp && (
          <div className="w-full fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40">
            <div className="dark:bg-[#13121A] absolute top-40 z-50 w-[886px] h-[393px] rounded-xl p-12 flex flex-col gap-8 left-20">
              <div className="w-full h-4 flex justify-between">
                <div className="text-white font-[Space Grotesk]">
                  Select Coins
                </div>
                <TiDeleteOutline className="w-6 h-6 fill-white"></TiDeleteOutline>
              </div>

              <div className="w-full h-72 gap-8 flex justify-between">
                <div className="bg-[#191932] w-72 rounded-xl flex flex-col justify-center items-center gap-2">
                  <div className="w-16 h-16 rounded-md p-4 flex justify-between items-center">
                    <div className="w-8 h-8 text-white">
                      {selectedCoin ? (
                        <Image
                          src={selectedCoin.image}
                          width={30}
                          height={30}
                          alt="Picture of the coin"
                        />
                      ) : (
                        <GoStack />
                      )}
                    </div>
                  </div>
                  <div className="h-7 font-[Space Grotesk] text-xl text-white">
                    {selectedCoin
                      ? selectedCoin.name
                      : "No Currency Selected..."}
                    {selectedCoin && selectedCoin?.symbol?.toUpperCase()}
                  </div>
                </div>
                <div className="w-[461px] h-72 flex flex-col gap-8">
                  <div className="bg-[#191925]  w-full h-11 rounded">
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
                        coinData.map((coin) => {
                          if (coin.name !== currentCurrency)
                            return (
                              <button
                                key={coin.id}
                                className="flex gap-2 items-center p-1 dark:text-white dark:bg-[#191925] w-full bg-[#CCCCFA66] text-[#424286] "
                                onClick={() => handleSelect(coin.id)}
                              >
                                <span className="text-lg">{coin.name}</span>
                              </button>
                            );
                        })}
                    </div>
                  </div>
                  <div className="w-full text-white">
                    <input
                      type="number"
                      className="bg-[#191925] w-full h-11 rounded p-2 outline-none"
                      value={amount}
                      onChange={handleChange}
                      placeholder="Purchased Amount"
                      min={1} // Minimum positive integer
                      step={1} // ✅ Only allows whole numbers
                    />
                  </div>
                  <div className="w-full text-white">
                    <input
                      type="date"
                      className="bg-[#191925] w-full h-11 rounded p-2"
                      value={dateValue}
                      onChange={(e) => setdateValue(e.target.value)}
                      placeholder="Purchased date"
                      max={new Date().toISOString().split("T")[0]}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="w-full h-20 flex gap-4 justify-between ">
                    <button className="w-1/2" onClick={() => handleSave()}>
                      {" "}
                      Save and Continue
                    </button>
                    <button className="w-1/2" onClick={() => handlePopUp()}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {showAddPopUp && (
          <div className="w-full h-20 flex gap-4 justify-between relative top-40">
            <button className="w-1/2" onClick={() => handleSave()}>
              {" "}
              Save and Continue
            </button>
            <button className="w-1/2" onClick={() => handlePopUp()}>
              Cancel
            </button>
          </div>
        )}
      </div> */}

        {showAsset && (
          <AssetStats
            assetCoins={assetCoins}
            dateValue={dateValue}
            total={amount}
          ></AssetStats>
        )}
      </div>
    </div>
  );
}
