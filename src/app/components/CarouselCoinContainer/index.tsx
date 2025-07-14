import Image from "next/image";

import PriceChange from "../PriceChange";

export default function CarouselCoinContainer({
  id,
  selected,
  image,
  name,
  symbol,
  price_change_24h,
}: {
  id: string;
  selected: boolean;
  image: string;
  name: string;
  symbol: string;
  price_change_24h: number;
}) {
  return (
    <div
      className={`${
        selected
          ? " bg-[#6161D680] text-[#424286] dark:bg-[#6161D680] dark:text-white"
          : "bg-white dark:bg-[#232336] text-[#424286]  dark:text-white"
      } w-[250px] h-[80px] flex items-center  rounded-lg p-2`}
      key={id}
    >
      <Image src={image} width={32} height={32} alt="Picture of the coin" />

      <div className="flex flex-col gap-1">
        <div className="dark:text-white text-[#353570] ">
          {name}
          <span>({symbol.toUpperCase()})</span>
        </div>
        <div className="flex items-center gap-1">
          <div>{price_change_24h.toFixed(2)}USD</div>
          <PriceChange value={price_change_24h} />
        </div>
      </div>
    </div>
  );
}
