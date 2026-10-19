"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ListingsService } from "@/services/listings.service";

const fallbackPropertyTypes = [
  { key: "house", label: "Houses", count: 42, href: "/listings?type=house" },
  {
    key: "apartment",
    label: "Apartments",
    count: 36,
    href: "/listings?type=apartment",
  },
  { key: "plot", label: "Residential Plots", count: 28, href: "/listings?type=plot" },
  { key: "villa", label: "Villas", count: 18, href: "/listings?type=villa" },
  { key: "office", label: "Commercial", count: 15, href: "/listings?type=office" },
];

const getIcon = (key) => {
  switch (key.toLowerCase()) {
    case "apartment":
      return "flaticon-corporation";
    case "office":
      return "flaticon-network";
    case "plot":
      return "flaticon-garden";
    case "house":
    case "villa":
      return "flaticon-home";
    case "townhome":
      return "flaticon-chat";
    default:
      return "flaticon-home-1";
  }
};

const ApartmentType = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await ListingsService.getListingTypes();
        if (response?.success && response?.data?.items) {
          setPropertyTypes(response.data.items);
        }
      } catch (err) {
        console.error("Failed to fetch listing types", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
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

  return (
    <Swiper
      className="overflow-visible"
      spaceBetween={30}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: ".next__active",
        prevEl: ".prev__active",
      }}
      pagination={{
        el: ".pagination__active",
        clickable: true,
      }}
      breakpoints={{
        300: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        576: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 5.5,
          spaceBetween: 25,
        },
        1400: {
          slidesPerView: 6.5,
          spaceBetween: 30,
        },
      }}
    >
      {(propertyTypes.length ? propertyTypes : fallbackPropertyTypes).map((type) => (
        <SwiperSlide key={type.key}>
          <div className="item">
            <Link href={type.href}>
              <div className="iconbox-style1">
                <span className={`icon ${getIcon(type.key)}`} />
                <div className="iconbox-content">
                  <h6 className="title">{type.label}</h6>
                  <p className="text mb-0">{`${type.count} Properties`}</p>
                </div>
              </div>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ApartmentType;
