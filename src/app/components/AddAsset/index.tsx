"use client";

import AssetPopUp from "../AssetPopUp";
import useLocalState from "@/app/hooks/useLocalState";
import { CiEdit } from "react-icons/ci";
import { useCoinContext } from "@/app/hooks/useCoinContext";
import { Coin } from "@/interfaces/Coininterface";

import React, { useState } from "react";

import AssetStats from "../AssetStats";

const AddAsset = () => {
  // const [showAsset, setAsset] = useState(true);
  const [editAsset, setEdit] = useState(false);

  const [assetCoins, setAssetCoins] = useLocalState<Coin[]>("assetCoins", []);
  const [showAddPopUp, setPopUp] = useState(false);

  const handlePopUp = () => {
    setPopUp(true);
  };
  // const handleSave = () => {
  //   setPopUp(false);
  // };

  const handleEdit = () => {
    setEdit(!editAsset);
  };

  return (
    <div className="mt-10">
      <div className="w-full flex justify-between items-center">
        <div className="text-sm sm:text-lg">Your Statistics</div>

        <div className="flex sm:hidden items-center justify-center">
          <CiEdit className="w-5 h-5 " onClick={() => handleEdit()}></CiEdit>
        </div>
        <div>
          <button
            className="w-28 sm:w-40 dark:bg-[#191925]  h-10 flex justify-center items-center rounded-lg bg-[#CCCCFA66] p-3 text-sm sm:text-lg"
            onClick={() => handlePopUp()}
          >
            Add Asset
          </button>
        </div>
      </div>
      {showAddPopUp && (
        <AssetPopUp
          setPopUp={setPopUp}
          assetCoins={assetCoins}
          setAssetCoins={setAssetCoins}
        />
      )}
      <AssetStats
        assetCoins={assetCoins}
        setAssetCoins={setAssetCoins}
        editAsset={editAsset}
      ></AssetStats>
      <div className="hidden sm:flex items-center justify-center">
        <CiEdit className="w-10 h-10 " onClick={() => handleEdit()}></CiEdit>
      </div>
    </div>
  );
};
export default AddAsset;
