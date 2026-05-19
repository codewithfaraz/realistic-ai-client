"use client";

import React, { useState, useEffect } from "react";
import { ListingsService } from "@/services/listings.service";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const formatPrice = (price, currency = "PKR") => {
  if (!price) return "N/A";
  return `${currency} ${price.toLocaleString()}`;
};

const PropertyHeader = ({ listing, location, isSaved }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!listing) return null;

  const addressText = location
    ? [location.addressLine, location.city, location.country]
        .filter(Boolean)
        .join(", ")
    : "";

  const handleSaveListing = async (e) => {
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

    if (isSaving) return;
    setIsSaving(true);

    try {
      if (isSaved) {
        const res = await ListingsService.unsaveListing(listing.id);
        if (res?.success) {
          toast.success(res.message || "Listing unsaved!");
          window.location.reload();
        } else {
          toast.error(res?.message || "Failed to unsave listing.");
        }
      } else {
        const res = await ListingsService.saveListing(listing.id);
        if (res?.success) {
          toast.success(res.message || "Listing saved!");
          window.location.reload();
        } else {
          toast.error("Failed to save listing.");
        }
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Action failed.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("URL copied to clipboard!");
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{listing.title}</h2>
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">{addressText}</p>
            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 ml0-sm ml10 bdrrn-sm"
              href="#"
            >
              <i className="fas fa-circle fz10 pe-2" />
              For {listing.purpose === "RENT" ? "Rent" : "Sale"}
            </a>
            {listing.propertyType && (
              <a
                className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
                href="#"
              >
                <i className="flaticon-home-1 pe-2" />
                {listing.propertyType}
              </a>
            )}
            {listing.statusPublic && (
              <a className="ff-heading ml10 ml0-sm fz15" href="#">
                <i className="fas fa-check-circle pe-2" />
                {listing.statusPublic}
              </a>
            )}
          </div>
          <div className="property-meta d-flex align-items-center">
            {listing.bedrooms != null && (
              <a className="text fz15" href="#">
                <i className="flaticon-bed pe-2 align-text-top" />
                {listing.bedrooms} bed
              </a>
            )}
            {listing.bathrooms != null && (
              <a className="text ml20 fz15" href="#">
                <i className="flaticon-shower pe-2 align-text-top" />
                {listing.bathrooms} bath
              </a>
            )}
            {listing.areaSqft != null && (
              <a className="text ml20 fz15" href="#">
                <i className="flaticon-expand pe-2 align-text-top" />
                {listing.areaSqft} sqft
              </a>
            )}
          </div>
        </div>
      </div>
      {/* End .col-lg--8 */}

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
              <a
                className="icon mr10"
                href="#"
                onClick={handleSaveListing}
                title={isSaved ? "UnSave property" : "Save property"}
                style={{
                  opacity: isSaving ? 0.5 : 1,
                  color: isSaved ? "#eb6753" : undefined,
                }}
              >
                {isSaving ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : (
                  <span
                    className={
                      isSaved ? "fas fa-bookmark" : "far fa-bookmark"
                    }
                  />
                )}
              </a>
              <a
                className="icon mr10"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#shareModal"
                onClick={(e) => e.preventDefault()}
                title="Share property"
              >
                <span className="flaticon-share-1" />
              </a>
            </div>
            <h3 className="price mb-0">
              {formatPrice(listing.price, listing.currency)}
            </h3>
            {listing.areaSqft && listing.price && (
              <p className="text space fz15">
                {formatPrice(
                  Math.round(listing.price / listing.areaSqft),
                  listing.currency,
                )}
                /sq ft
              </p>
            )}
          </div>
        </div>
      </div>
      {/* End .col-lg--4 */}

      {/* Share Modal */}
      <div
        className="modal fade"
        id="shareModal"
        tabIndex={-1}
        aria-labelledby="shareModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shareModalLabel">
                Share Property
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-2">Copy the link below to share this property:</p>
              <div className="d-flex align-items-center">
                <input
                  type="text"
                  className="form-control me-2"
                  value={currentUrl}
                  readOnly
                />
                <button className="ud-btn btn-thm" onClick={handleCopyUrl}>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyHeader;
