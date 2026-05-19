"use client";

import { useEffect, useState } from "react";
import { ListingsService } from "@/services/listings.service";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import OverView from "@/components/property/property-single-style/common/OverView";
import PropertyAddress from "@/components/property/property-single-style/common/PropertyAddress";
import PropertyDetails from "@/components/property/property-single-style/common/PropertyDetails";
import PropertyHeader from "@/components/property/property-single-style/common/PropertyHeader";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyGallery from "@/components/property/property-single-style/single-v6/PropertyGallery";
import ContactWithAgent from "@/components/property/property-single-style/sidebar/ContactWithAgent";
import ScheduleTour from "@/components/property/property-single-style/sidebar/ScheduleTour";
import NearbySimilarProperty from "@/components/property/property-single-style/common/NearbySimilarProperty";
import React from "react";
import { useParams } from "next/navigation";

const SingleV6 = () => {
  const params = useParams();
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await ListingsService.getListing(params.id);
        if (response?.success && response?.data) {
          setListingData(response.data);
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <DefaultHeader />
        <MobileMenu />
        <section className="pt60 pb90 bgc-f7">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text">Loading property details...</p>
            </div>
          </div>
        </section>
        <section className="footer-style1 pt60 pb-0">
          <Footer />
        </section>
      </>
    );
  }

  if (error || !listingData) {
    return (
      <>
        <DefaultHeader />
        <MobileMenu />
        <section className="pt60 pb90 bgc-f7">
          <div className="container">
            <div className="text-center py-5">
              <h3>{error || "Listing not found"}</h3>
            </div>
          </div>
        </section>
        <section className="footer-style1 pt60 pb-0">
          <Footer />
        </section>
      </>
    );
  }

  const {
    listing,
    media,
    coverImageUrl,
    location,
    contactCard,
    relatedListings,
    breadcrumbs,
    isSaved,
  } = listingData;

  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav */}
      <MobileMenu />
      {/* End Mobile Nav */}

      {/* Property All Single */}
      <section className="pt60 pb90 bgc-f7">
        <div className="container">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="row mb20">
              <div className="col-lg-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                      <li
                        key={index}
                        className={`breadcrumb-item ${
                          index === breadcrumbs.length - 1 ? "active" : ""
                        }`}
                      >
                        {index === breadcrumbs.length - 1 ? (
                          crumb.label
                        ) : (
                          <a href={crumb.href}>{crumb.label}</a>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          )}

          <div className="row">
            <PropertyHeader listing={listing} location={location} isSaved={isSaved} />
          </div>
          {/* End .row */}

          <div className="row wrap">
            <div className="col-lg-8">
              <PropertyGallery media={media} coverImageUrl={coverImageUrl} />

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Overview</h4>
                <div className="row">
                  <OverView listing={listing} />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Property Description</h4>
                <ProperytyDescriptions description={listing.description} />
                {/* End property description */}

                <h4 className="title fz17 mb30 mt50">Property Details</h4>
                <div className="row">
                  <PropertyDetails listing={listing} />
                </div>
              </div>
              {/* End .ps-widget */}

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  <h4 className="title fz17 mb30">Amenities</h4>
                  <div className="row">
                    <PropertyFeaturesAminites amenities={listing.amenities} />
                  </div>
                </div>
              )}
              {/* End Amenities */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30 mt30">Address</h4>
                <div className="row">
                  <PropertyAddress location={location} />
                </div>
              </div>
              {/* End .ps-widget */}
            </div>
            {/* End .col-8 */}

            <div className="col-lg-4">
              <div className="column">
                <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white position-relative">
                  <h4 className="form-title mb5">Schedule a tour</h4>
                  <p className="text">Choose your preferred day</p>
                  <ScheduleTour />
                </div>
                {/* End Schedule a tour */}

                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <h6 className="title fz17 mb30">
                      {contactCard?.title || "Get More Information"}
                    </h6>
                    <ContactWithAgent contactCard={contactCard} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}

          {/* Related Listings */}
          {relatedListings && relatedListings.length > 0 && (
            <>
              <div className="row mt30 align-items-center justify-content-between">
                <div className="col-auto">
                  <div className="main-title">
                    <h2 className="title">Similar Properties</h2>
                    <p className="paragraph">
                      Explore more properties you might like
                    </p>
                  </div>
                </div>
                {/* End header */}

                <div className="col-auto mb30">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-auto">
                      <button className="featured-prev__active swiper_button">
                        <i className="far fa-arrow-left-long" />
                      </button>
                    </div>
                    <div className="col-auto">
                      <div className="pagination swiper--pagination featured-pagination__active" />
                    </div>
                    <div className="col-auto">
                      <button className="featured-next__active swiper_button">
                        <i className="far fa-arrow-right-long" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-lg-12">
                  <div className="property-city-slider">
                    <NearbySimilarProperty relatedListings={relatedListings} />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Property All Single */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default SingleV6;
