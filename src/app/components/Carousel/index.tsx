"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { CoinDataContext } from "@/app/context/coinDataContext";

import { Coin } from "@/interfaces/Coininterface";

import HomeComparisonChart from "../HomeComparison";
import CarouselCoinContainer from "../CarouselCoinContainer";
import { SliderCoin } from "@/interfaces/SliderCoinInterface";

const Carousel = () => {
  const { coinData, showComparison, setShowComparison } =
    useContext(CoinDataContext);
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  const [sliderData, setSliderData] = useState<SliderCoin[]>([]);

  const [selectedSlides, setSelectedSlides] = useState<SliderCoin[]>([]);

  const coins = coinData.map((coin: Coin) => coin);

  function slider(array: SliderCoin[]) {
    setSliderData(array);
  }

  useEffect(() => {
    if (coinData.length > 0) {
      const coinsInSlides = coinData.map((coin: Coin) => ({
        ...coin,
        selected: false,
      }));

      slider(coinsInSlides);
      console.log("coins in slides", coinsInSlides);
    }
  }, [coinData]);

  const numberofSelectedSlides: number = sliderData.filter(
    (coin) => coin.selected
  ).length;

  console.log("number", numberofSelectedSlides);

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

    console.log("upadtedslides", updatedSlides);
    setSliderData(updatedSlides);

    const selectCoins = sliderData.filter((coin) => coin.selected === true);

    setSelectedSlides(selectCoins);
    console.log("selected", selectedSlides);
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
      console.log("unselect", unselectedSlides);
      setSliderData(unselectedSlides);
      // setSelectedSlides([]);
    }
  };
  return (
    <div className="w-full mt-10 flex flex-col gap-4">
      <div className="w-full h-14 mt-10">
        <div className="flex mb-6 justify-between">
          <h1>Select the currencies to view statistics</h1>
          <button
            className="
                    bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680]
                     w-44 h-14 flex justify-center items-center  rounded-lg"
            onClick={handleComparison}
          >
            {showComparison ? "Exit Comparison" : "Compare"}
          </button>
        </div>
      </div>
      <div className="w-full h-[120px]">
        <Slider {...settings}>
          {sliderData?.map((coin: SliderCoin) => (
            <div key={coin.id} onClick={() => handleSelect(coin)}>
              <CarouselCoinContainer
                id={coin.id}
                selected={coin.selected}
                image={coin.image}
                name={coin.name}
                symbol={coin.symbol}
                price_change_24h={coin.price_change_percentage_24h}
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
