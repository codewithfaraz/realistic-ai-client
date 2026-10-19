"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ListingsService } from "@/services/listings.service";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const formatPrice = (price, currency = "PKR") => {
  if (!price) return "N/A";
  return `${currency} ${price.toLocaleString()}`;
};

const isRemoteImage = (src) => /^https?:\/\//.test(src || "");
const fallbackListingImages = [
  "/images/demo/listing-dha-lahore-house.jpg",
  "/images/demo/listing-bahria-rawalpindi-villa.jpg",
  "/images/demo/listing-islamabad-apartment.jpg",
];

const getListingImage = (listing, fallbackImage) =>
  listing.thumbnailUrl ||
  listing.featuredImageUrl ||
  listing.coverImageUrl ||
  listing.imageUrl ||
  listing.image ||
  listing.photoUrl ||
  listing.images?.[0]?.url ||
  listing.images?.[0]?.imageUrl ||
  listing.media?.[0]?.url ||
  fallbackImage;

const getListingLocation = (listing) => {
  const city = listing.city?.name || listing.city;
  const area = listing.areaName || listing.neighborhood || listing.locality;
  const address = listing.addressLine || listing.address || listing.location;

  return [address, area, city].filter(Boolean).join(", ") || "Location available";
};

const getListingArea = (listing) =>
  listing.areaSqft || listing.area || listing.sizeSqft || listing.coveredArea;

const FeaturedListings = ({ data, colstyle, onRefresh, colClass }) => {
  const [savingIds, setSavingIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const { isAuthenticated } = useAuth();

  const handleSaveListing = async (e, listing) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        import("bootstrap").then((bootstrap) => {
          const modalNode = document.getElementById("loginSignupModal");
          if (modalNode) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalNode);
            modal.show();
          }
        });
      }
      return;
    }

    const isCurrentlySaved = listing.isSaved || savedIds.has(listing.id);

    if (savingIds.has(listing.id)) return; // prevent duplicate clicks

    setSavingIds((prev) => new Set(prev).add(listing.id));

    try {
      if (isCurrentlySaved) {
        const res = await ListingsService.unsaveListing(listing.id);
        if (res?.success) {
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(listing.id);
            return next;
          });
          toast.success(res.message || "Listing unsaved!");
          if (onRefresh) onRefresh();
        } else {
          toast.error(res?.message || "Failed to unsave listing.");
        }
      } else {
        const res = await ListingsService.saveListing(listing.id);
        if (res?.success) {
          setSavedIds((prev) => new Set(prev).add(listing.id));
          toast.success(res.message || "Listing saved!");
          if (onRefresh) onRefresh();
        } else {
          toast.error("Failed to save listing.");
        }
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Action failed.";
      toast.error(message);
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(listing.id);
        return next;
      });
    }
  };

  return (
    <>
      {data.map((listing, index) => {
        const fallbackImage = fallbackListingImages[index % fallbackListingImages.length];
        const imageUrl = getListingImage(listing, fallbackImage);
        const title = listing.title || listing.name || "Property listing";
        const listingArea = getListingArea(listing);

        return (
          <div
            className={` ${
              colClass ? colClass : colstyle ? "col-sm-12 col-lg-6" : "col-sm-6 col-lg-4"
            }  `}
            key={listing.id}
          >
            <div
              className={
                colstyle
                  ? "listing-style1 listCustom listing-type"
                  : "listing-style1"
              }
            >
              <div className="list-thumb">
                {isRemoteImage(imageUrl) ? (
                <img
                  width={382}
                  height={248}
                  className="w-100 cover"
                  style={{ height: "230px", objectFit: "cover" }}
                  src={imageUrl}
                  alt={listing.thumbnailAltText || title || "listing"}
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              ) : (
                <Image
                  width={382}
                  height={248}
                  className="w-100 cover"
                  style={{ height: "230px", objectFit: "cover" }}
                  src={imageUrl}
                  alt={listing.thumbnailAltText || title || "listing"}
                />
              )}
              <div className="sale-sticker-wrap">
                {listing.isFeatured && (
                  <div className="list-tag fz12">
                    <span className="flaticon-electricity me-2" />
                    FEATURED
                  </div>
                )}
                {listing.isPremium && (
                  <div className="list-tag2 fz12">PREMIUM</div>
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
                  {title}
                </Link>
              </h6>
              <p className="list-text">{getListingLocation(listing)}</p>
              <div className="list-meta d-flex align-items-center">
                {listing.bedrooms != null && (
                  <a href="#">
                    <span className="flaticon-bed" /> {listing.bedrooms} bed
                  </a>
                )}
                {listing.bathrooms != null && (
                  <a href="#">
                    <span className="flaticon-shower" /> {listing.bathrooms}{" "}
                    bath
                  </a>
                )}
                {listingArea != null && (
                  <a href="#">
                    <span className="flaticon-expand" /> {listingArea} sqft
                  </a>
                )}
              </div>
              <hr className="mt-2 mb-2" />
              <div className="list-meta2 d-flex justify-content-between align-items-center">
                <span className="for-what">
                  For {listing.purpose === "RENT" ? "Rent" : "Sale"}
                </span>
                <div className="icons d-flex align-items-center">
                  {/* <a href="#">
                    <span className="flaticon-fullscreen" />
                  </a> */}
                  <a
                    href="#"
                    onClick={(e) => handleSaveListing(e, listing)}
                    title={
                      listing.isSaved || savedIds.has(listing.id)
                        ? "Unsave listing"
                        : "Save listing"
                    }
                    style={{
                      opacity: savingIds.has(listing.id) ? 0.5 : 1,
                      color:
                        listing.isSaved || savedIds.has(listing.id)
                          ? "#eb6753"
                          : undefined,
                    }}
                  >
                    {savingIds.has(listing.id) ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                    ) : (
                      <span
                        className={
                          listing.isSaved || savedIds.has(listing.id)
                            ? "fas fa-bookmark"
                            : "far fa-bookmark"
                        }
                      />
                    )}
                  </a>
                  {/* <a href="#">
                    <span className="flaticon-like" />
                  </a> */}
                </div>
              </div>
            </div>
          </div>
          </div>
        );
      })}
    </>
  );
};

export default FeaturedListings;
