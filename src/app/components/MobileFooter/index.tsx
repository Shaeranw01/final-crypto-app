"use client";
import Link from "next/link";
import { RiHome5Fill } from "react-icons/ri";
import { GoStack } from "react-icons/go";
import { MdSwapHoriz } from "react-icons/md";

const MobileFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-3 bg-[#f5f5f5]/90 dark:bg-[#191925]/90 border-t border-gray-300 dark:border-gray-700 sm:hidden">
      <Link
        href="/"
        className="py-3 px-6 rounded-2xl flex flex-col items-center gap-1 bg-[#6161D680] text-white dark:bg-[#6161D680] "
      >
        <RiHome5Fill className="w-3 h-3 fill-white " />
        <span className="text-xs font-thin">Home</span>
      </Link>

      <Link
        href="/portfolio"
        className="py-3 px-6 rounded-2xl flex flex-col items-center gap-1 bg-[#6161D680] text-white dark:bg-[#6161D680]"
      >
        <GoStack className="w-3 h-3 fill-white" />
        <span className="text-xs font-thin">Portfolio</span>
      </Link>

      <Link
        href="/convertor"
        className="py-3 px-6 rounded-2xl flex flex-col items-center gap-1 bg-[#6161D680] text-white dark:bg-[#6161D680]"
      >
        <MdSwapHoriz className="w-3 h-3 fill-white" />
        <span className="text-xs font-thin">Convert</span>
      </Link>
    </div>
  );
};
export default MobileFooter;
