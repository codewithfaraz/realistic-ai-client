'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import FeaturedListings from '@/components/listing/grid-view/grid-full-3-col/FeatuerdListings';
import { ListingsService } from '@/services/listings.service';

export default function PopulerProperty() {
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPopular = async () => {
    try {
      setLoading(true);
      const res = await ListingsService.getPopularListings(5);
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
  }, []);

  return (
    <section className="bgc-dark">
      <div className="container">
        <div className="row" data-aos="fade-up">
          <div className="col-lg-12">
            <div className="main-title2">
              <h2 className="title text-white">
                Discover Popular Properties
              </h2>
              <p className="paragraph text-white">
                Aliquam lacinia diam quis lacus euismod
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
              ) : pageData.length > 0 ? (
                <FeaturedListings 
                  data={pageData} 
                  colClass="col-sm-6 col-lg-3" 
                  onRefresh={fetchPopular} 
                />
              ) : (
                <div className="col-12 text-center">
                  <p className="text-white">No popular properties found.</p>
                </div>
              )}
            </div>
            
            <div className="d-grid d-md-block text-center mt30 mt0-md">
              <Link href="/listings" className="ud-btn btn-thm">
                See All Properties<i className="fal fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
    </section>
  );
}
