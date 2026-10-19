"use client";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";

const demoListings = [
  {
    id: "demo-gulberg-apartment",
    image: "/images/demo/listing-islamabad-apartment.jpg",
    title: "Luxury Apartment in Gulberg III",
    location: "Gulberg III, Lahore",
    bed: 3,
    bath: 3,
    sqft: 1650,
    price: "PKR 38,500,000",
    featured: true,
    forRent: false,
  },
  {
    id: "demo-clifton-flat",
    image: "/images/demo/blog-karachi-apartment-entrance.jpg",
    title: "Sea Facing Flat near Clifton",
    location: "Clifton Block 2, Karachi",
    bed: 3,
    bath: 3,
    sqft: 1450,
    price: "PKR 180,000",
    featured: true,
    forRent: true,
  },
  {
    id: "demo-dha-plot",
    image: "/images/demo/blog-dha-lahore-street.jpg",
    title: "5 Marla Possession Plot",
    location: "DHA Phase 9 Prism, Lahore",
    bed: 0,
    bath: 0,
    sqft: 1125,
    price: "PKR 21,000,000",
    featured: false,
    forRent: false,
  },
  {
    id: "demo-f11-house",
    image: "/images/demo/listing-bahria-rawalpindi-villa.jpg",
    title: "Family House Near F-11 Markaz",
    location: "F-11, Islamabad",
    bed: 4,
    bath: 5,
    sqft: 3200,
    price: "PKR 320,000",
    featured: true,
    forRent: true,
  },
];

const PopularListings = ({ data = demoListings }) => {
  const listingData = data?.length ? data : demoListings;

  return (
    <>
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {listingData.slice(0, 8).map((listing) => (
          <SwiperSlide key={listing.id}>
            <div className="item">
              <div className="listing-style1">
                <div className="list-thumb">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 cover"
                    src={listing.image}
                    alt="listings"
                  />
                  <div className="sale-sticker-wrap">
                    {listing.featured && (
                      <div className="list-tag fz12">
                        <span className="flaticon-electricity me-2" />
                        FEATURED
                      </div>
                    )}
                  </div>

                  <div className="list-price">
                    {listing.price} / <span>mo</span>
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="list-title">
                    <Link href={`/single-v6/${listing.slug || listing.id}`}>
                      {listing.title}
                    </Link>
                  </h6>
                  <p className="list-text">{listing.location}</p>
                  <div className="list-meta d-flex align-items-center">
                    <a href="#">
                      <span className="flaticon-bed" /> {listing.bed} bed
                    </a>
                    <a href="#">
                      <span className="flaticon-shower" /> {listing.bath} bath
                    </a>
                    <a href="#">
                      <span className="flaticon-expand" /> {listing.sqft} sqft
                    </a>
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">
                      {listing.forRent ? "For Rent" : "For Sale"}
                    </span>
                    <div className="icons d-flex align-items-center">
                      <a href="#">
                        <span className="flaticon-fullscreen" />
                      </a>
                      <a href="#">
                        <span className="flaticon-new-tab" />
                      </a>
                      <a href="#">
                        <span className="flaticon-like" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default PopularListings;
