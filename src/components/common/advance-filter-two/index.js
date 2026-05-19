"use client";
import Select from "react-select";
import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Amenities from "./Amenities";
import { useEffect, useState, useCallback } from "react";

const AdvanceFilterModal = ({ filterFunctions }) => {
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);

  // ─── Local state: mirrors the parent state but doesn't trigger API calls ───
  const [localPriceRange, setLocalPriceRange] = useState(
    filterFunctions?.priceRange || [0, 100000000],
  );
  const [localBedrooms, setLocalBedrooms] = useState(
    filterFunctions?.bedrooms || 0,
  );
  const [localBathroms, setLocalBathroms] = useState(
    filterFunctions?.bathroms || 0,
  );
  const [localPropertyTypes, setLocalPropertyTypes] = useState(
    filterFunctions?.propertyTypes || [],
  );
  const [localLocation, setLocalLocation] = useState(
    filterFunctions?.location || "All Cities",
  );
  const [localSquirefeet, setLocalSquirefeet] = useState(
    filterFunctions?.squirefeet || [],
  );
  const [localCategories, setLocalCategories] = useState(
    filterFunctions?.categories || [],
  );

  // Sync local state when modal opens (parent state may have changed externally)
  useEffect(() => {
    setLocalPriceRange(filterFunctions?.priceRange || [0, 100000000]);
    setLocalBedrooms(filterFunctions?.bedrooms || 0);
    setLocalBathroms(filterFunctions?.bathroms || 0);
    setLocalPropertyTypes(filterFunctions?.propertyTypes || []);
    setLocalLocation(filterFunctions?.location || "All Cities");
    setLocalSquirefeet(filterFunctions?.squirefeet || []);
    setLocalCategories(filterFunctions?.categories || []);
  }, [
    filterFunctions?.priceRange,
    filterFunctions?.bedrooms,
    filterFunctions?.bathroms,
    filterFunctions?.propertyTypes,
    filterFunctions?.location,
    filterFunctions?.squirefeet,
    filterFunctions?.categories,
  ]);

  // Local handlecategories (amenities toggle)
  const handleLocalCategories = useCallback((elm) => {
    if (elm === "All") {
      setLocalCategories([]);
    } else {
      setLocalCategories((prev) =>
        prev.includes(elm)
          ? prev.filter((el) => el !== elm)
          : [...prev, elm],
      );
    }
  }, []);

  // Build a local filterFunctions proxy for child components
  const localFilterFunctions = {
    priceRange: localPriceRange,
    handlepriceRange: setLocalPriceRange,
    bedrooms: localBedrooms,
    handlebedrooms: setLocalBedrooms,
    bathroms: localBathroms,
    handlebathroms: setLocalBathroms,
    propertyTypes: localPropertyTypes,
    setPropertyTypes: setLocalPropertyTypes,
    location: localLocation,
    handlelocation: setLocalLocation,
    squirefeet: localSquirefeet,
    handlesquirefeet: setLocalSquirefeet,
    categories: localCategories,
    handlecategories: handleLocalCategories,
  };

  // ─── Apply local filters to parent and close modal ───
  const handleSearch = () => {
    filterFunctions?.handlepriceRange(localPriceRange);
    filterFunctions?.handlebedrooms(localBedrooms);
    filterFunctions?.handlebathroms(localBathroms);
    filterFunctions?.setPropertyTypes(localPropertyTypes);
    filterFunctions?.handlelocation(localLocation);
    filterFunctions?.handlesquirefeet(localSquirefeet);

    // Directly set categories (amenities) on parent
    if (filterFunctions?.setCategories) {
      filterFunctions.setCategories([...localCategories]);
    }

    // Close the modal programmatically
    const modalEl = document.getElementById("advanceSeachModal");
    if (modalEl) {
      const closeBtn = modalEl.querySelector('[data-bs-dismiss="modal"]');
      if (closeBtn) closeBtn.click();
    }
  };

  // ─── Reset: clear both local and parent state ───
  const handleReset = () => {
    setLocalPriceRange([0, 100000000]);
    setLocalBedrooms(0);
    setLocalBathroms(0);
    setLocalPropertyTypes([]);
    setLocalLocation("All Cities");
    setLocalSquirefeet([]);
    setLocalCategories([]);
    filterFunctions?.resetFilter();
  };

  const catOptions = [
    { value: "Houses", label: "Houses" },
    { value: "Office", label: "Office" },
    { value: "Apartments", label: "Apartments" },
    { value: "Villa", label: "Villa" },
  ];

  const locationOptions = [
    { value: "All Cities", label: "All Cities" },
    { value: "Lahore", label: "Lahore" },
    { value: "Karachi", label: "Karachi" },
    { value: "Islamabad", label: "Islamabad" },
    { value: "Rawalpindi", label: "Rawalpindi" },
    { value: "Faisalabad", label: "Faisalabad" },
    { value: "Multan", label: "Multan" },
    { value: "Texas", label: "Texas" },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
            ? "#eb675312"
            : isFocused
              ? "#eb675312"
              : undefined,
      };
    },
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header pl30 pr30">
          <h5 className="modal-title" id="exampleModalLabel">
            More Filter
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        {/* End modal-header */}

        <div className="modal-body pb-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Price Range</h6>
                <div className="range-slider-style modal-version">
                  <PriceRange filterFunctions={localFilterFunctions} />
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Type</h6>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select
                      defaultValue={[catOptions[1]]}
                      name="colors"
                      options={catOptions}
                      styles={customStyles}
                      onChange={(e) =>
                        setLocalPropertyTypes([e.value])
                      }
                      className="select-custom"
                      classNamePrefix="select"
                      required
                    />
                  )}
                </div>
              </div>
            </div>
            {/* End .col-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Property ID</h6>
                <div className="form-style2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="RT04949213"
                  />
                </div>
              </div>
            </div>
            {/* End .col-6 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bedrooms</h6>
                <div className="d-flex">
                  <Bedroom filterFunctions={localFilterFunctions} />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bathrooms</h6>
                <div className="d-flex">
                  <Bathroom filterFunctions={localFilterFunctions} />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Location</h6>
                <div className="form-style2 input-group">
                  <Select
                    defaultValue={[locationOptions[0]]}
                    name="colors"
                    styles={customStyles}
                    options={locationOptions}
                    className="select-custom filterSelect"
                    value={{
                      value: localLocation,
                      label: localLocation,
                    }}
                    classNamePrefix="select"
                    onChange={(e) => setLocalLocation(e.value)}
                    required
                  />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Square Feet</h6>
                <div className="space-area">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-style1">
                      <input
                        type="number"
                        className="form-control filterInput"
                        onChange={(e) =>
                          setLocalSquirefeet([
                            e.target.value,
                            document.getElementById("maxFeet3")?.value / 1 || 0,
                          ])
                        }
                        placeholder="Min."
                        id="minFeet3"
                      />
                    </div>
                    <span className="dark-color">-</span>
                    <div className="form-style1">
                      <input
                        type="number"
                        className="form-control filterInput"
                        placeholder="Max"
                        id="maxFeet3"
                        onChange={(e) =>
                          setLocalSquirefeet([
                            document.getElementById("minFeet3")?.value / 1 || 0,
                            e.target.value,
                          ])
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper mb0">
                <h6 className="list-title mb10">Amenities</h6>
              </div>
            </div>
            <Amenities filterFunctions={localFilterFunctions} />
          </div>
        </div>
        {/* End modal body */}

        <div className="modal-footer justify-content-between">
          <button
            className="reset-button"
            onClick={handleReset}
          >
            <span className="flaticon-turn-back" />
            <u>Reset all filters</u>
          </button>
          <div className="btn-area">
            <button
              type="button"
              className="ud-btn btn-thm"
              onClick={handleSearch}
            >
              <span className="flaticon-search align-text-top pr10" />
              Search
            </button>
          </div>
        </div>
        {/* End modal-footer */}
      </div>
    </div>
  );
};

export default AdvanceFilterModal;
