import React from "react";

const OverView = ({ listing }) => {
  if (!listing) return null;

  const overviewData = [
    {
      icon: "flaticon-bed",
      label: "Bedroom",
      value: listing.bedrooms != null ? listing.bedrooms : "N/A",
    },
    {
      icon: "flaticon-shower",
      label: "Bath",
      value: listing.bathrooms != null ? listing.bathrooms : "N/A",
    },
    {
      icon: "flaticon-expand",
      label: "Sqft",
      value: listing.areaSqft != null ? listing.areaSqft : "N/A",
      xs: true,
    },
    {
      icon: "flaticon-home-1",
      label: "Property Type",
      value: listing.propertyType || "N/A",
    },
    {
      icon: "flaticon-tag",
      label: "Purpose",
      value: listing.purpose === "RENT" ? "For Rent" : "For Sale",
    },
    {
      icon: "flaticon-star-1",
      label: "Status",
      value: listing.statusPublic || "N/A",
    },
  ];

  return (
    <>
      {overviewData.map((item, index) => (
        <div
          key={index}
          className={`col-sm-6 col-lg-4 ${item.xs ? "mb25-xs" : "mb25"}`}
        >
          <div className="overview-element d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0">{item.label}</h6>
              <p className="text mb-0 fz15">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
