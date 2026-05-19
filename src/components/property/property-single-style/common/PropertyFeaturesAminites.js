import React from "react";

// Map amenity slugs to display labels and icons
const amenityMap = {
  "parking": { label: "Parking", icon: "fas fa-parking" },
  "lift": { label: "Lift", icon: "fas fa-arrows-alt-v" },
  "gym": { label: "Gym", icon: "fas fa-dumbbell" },
  "backup-power": { label: "Backup Power", icon: "fas fa-bolt" },
  "security": { label: "Security", icon: "fas fa-shield-alt" },
  "furnished": { label: "Furnished", icon: "fas fa-couch" },
};

const PropertyFeaturesAminites = ({ amenities = [] }) => {
  // Filter to only known amenities and map to display data
  const displayAmenities = amenities
    .filter((slug) => amenityMap[slug])
    .map((slug) => amenityMap[slug]);

  if (displayAmenities.length === 0) {
    return (
      <p className="text mb10">No amenities listed for this property.</p>
    );
  }

  // Split amenities into columns of max 3 items each
  const columns = [];
  const perColumn = Math.ceil(displayAmenities.length / 3) || 1;
  for (let i = 0; i < displayAmenities.length; i += perColumn) {
    columns.push(displayAmenities.slice(i, i + perColumn));
  }

  return (
    <>
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="col-sm-6 col-md-4">
          <div className="pd-list">
            {column.map((amenity, index) => (
              <p key={index} className="text mb10">
                <i className={`${amenity.icon} fz6 align-middle pe-2`} />
                {amenity.label}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyFeaturesAminites;
