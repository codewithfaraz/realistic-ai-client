"use client";
import { ListingsService } from "@/services/listings.service";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ListingSidebar from "../../sidebar";
import AdvanceFilterModal from "@/components/common/advance-filter-two";
import TopFilterBar from "./TopFilterBar";
import FeaturedListings from "./FeatuerdListings";
import PaginationTwo from "../../PaginationTwo";

const ITEMS_PER_PAGE = 12;
const DEFAULT_FILTERS = {
  listingStatus: "All",
  propertyTypes: [],
  priceRange: [0, 100000000],
  bedrooms: 0,
  bathroms: 0,
  location: "All Cities",
  squirefeet: [],
  yearBuild: [],
  categories: [],
  searchTerm: "",
};

const getListingsPayload = (response) => response?.data || response || {};

const getListingItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.listings)) return payload.listings;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data?.items)) return payload.data.items;
  if (Array.isArray(payload.data?.listings)) return payload.data.listings;
  if (Array.isArray(payload.data?.results)) return payload.data.results;
  if (Array.isArray(payload.data)) return payload.data;

  return [];
};

const getListingTotal = (payload, items) =>
  payload.total ??
  payload.totalItems ??
  payload.count ??
  payload.pagination?.total ??
  payload.meta?.total ??
  payload.data?.total ??
  payload.data?.totalItems ??
  payload.data?.count ??
  items.length;

const getListingTotalPages = (payload, totalItems) =>
  payload.totalPages ??
  payload.pagination?.totalPages ??
  payload.meta?.totalPages ??
  payload.data?.totalPages ??
  Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

