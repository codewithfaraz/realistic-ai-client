import React from "react";

const ProperytyDescriptions = ({ description }) => {
  return (
    <>
      <p className="text mb10">
        {description || "No description available for this property."}
      </p>
    </>
  );
};

export default ProperytyDescriptions;
