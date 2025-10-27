"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import Slider from "react-slick";

import { useCoinContext } from "@/app/hooks/useCoinContext";

import { Coin } from "@/interfaces/Coininterface";

import HomeComparisonChart from "../HomeComparisonChart";
import CarouselCoinContainer from "../CarouselCoinContainer";
import { SliderCoin } from "@/interfaces/SliderCoinInterface";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const Carousel = () => {
  const { coinData, showComparison, setShowComparison, selectedCurrency } =
    useCoinContext();
  const NextArrow = ({ onClick }: { onClick?: () => void }) => {
    return (
      <div
        className="absolute top-1/2 right-[-30px] transform -translate-y-1/2 cursor-pointer z-50"
        onClick={onClick}
      >
        <FaChevronRight className="text-[#6161D6] dark:text-white w-6 h-6" />
      </div>
    );
  };

  const PrevArrow = ({ onClick }: { onClick?: () => void }) => {
    return (
      <div
        className="absolute top-1/2 left-[-30px] transform -translate-y-1/2 cursor-pointer z-50"
        onClick={onClick}
      >
        <FaChevronLeft className="text-[#6161D6] dark:text-white w-6 h-6" />
      </div>
    );
  };
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [sliderData, setSliderData] = useState<SliderCoin[]>([]);

  const [selectedSlides, setSelectedSlides] = useState<SliderCoin[]>([]);

  function slider(array: SliderCoin[]) {
    setSliderData(array);
  }

  useEffect(() => {
    if (coinData.length > 0) {
      const coinsInSlides = coinData.map((coin: Coin, index: number) => ({
        ...coin,
        selected: index === 0,
      }));

      slider(coinsInSlides);
    }
  }, [coinData]);

  const numberofSelectedSlides: number = sliderData.filter(
    (coin) => coin.selected
  ).length;

  const handleSelect = (coin: SliderCoin) => {
    const updatedSlides = sliderData.map((slide: SliderCoin) => {
      if (slide.id === coin.id) {
        if (slide.selected === false && numberofSelectedSlides < 2) {
          slide.selected = true;
        } else if (slide.selected === true) {
          slide.selected = false;
        }
      }
      return slide;
    });

    setSliderData(updatedSlides);

    const selectCoins = sliderData.filter((coin) => coin.selected === true);

    setSelectedSlides(selectCoins);
  };

  const handleComparison = () => {
    setShowComparison(!showComparison);
    if (showComparison === false) {
      const unselectedSlides = sliderData.map((slide: SliderCoin) => {
        if (slide.selected === true) {
          slide.selected = false;
        }
        return slide;
      });

      setSliderData(unselectedSlides);
    }
  };

  return (
    <div className="w-full mt-5 sm:mt-10 flex flex-col gap-4 ">
      <div className="w-full h-14 mt-5 sm:mt-10">
        <div className="flex  mb-3 sm:mb-6 justify-between items-end">
          <span className=" text-sm sm:text-base">
            Select the currencies to view statistics
          </span>
          <button
            className="
                    bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680]
                    w-35 h-10 p-3 sm:w-44 sm:h-14 flex justify-center items-center  rounded-lg text-sm sm:text-base"
            onClick={handleComparison}
          >
            {showComparison ? "Exit Comparison" : "Compare"}
          </button>
        </div>
      </div>
      <div className="w-full h-[120px] relative">
        <Slider
          {...settings}
          nextArrow={<NextArrow />}
          prevArrow={<PrevArrow />}
        >
          {sliderData?.map((coin: SliderCoin, index: number) => (
            <div
              key={`${coin.id}-${index}`}
              className="px-2"
              onClick={() => handleSelect(coin)}
            >
              <CarouselCoinContainer
                selected={coin.selected}
                image={coin.image}
                name={coin.name}
                symbol={coin.symbol}
                current_price={coin.current_price}
                price_change_24h={coin.price_change_percentage_24h}
                selectedCurrency={selectedCurrency}
              ></CarouselCoinContainer>
            </div>
          ))}
        </Slider>
      </div>

      <div className="w-full"></div>

      {showComparison &&
        selectedSlides[0].id !== "" &&
        selectedSlides[1].id !== "" && (
          <HomeComparisonChart
            id1={selectedSlides[0].id}
            id2={selectedSlides[1].id}
          ></HomeComparisonChart>
        )}
    </div>
  );
};

export default Carousel;
