"use client";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const formatPrice = (price, currency = "PKR") => {
  if (!price) return "N/A";
  return `${currency} ${price.toLocaleString()}`;
};

const NearbySimilarProperty = ({ relatedListings }) => {
  const listings = relatedListings || [];

  if (listings.length === 0) return null;

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".featured-next__active",
          prevEl: ".featured-prev__active",
        }}
        pagination={{
          el: ".featured-pagination__active",
          clickable: true,
        }}
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
            slidesPerView: 3,
          },
        }}
      >
        {listings.map((listing) => (
          <SwiperSlide key={listing.id}>
            <div className="item">
              <div className="listing-style1">
                <div className="list-thumb">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 cover"
                    src={
                      listing.coverImageUrl ||
                      "/images/listings/g1-1.jpg"
                    }
                    alt={listing.coverImageAltText || listing.title || "listing"}
                  />
                  <div className="sale-sticker-wrap">
                    {listing.isFeatured && (
                      <div className="list-tag rounded-0 fz12">
                        <span className="flaticon-electricity" />
                        FEATURED
                      </div>
                    )}
                  </div>
                  <div className="list-price">
                    {formatPrice(listing.price, listing.currency)}
                    {listing.purpose === "RENT" && (
                      <>
                        {" "}
                        / <span>mo</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="list-title">
                    <Link href={`/single-v6/${listing.slug || listing.id}`}>
                      {listing.title}
                    </Link>
                  </h6>
                  <p className="list-text">{listing.city}</p>
                  <div className="list-meta d-flex align-items-center">
                    {listing.bedrooms != null && (
                      <a href="#">
                        <span className="flaticon-bed" /> {listing.bedrooms} bed
                      </a>
                    )}
                    {listing.bathrooms != null && (
                      <a href="#">
                        <span className="flaticon-shower" />{" "}
                        {listing.bathrooms} bath
                      </a>
                    )}
                    {listing.areaSqft != null && (
                      <a href="#">
                        <span className="flaticon-expand" />{" "}
                        {listing.areaSqft} sqft
                      </a>
                    )}
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">
                      For {listing.purpose === "RENT" ? "Rent" : "Sale"}
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

export default NearbySimilarProperty;
