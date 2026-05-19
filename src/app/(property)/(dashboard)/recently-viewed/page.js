"use client";
import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import RecentDataTable from "@/components/property/dashboard/dashboard-my-favourites/RecentDataTable";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useEffect, useState } from "react";
import { ListingsService } from "@/services/listings.service";
import PaginationTwo from "@/components/listing/PaginationTwo";

const DashboardMyFavourites = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCapacity] = useState(10);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      setLoading(true);
      try {
        const response = await ListingsService.getRecentlyViewedListings(pageNumber, pageCapacity);
        if (response?.success && response?.data) {
          setListings(response.data.items || []);
          setTotalItems(response.data.pagination?.total || 0);
        } else {
          setListings([]);
          setTotalItems(0);
        }
      } catch (err) {
        console.error("Failed to fetch recently viewed listings:", err);
        setListings([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentlyViewed();
  }, [pageNumber, pageCapacity]);

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
                    <h2>Recently Viewed</h2>
                    <p className="text">Properties you have recently looked at!</p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <RecentDataTable listings={listings} loading={loading} />
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

export default DashboardMyFavourites;
