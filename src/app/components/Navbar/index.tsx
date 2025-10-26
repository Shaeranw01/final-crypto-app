"use client";
import { FaCoins } from "react-icons/fa";
import { RiHome5Fill } from "react-icons/ri";
import { GoStack } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import SearchBar from "../SearchBar";
import Dropdown from "../DropDown";
import ThemeSwitch from "../ThemeSwitcher";

import Coinbar from "@/app/components/Coinbar";
import Link from "next/link";
import { useCoinContext } from "@/app/hooks/useCoinContext";
import { useState } from "react";

const Navbar = () => {
  const { setShowConvertor } = useCoinContext();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="w-full flex flex-col ">
      <Coinbar />
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
