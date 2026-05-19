import React from "react";

const formatPrice = (price, currency = "PKR") => {
  if (!price) return "N/A";
  return `${currency} ${price.toLocaleString()}`;
};

const PropertyDetails = ({ listing }) => {
  if (!listing) return null;

  const columns = [
    [
      {
        label: "Property ID",
        value: listing.id ? listing.id.substring(0, 8) : "N/A",
      },
      {
        label: "Price",
        value: formatPrice(listing.price, listing.currency),
      },
      {
        label: "Property Size",
        value: listing.areaSqft ? `${listing.areaSqft} Sq Ft` : "N/A",
      },
      {
        label: "Bathrooms",
        value: listing.bathrooms != null ? String(listing.bathrooms) : "N/A",
      },
      {
        label: "Bedrooms",
        value: listing.bedrooms != null ? String(listing.bedrooms) : "N/A",
      },
    ],
    [
      {
        label: "Property Type",
        value: listing.propertyType || "N/A",
      },
      {
        label: "Property Status",
        value: listing.purpose === "RENT" ? "For Rent" : "For Sale",
      },
      {
        label: "Listing Status",
        value: listing.statusPublic || "N/A",
      },
      {
        label: "Featured",
        value: listing.isFeatured ? "Yes" : "No",
      },
    ],
  ];

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`col-md-6 col-xl-4${
            columnIndex === 1 ? " offset-xl-2" : ""
          }`}
        >
          {column.map((detail, index) => (
            <div key={index} className="d-flex justify-content-between">
              <div className="pd-list">
                <p className="fw600 mb10 ff-heading dark-color">
                  {detail.label}
                </p>
              </div>
              <div className="pd-list">
                <p className="text mb10">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;
