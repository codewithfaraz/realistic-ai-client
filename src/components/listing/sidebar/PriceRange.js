"use client";
import React, { useState } from "react";
import Slider from "rc-slider";

const formatPKR = (value) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)} Lac`;
  return value.toLocaleString();
};

const PriceRange = ({ filterFunctions }) => {
  const [price, setPrice] = useState([
    filterFunctions?.priceRange?.[0] || 0,
    filterFunctions?.priceRange?.[1] || 100000000,
  ]);

  const handleOnChange = (value) => {
    setPrice(value);
    filterFunctions?.handlepriceRange([value[0] || 0, value[1]]);
  };

  return (
    <>
      <div className="range-wrapper">
        <Slider
          range
          max={100000000}
          min={0}
          step={500000}
          defaultValue={[
            filterFunctions?.priceRange?.[0] || 0,
            filterFunctions?.priceRange?.[1] || 100000000,
          ]}
          onChange={(value) => handleOnChange(value)}
          id="slider"
        />
        <div className="d-flex align-items-center">
          <span id="slider-range-value1">PKR {formatPKR(price[0])}</span>
          <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
          <span id="slider-range-value2">PKR {formatPKR(price[1])}</span>
        </div>
      </div>
    </>
  );
};

export default PriceRange;
