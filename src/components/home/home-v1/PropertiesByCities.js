"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ListingsService } from "@/services/listings.service";

const fallbackCities = [
  { key: "lahore", label: "Lahore", count: 48, href: "/listings?city=Lahore" },
  {
    key: "islamabad",
    label: "Islamabad",
    count: 34,
    href: "/listings?city=Islamabad",
  },
  {
    key: "rawalpindi",
    label: "Rawalpindi",
    count: 29,
    href: "/listings?city=Rawalpindi",
  },
  { key: "karachi", label: "Karachi", count: 41, href: "/listings?city=Karachi" },
  {
    key: "faisalabad",
    label: "Faisalabad",
    count: 17,
    href: "/listings?city=Faisalabad",
  },
  { key: "multan", label: "Multan", count: 14, href: "/listings?city=Multan" },
];

const getCityImage = (key, index) => {
  switch (key.toLowerCase()) {
    case "lahore":
      return "/images/cities/lahore.png";
    case "islamabad":
      return "/images/cities/islamabad.png";
    case "rawalpindi":
      return "/images/cities/rawalpindi.png";
    case "karachi":
      return "/images/cities/karachi.png";
    case "faisalabad":
      return "/images/cities/faisalabad.png";
    case "multan":
      return "/images/cities/multan.png";
    default:
      return `/images/cities/random.png`;
  }
};

const PropertiesByCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await ListingsService.getListingCities();
        if (response?.success && response?.data?.items) {
          setCities(response.data.items);
        }
      } catch (err) {
        console.error("Failed to fetch cities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const cityItems = cities.length ? cities : fallbackCities;

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation]}
        navigation={{
          nextEl: ".property-by-city-next__active",
          prevEl: ".property-by-city-prev__active",
        }}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {cityItems.map((city, index) => (
          <SwiperSlide key={city.key}>
            <div className="item">
              <div className="feature-style1">
                <div className="feature-img">
                  <Image
                    width={400}
                    height={400}
                    className="w-100 h-100 cover"
                    src={getCityImage(city.key, index)}
                    alt={city.label}
                  />
                </div>
                <div className="feature-content">
                  <div className="top-area">
                    <h6 className="title mb-1">{city.label}</h6>
                    <p className="text">{city.count} Properties</p>
                  </div>
                  <div className="bottom-area">
                    <Link className="ud-btn2" href={city.href}>
                      See Properties
                      <i className="fal fa-arrow-right-long" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rounded-arrow arrowY-center-position">
        <button className="property-by-city-prev__active swiper_button _prev">
          <i className="far fa-chevron-left" />
        </button>
        {/* End prev */}

        <button className="property-by-city-next__active swiper_button _next">
          <i className="far fa-chevron-right" />
        </button>
        {/* End Next */}
      </div>
      {/* End .col for navigation  */}
    </>
  );
};

export default PropertiesByCities;
