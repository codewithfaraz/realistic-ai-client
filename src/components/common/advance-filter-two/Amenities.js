'use client'

const Amenities = ({filterFunctions}) => {
  const amenities = [
    [
      { label: "Parking", value: "parking" },
      { label: "Lift", value: "lift" },
    ],
    [
      { label: "Gym", value: "gym" },
      { label: "Backup Power", value: "backup-power" },
    ],
    [
      { label: "Security", value: "security" },
      { label: "Furnished", value: "furnished" },
    ],
  ];

  return (
    <>
      {amenities.map((column, columnIndex) => (
        <div className="col-sm-4" key={columnIndex}>
          <div className="widget-wrapper mb20">
            <div className="checkbox-style1">
              {column.map((amenity, amenityIndex) => (
                <label className="custom_checkbox" key={amenityIndex}>
                  {amenity.label}
                  <input
                  checked={filterFunctions?.categories.includes(amenity.value)}
                  onChange={()=>filterFunctions?.handlecategories(amenity.value)}
                    type="checkbox"

                  />
                  <span className="checkmark" />
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Amenities;
