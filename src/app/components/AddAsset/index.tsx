"use client";

import { TiDeleteOutline } from "react-icons/ti";
import Dropdown from "../DropDownAsset";
import { CoinDataContext } from "@/app/context/coinDataContext";
import { useOutsideClick } from "@/app/hooks/useClickOutside";
import AssetPopUp from "../AssetPopUp";
import useLocalState from "@/app/hooks/useLocalState";
import { CiEdit } from "react-icons/ci";

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
  const [showAsset, setAsset] = useState(true);
  const [isEdit, setEdit] = useState(false);
  // const [amount, setAmount] = useState<number>(0);
  // const [dateValue, setdateValue] = useState<string>("");

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const number = parseInt(e.target.value);
  //   setAmount(number);
  // };
  // const [isOpen, setIsOpen] = useState(false);
  // const [mounted, setMounted] = useState(false);
  const { coinData } = useContext(CoinDataContext);
  // const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  // const [currentCurrency, setCurrency] = useState("Select Coin");

  const [assetCoins, setAssetCoins] = useLocalState("assetCoins", []);
  const [showAddPopUp, setPopUp] = useState(false);

  const handlePopUp = () => {
    setPopUp(true);
  };
  const handleSave = () => {
    setPopUp(false);
    console.log("button ", showAsset);
  };

  const handleEdit = () => {
    setEdit(!isEdit);
    console.log("edit", isEdit);
  };
  // const ref = useRef(null);

  // const toggleDropDown = () => {
  //   setIsOpen(!isOpen);
  // };

  // const closeDropDown = () => {
  //   setIsOpen(false);
  // };

  // useOutsideClick(ref, closeDropDown);
  // useEffect only runs on the client, so now we can safely show the UI
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return null;
  // }

  // function selectCoin(id: string) {
  //   const asset: Coin = coinData.find((coin: Coin) => coin.id === id);
  //   // console.log("asset", asset);
  //   setSelectedCoin(asset);

  //   console.log("selected", selectedCoin);
  // }

  // const handleSelect = (id: string) => {
  //   // const asset: Coin = coinData.filter((coin: Coin) => coin.id === id);
  //   const asset: Coin | undefined = coinData.find(
  //     (coin: Coin) => coin.id === id
  //   );
  //   if (!asset) return;

  //   // if (assetCoins.find((c) => c.id === asset.id)) {
  //   //   closeDropDown();
  //   //   return;
  //   // }

  //   const assetWithMetaData = {
  //     ...asset,
  //     purchaseDate: dateValue,
  //     purchaseAmount: amount,
  //   };
  //   console.log("asset", asset);
  //   console.log("name.", asset.name);
  //   console.log(typeof asset);
  //   setSelectedCoin(assetWithMetaData);
  //   // selectCoin(asset.id);
  //   console.log("id", asset.id);
  //   // console.log("selected", selectedCoin);

  //   setAssetCoins([...assetCoins, assetWithMetaData]);

  //   console.log("asset coins", assetCoins);
  //   setCurrency(assetWithMetaData.name);
  //   closeDropDown();
  // };

  return (
    <div className="w-full min-h-screen relative dark:text-white font-[Space_Grotesk] text-[#353570] p-20 box-border bg-[#F3F5F9] dark:bg-[#13121A]">
      <div className="w-full flex justify-between">
        <div>Your Statistics</div>
        <div>
          <button onClick={() => handlePopUp()}>Add Asset</button>
        </div>
      </div>
      {showAddPopUp && (
        <AssetPopUp
          showAddPopUp={showAddPopUp}
          setPopUp={setPopUp}
          handlePopUp={handlePopUp}
          assetCoins={assetCoins}
          setAssetCoins={setAssetCoins}
        />
      )}
      <AssetStats assetCoins={assetCoins} isEdit={isEdit}></AssetStats>
      <div className="flex items-center justify-center">
        <CiEdit className="w-10 h-10 " onClick={() => handleEdit()}></CiEdit>
      </div>
    </div>
  );
}