export default function ProperteyFiltering() {
  // API response data
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Pagination & display
  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(false);

  // Sort
  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");

  // Filters
  const [listingStatus, setListingStatus] = useState("All");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Cities");
  const [squirefeet, setSquirefeet] = useState([]);
  const [yearBuild, setyearBuild] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

  // Hydration guard — prevent fetching with default filters before URL params are read
  // Must be STATE (not ref) so it batches with setPropertyTypes/setLocation in the same re-render
  const [hydrated, setHydrated] = useState(false);

  const applyActiveFilters = useCallback((filters) => {
    setListingStatus(filters.listingStatus);
    setPropertyTypes(filters.propertyTypes);
    setPriceRange(filters.priceRange);
    setBedrooms(filters.bedrooms);
    setBathroms(filters.bathroms);
    setLocation(filters.location);
    setSquirefeet(filters.squirefeet);
    setyearBuild(filters.yearBuild);
    setCategories(filters.categories);
    setSearchTerm(filters.searchTerm);
  }, []);

  // Hydrate Initial URL Filters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const search = p.get("q") || p.get("search");
      const nextFilters = { ...DEFAULT_FILTERS };

      if (search) {
        nextFilters.searchTerm = search;
      }

      const purpose = p.get("purpose");
      if (purpose === "SALE") {
        nextFilters.listingStatus = "Buy";
      } else if (purpose === "RENT") {
        nextFilters.listingStatus = "Rent";
      }

      const category = p.get("propertyType");
      if (category) {
        const capitalized =
          category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        nextFilters.propertyTypes = [capitalized];
      }

      const cityParams = p.get("city");
      if (cityParams) {
        const capitalizedCity =
          cityParams.charAt(0).toUpperCase() + cityParams.slice(1).toLowerCase();
        nextFilters.location = capitalizedCity;
      }

      applyActiveFilters(nextFilters);
      setDraftFilters(nextFilters);
    }
    // Mark hydration complete — batched with filter state updates above
    setHydrated(true);
  }, [applyActiveFilters]);

  // Debounce timer ref
  const debounceRef = useRef(null);

  // Map UI sort option to API sort param
  const getSortParam = (option) => {
    switch (option.trim()) {
      case "Price Low":
        return "price_asc";
      case "Price High":
        return "price_desc";
      case "Newest":
        return "newest";
      case "Oldest":
        return "oldest";
      default:
        return "";
    }
  };

  // Map UI listing status to API purpose param
  const getPurposeParam = (status) => {
    switch (status) {
      case "Buy":
        return "SALE";
      case "Rent":
        return "RENT";
      default:
        return ""; // "All" — don't send purpose
    }
  };

  // Build filters object for API
  const buildFilters = useCallback(() => {
    const filters = {};

    if (searchTerm) filters.search = searchTerm;

    const purpose = getPurposeParam(listingStatus);
    if (purpose) filters.purpose = purpose;

    // Send first selected property type (API takes single value)
    if (propertyTypes.length > 0) {
      filters.propertyType = propertyTypes[0];
    }

    if (location && location !== "All Cities") {
      filters.city = location;
    }

    if (bedrooms > 0) filters.bedrooms = bedrooms;
    if (bathroms > 0) filters.bathrooms = bathroms;

    if (priceRange[0] > 0) filters.minPrice = priceRange[0];
    if (priceRange[1] < 100000000) filters.maxPrice = priceRange[1];

    if (squirefeet.length > 0 && squirefeet[0])
      filters.minArea = squirefeet[0];
    if (squirefeet.length > 1 && squirefeet[1])
      filters.maxArea = squirefeet[1];

    // Amenities filter — categories state holds selected amenity values
    if (categories.length > 0) {
      filters.amenities = categories.join(",");
    }

    const sort = getSortParam(currentSortingOption);
    if (sort) filters.sort = sort;

    return filters;
  }, [
    searchTerm,
    listingStatus,
    propertyTypes,
    location,
    bedrooms,
    bathroms,
    priceRange,
    squirefeet,
    currentSortingOption,
    categories,
  ]);

  // Fetch listings from API
  const fetchListings = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);
        const filters = buildFilters();
        const response = await ListingsService.getListings(
          page,
          ITEMS_PER_PAGE,
          filters,
        );
        if (response?.success !== false) {
          const payload = getListingsPayload(response);
          let items = getListingItems(payload);

          // Client-side amenities filtering (backend doesn't support it)
          if (categories.length > 0) {
            items = items.filter((listing) => {
              const listingAmenities = listing.amenities || [];
              return categories.every((amenity) =>
                listingAmenities.includes(amenity),
              );
            });
          }

          const nextTotalItems =
            categories.length > 0 ? items.length : getListingTotal(payload, items);

          setListings(items);
          setTotalItems(nextTotalItems);
          setTotalPages(
            categories.length > 0
              ? Math.ceil(items.length / ITEMS_PER_PAGE) || 1
              : getListingTotalPages(payload, nextTotalItems),
          );
        } else {
          setListings([]);
          setTotalItems(0);
          setError("No listings found.");
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError("Failed to load listings. Please try again.");
        setListings([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [buildFilters, categories],
  );

  // Fetch when filters or sort change (debounced)
  // Only runs after URL hydration is complete to avoid a wasted fetch with defaults
  useEffect(() => {
    if (!hydrated) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageNumber(1);
      fetchListings(1);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    hydrated,
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    currentSortingOption,
    searchTerm,
    categories,
  ]);

  // Fetch when page changes (immediate, no debounce)
  // Also only runs after hydration
  useEffect(() => {
    if (!hydrated) return;
    fetchListings(pageNumber);
  }, [pageNumber, hydrated]);

  // Page content tracker for TopFilterBar
  const pageContentTrac = [
    (pageNumber - 1) * ITEMS_PER_PAGE + 1,
    Math.min(pageNumber * ITEMS_PER_PAGE, totalItems),
    totalItems,
  ];

  // Filter handler functions
  const closeFilterOverlayFromEvent = (event) => {
    const dropdownMenu = event?.currentTarget?.closest?.(".dropdown-menu");
    const dropdownToggle = dropdownMenu?.previousElementSibling;
    const bootstrapDropdown =
      typeof window !== "undefined" ? window.bootstrap?.Dropdown : null;

    if (dropdownToggle && bootstrapDropdown) {
      bootstrapDropdown.getOrCreateInstance(dropdownToggle).hide();
    } else if (dropdownMenu && dropdownToggle) {
      dropdownToggle.classList.remove("show");
      dropdownToggle.setAttribute("aria-expanded", "false");
      dropdownMenu.classList.remove("show");
      dropdownMenu.removeAttribute("data-bs-popper");
    }

    const offcanvas = event?.currentTarget?.closest?.(".offcanvas");
    const bootstrapOffcanvas =
      typeof window !== "undefined" ? window.bootstrap?.Offcanvas : null;

    if (offcanvas && bootstrapOffcanvas) {
      bootstrapOffcanvas.getOrCreateInstance(offcanvas).hide();
    }
  };

  const applyFilterValues = (values = {}, event) => {
    const nextFilters = {
      ...draftFilters,
      ...values,
      propertyTypes: values.propertyTypes
        ? [...values.propertyTypes]
        : [...draftFilters.propertyTypes],
      priceRange: values.priceRange
        ? [...values.priceRange]
        : [...draftFilters.priceRange],
      squirefeet: values.squirefeet
        ? [...values.squirefeet]
        : [...draftFilters.squirefeet],
      yearBuild: values.yearBuild ? [...values.yearBuild] : [...draftFilters.yearBuild],
      categories: values.categories
        ? [...values.categories]
        : [...draftFilters.categories],
    };

    setDraftFilters(nextFilters);
    applyActiveFilters(nextFilters);
    closeFilterOverlayFromEvent(event);
  };

  const applyDraftFilters = (event) => {
    applyFilterValues({}, event);
  };

  const resetFilter = () => {
    setDraftFilters(DEFAULT_FILTERS);
    applyActiveFilters(DEFAULT_FILTERS);
    setCurrentSortingOption("Newest");
    document.querySelectorAll(".filterInput").forEach(function (element) {
      element.value = null;
    });
    document.querySelectorAll(".filterSelect").forEach(function (element) {
      element.value = "All Cities";
    });
  };

  const handlelistingStatus = (elm) => {
    setDraftFilters((pre) => ({
      ...pre,
      listingStatus: pre.listingStatus == elm ? "All" : elm,
    }));
  };

  const handlepropertyTypes = (elm) => {
    if (elm == "All") {
      setDraftFilters((pre) => ({ ...pre, propertyTypes: [] }));
    } else {
      setDraftFilters((pre) => ({
        ...pre,
        propertyTypes: pre.propertyTypes.includes(elm)
          ? pre.propertyTypes.filter((el) => el != elm)
          : [...pre.propertyTypes, elm],
      }));
    }
  };
  const handlepriceRange = (elm) => {
    setDraftFilters((pre) => ({ ...pre, priceRange: elm }));
  };
  const handlebedrooms = (elm) => {
    setDraftFilters((pre) => ({ ...pre, bedrooms: elm }));
  };
  const handlebathroms = (elm) => {
    setDraftFilters((pre) => ({ ...pre, bathroms: elm }));
  };
  const handlelocation = (elm) => {
    setDraftFilters((pre) => ({ ...pre, location: elm }));
  };
  const handlesquirefeet = (elm) => {
    setDraftFilters((pre) => ({ ...pre, squirefeet: elm }));
  };
  const handleyearBuild = (elm) => {
    setDraftFilters((pre) => ({ ...pre, yearBuild: elm }));
  };
  const handlecategories = (elm) => {
    if (elm == "All") {
      setDraftFilters((pre) => ({ ...pre, categories: [] }));
    } else {
      setDraftFilters((pre) => ({
        ...pre,
        categories: pre.categories.includes(elm)
          ? pre.categories.filter((el) => el != elm)
          : [...pre.categories, elm],
      }));
    }
  };
  const handlesearch = (elm) => {
    setDraftFilters((pre) => ({ ...pre, searchTerm: elm }));
  };

  const filterFunctions = {
    handlelistingStatus,
    handlepropertyTypes,
    handlepriceRange,
    handlebedrooms,
    handlebathroms,
    handlelocation,
    handlesquirefeet,
    handleyearBuild,
    handlecategories,
    handlesearch,
    applyFilters: applyDraftFilters,
    applyFilterValues,
    priceRange: draftFilters.priceRange,
    listingStatus: draftFilters.listingStatus,
    propertyTypes: draftFilters.propertyTypes,
    resetFilter,
    bedrooms: draftFilters.bedrooms,
    bathroms: draftFilters.bathroms,
    location: draftFilters.location,
    squirefeet: draftFilters.squirefeet,
    yearBuild: draftFilters.yearBuild,
    categories: draftFilters.categories,
    searchTerm: draftFilters.searchTerm,
    setPropertyTypes: (nextPropertyTypes) =>
      setDraftFilters((pre) => ({ ...pre, propertyTypes: nextPropertyTypes })),
    setCategories: (nextCategories) =>
      setDraftFilters((pre) => ({ ...pre, categories: nextCategories })),
  };

  return (
    <section className="pt0 pb90 bgc-f7">
      <div className="container">
        {/* start mobile filter sidebar */}
        <div
          className="offcanvas offcanvas-start p-0"
          tabIndex="-1"
          id="listingSidebarFilter"
          aria-labelledby="listingSidebarFilterLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="listingSidebarFilterLabel">
              Listing Filter
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body p-0">
            <ListingSidebar filterFunctions={filterFunctions} />
          </div>
        </div>
        {/* End mobile filter sidebar */}

        {/* <!-- Advance Feature Modal Start --> */}
        <div className="advance-feature-modal">
          <div
            className="modal fade"
            id="advanceSeachModal"
            tabIndex={-1}
            aria-labelledby="advanceSeachModalLabel"
            aria-hidden="true"
          >
            <AdvanceFilterModal filterFunctions={filterFunctions} />
          </div>
        </div>
        {/* <!-- Advance Feature Modal End --> */}

        <div className="row">
          <TopFilterBar
            pageContentTrac={pageContentTrac}
            colstyle={colstyle}
            setColstyle={setColstyle}
            filterFunctions={filterFunctions}
            setCurrentSortingOption={setCurrentSortingOption}
          />
        </div>
        {/* End TopFilterBar */}

        <div className="row">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text">Loading listings...</p>
            </div>
          ) : error && listings.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i
                  className="flaticon-home-1"
                  style={{ fontSize: "48px", color: "#ccc" }}
                />
              </div>
              <h4 className="text">{error}</h4>
              <button
                className="ud-btn btn-thm mt-3"
                onClick={() => resetFilter()}
              >
                Reset Filters
                <i className="fal fa-arrow-right-long" />
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i
                  className="flaticon-home-1"
                  style={{ fontSize: "48px", color: "#ccc" }}
                />
              </div>
              <h4 className="text">No listings match your filters</h4>
              <p className="text">Try adjusting your filters to see more results.</p>
              <button
                className="ud-btn btn-thm mt-3"
                onClick={() => resetFilter()}
              >
                Reset Filters
                <i className="fal fa-arrow-right-long" />
              </button>
            </div>
          ) : (
            <FeaturedListings
              colstyle={colstyle}
              data={listings}
              onRefresh={() => fetchListings(pageNumber)}
            />
          )}
        </div>
        {/* End .row */}

        {!loading && listings.length > 0 && totalPages > 1 && (
          <div className="row">
            <PaginationTwo
              pageCapacity={ITEMS_PER_PAGE}
              data={Array.from({ length: totalItems })}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </div>
        )}
        {/* End .row */}
      </div>
      {/* End .container */}
    </section>
  );
}
