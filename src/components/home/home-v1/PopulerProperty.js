'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import FeaturedListings from '@/components/listing/grid-view/grid-full-3-col/FeatuerdListings';
import { ListingsService } from '@/services/listings.service';

const fallbackPopularListings = [
  {
    id: "demo-gulberg-apartment",
    slug: "demo-gulberg-apartment",
    title: "Luxury Apartment in Gulberg III",
    city: "Lahore",
    addressLine: "Gulberg III",
    price: 38500000,
    currency: "PKR",
    purpose: "SALE",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1650,
    isFeatured: true,
    thumbnailUrl: "/images/demo/listing-islamabad-apartment.jpg",
  },
  {
    id: "demo-clifton-flat",
    slug: "demo-clifton-flat",
    title: "Sea Facing Flat near Clifton",
    city: "Karachi",
    addressLine: "Clifton Block 2",
    price: 180000,
    currency: "PKR",
    purpose: "RENT",
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1450,
    isFeatured: true,
    thumbnailUrl: "/images/demo/blog-karachi-apartment-entrance.jpg",
  },
  {
    id: "demo-dha-plot",
    slug: "demo-dha-plot",
    title: "5 Marla Possession Plot",
    city: "Lahore",
    addressLine: "DHA Phase 9 Prism",
    price: 21000000,
    currency: "PKR",
    purpose: "SALE",
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 1125,
    isFeatured: false,
    thumbnailUrl: "/images/demo/blog-dha-lahore-street.jpg",
  },
  {
    id: "demo-f11-house",
    slug: "demo-f11-house",
    title: "Family House Near F-11 Markaz",
    city: "Islamabad",
    addressLine: "F-11",
    price: 320000,
    currency: "PKR",
    purpose: "RENT",
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 3200,
    isFeatured: true,
    thumbnailUrl: "/images/demo/listing-bahria-rawalpindi-villa.jpg",
  },
];

export default function PopulerProperty({ section }) {
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit = section?.limit || 5;

  const fetchPopular = async () => {
    try {
      setLoading(true);
      const res = await ListingsService.getPopularListings(limit);
      if (res?.success && res?.data?.items) {
        // Display only 4 properties matching requirements
        setPageData(res.data.items.slice(0, 4));
      }
    } catch (err) {
      console.error("Failed to fetch popular properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopular();
  }, [limit]);

  return (
    <section className="bgc-dark">
      <div className="container">
        <div className="row" data-aos="fade-up">
          <div className="col-lg-12">
            <div className="main-title2">
              <h2 className="title text-white">
                {section?.title || "Discover Popular Properties"}
              </h2>
              <p className="paragraph text-white">
                {section?.subtitle || "Explore properties buyers are viewing now."}
              </p>
            </div>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}

        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-lg-12">
            <div className="row">
              {loading ? (
                <div className="col-12 text-center py-5">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-white">Fetching popular listings...</p>
                </div>
              ) : (
                <FeaturedListings 
                  data={pageData.length ? pageData : fallbackPopularListings}
                  colClass="col-sm-6 col-lg-3" 
                  onRefresh={fetchPopular} 
                />
              )}
            </div>
            
            <div className="d-grid d-md-block text-center mt30 mt0-md">
              <Link href="/listings" className="ud-btn btn-thm">
                {section?.ctaLabel || "See All Properties"}
                <i className="fal fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
    </section>
  );
}
