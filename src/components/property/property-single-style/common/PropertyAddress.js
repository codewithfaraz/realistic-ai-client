import React from "react";

const PropertyAddress = ({ location }) => {
  if (!location) return null;

  return (
    <>
      <div className="col-md-6 col-xl-4">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Address</p>
            <p className="fw600 mb10 ff-heading dark-color">City</p>
            <p className="fw600 mb-0 ff-heading dark-color">Country</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{location.addressLine || "N/A"}</p>
            <p className="text mb10">{location.city || "N/A"}</p>
            <p className="text mb-0">{location.country || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-xl-4 offset-xl-2">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Latitude</p>
            <p className="fw600 mb-0 ff-heading dark-color">Longitude</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{location.lat || "N/A"}</p>
            <p className="text mb-0">{location.lng || "N/A"}</p>
          </div>
        </div>
      </div>
      {/* End col */}

      {location.lat && location.lng && (
        <div className="col-md-12">
          <iframe
            className="position-relative bdrs12 mt30 h250"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&t=m&z=14&output=embed&iwloc=near`}
            title={location.addressLine || "Property Location"}
            aria-label={location.addressLine || "Property Location"}
          />
        </div>
      )}
      {/* End col */}
    </>
  );
};

export default PropertyAddress;
