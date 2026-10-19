"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ListingsService } from "@/services/listings.service";

const formatPrice = (price, currency = "PKR") => {
  if (!price) return "N/A";
  return `${currency} ${price.toLocaleString()}`;
};

const isRemoteImage = (src) => /^https?:\/\//.test(src || "");

const slideStyle = { height: "auto" };
const itemStyle = { height: "100%" };
const cardStyle = { height: "100%", display: "flex", flexDirection: "column" };
const thumbStyle = { height: 248, overflow: "hidden" };
const imageStyle = { width: "100%", height: "100%", objectFit: "cover" };
const contentStyle = { flex: 1, display: "flex", flexDirection: "column" };
const titleStyle = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: 48,
};
const locationStyle = {
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: 24,
};
const metaStyle = { minHeight: 34, flexWrap: "wrap", gap: "6px 0" };
const footerStyle = { marginTop: "auto" };
const fallbackListingImages = [
  "/images/demo/listing-dha-lahore-house.jpg",
  "/images/demo/listing-bahria-rawalpindi-villa.jpg",
  "/images/demo/listing-islamabad-apartment.jpg",
];

const normalizeListingsResponse = (response) => {
  return Array.isArray(response?.data?.items) ? response.data.items : [];
};

const isFeaturedListing = (listing) =>
  listing.featured === true || listing.isFeatured === true;

const FeaturedListings = ({ limit = 6 }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchFeaturedListings = async () => {
      try {
        const response = await ListingsService.getFeaturedListings(limit);
        if (!cancelled && response?.success) {
          setListings(normalizeListingsResponse(response));
        }
      } catch (error) {
        console.error("Failed to fetch featured listings", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedListings();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="text-center py-5">
        <p className="text-muted mb-0">No featured listings are available yet.</p>
      </div>
    );
  }

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
        {listings.map((listing, index) => {
          const fallbackImage = fallbackListingImages[index % fallbackListingImages.length];
          const imageUrl = listing.thumbnailUrl || fallbackImage;

          return (
          <SwiperSlide key={listing.id} style={slideStyle}>
            <div className="item" style={itemStyle}>
              <div className="listing-style1" style={cardStyle}>
                <div className="list-thumb" style={thumbStyle}>
                  {isRemoteImage(imageUrl) ? (
                    <img
                      width={382}
                      height={248}
                      className="w-100 h-100 cover"
                      style={imageStyle}
                      src={imageUrl}
                      alt={listing.thumbnailAltText || listing.title || "listing"}
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                    />
                  ) : (
                    <Image
                      width={382}
                      height={248}
                      className="w-100 h-100 cover"
                      style={imageStyle}
                      src={imageUrl}
                      alt={listing.thumbnailAltText || listing.title || "listing"}
                    />
                  )}
                  <div className="sale-sticker-wrap">
                    {isFeaturedListing(listing) && (
                      <div className="list-tag fz12">
                        <span className="flaticon-electricity me-2" />
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
                <div className="list-content" style={contentStyle}>
                  <h6 className="list-title" style={titleStyle}>
                    <Link href={`/single-v6/${listing.slug || listing.id}`}>
                      {listing.title}
                    </Link>
                  </h6>
                  <p className="list-text" style={locationStyle}>
                    {listing.addressLine
                      ? `${listing.addressLine}, ${listing.city}`
                      : listing.city}
                  </p>
                  <div className="list-meta d-flex align-items-center" style={metaStyle}>
                    {listing.bedrooms != null && (
                      <a href="#">
                        <span className="flaticon-bed" /> {listing.bedrooms} bed
                      </a>
                    )}
                    {listing.bathrooms != null && (
                      <a href="#">
                        <span className="flaticon-shower" /> {listing.bathrooms} bath
                      </a>
                    )}
                    {listing.areaSqft != null && (
                      <a href="#">
                        <span className="flaticon-expand" /> {listing.areaSqft} sqft
                      </a>
                    )}
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center" style={footerStyle}>
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
          );
        })}
      </Swiper>

      <div className="row align-items-center justify-content-center">
        <div className="col-auto">
          <button className="featured-prev__active swiper_button">
            <i className="far fa-arrow-left-long" />
          </button>
        </div>
        {/* End prev */}

        <div className="col-auto">
          <div className="pagination swiper--pagination featured-pagination__active" />
        </div>
        {/* End pagination */}

        <div className="col-auto">
          <button className="featured-next__active swiper_button">
            <i className="far fa-arrow-right-long" />
          </button>
        </div>
        {/* End Next */}
      </div>
      {/* End .col for navigation and pagination */}
    </>
  );
};

export default FeaturedListings;
