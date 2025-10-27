"use client";

import { useOutsideClick } from "@/app/hooks/useClickOutside";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Coin } from "@/interfaces/Coininterface";
import useDebouncedFunction from "@/app/hooks/useDebounce";

const SearchBar = ({ isMobile }: { isMobile: boolean }) => {
  const [data, setData] = useState<Coin[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const fetchData = useCallback(async (q: string): Promise<void> => {
    const response = await fetch(
      `https://corsproxy.io/?url=https://api.coingecko.com/api/v3/search?query=${q.toLowerCase()}`
    );
    const allData = await response.json();
    setData(allData.coins ?? []);
  }, []);
  // ✅ Tell TypeScript what type the callback expects
  const debouncedFetchData = useDebouncedFunction<[string]>(fetchData, 200);

  const closeList = () => {
    setIsOpen(false);
  };
  const toggleDropDown = () => {
    setIsOpen(!isOpen);
    setQuery("");
  };

  useOutsideClick(ref, closeList);

  useEffect(() => {
    if (query.trim() === "") {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      debouncedFetchData(query);
    }
  }, [query, debouncedFetchData]);

  return (
    <div
      className=" h-10 w-full flex flex-col gap-4  rounded-md "
      ref={ref}
      onClick={toggleDropDown}
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="rounded-md w-full outline-none  h-full bg-transparent font-extralight text-sm placeholder-[#424286] dark:placeholder-white text-[#424286] dark:text-white"
      />
      {isOpen && (
        <div
          className={`${
            isMobile ? "w-full mt-14 " : "w-56 mt-11"
          } rounded-md absolute z-50 overflow-auto left-0 w-56 h-80`}
        >
          {data.length > 0 &&
            data.map((coin, index) => (
              <button
                key={`${coin.id}-${index}`}
                className="flex justify-start pt-4 dark:bg-[#191925] bg-[#CCCCFA66] text-[#424286] pl-2  w-full text-left text-sm dark:text-white font-light"
              >
                <Link href={`/coin/${coin.id}`}>{coin.name}</Link>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
