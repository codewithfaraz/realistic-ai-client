"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import SearchDataTable from "@/components/property/dashboard/dashboard-saved-search/SearchDataTable";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useEffect, useState } from "react";
import { ListingsService } from "@/services/listings.service";
import PaginationTwo from "@/components/listing/PaginationTwo";

const DashboardSavedSearch = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCapacity] = useState(10); // API limit based on your request
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchSavedListings = async () => {
      setLoading(true);
      try {
        const response = await ListingsService.getSavedListings(
          pageNumber,
          pageCapacity,
        );
        if (response?.success && response?.data) {
          setListings(response.data.items || []);
          setTotalItems(response.data.pagination?.total || 0);
        } else {
          setListings([]);
          setTotalItems(0);
        }
      } catch (err) {
        console.error("Failed to fetch saved listings:", err);
        setListings([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedListings();
  }, [pageNumber, pageCapacity, refreshTrigger]);

  return (
    <ProtectedRoute>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
                {/* End .col-12 */}
              </div>
              {/* End .row */}

              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>Saved Listings</h2>
                    <p className="text">Listings that you have saved!</p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <SearchDataTable
                        listings={listings}
                        loading={loading}
                        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
                      />
                    </div>
                    {totalItems > pageCapacity && (
                      <div className="mt30">
                        <PaginationTwo
                          pageCapacity={pageCapacity}
                          data={Array.from({ length: totalItems })}
                          pageNumber={pageNumber}
                          setPageNumber={setPageNumber}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .dashboard__content */}

            <Footer />
          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* dashboard_content_wrapper */}
    </ProtectedRoute>
  );
};

export default DashboardSavedSearch;
