"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const Location = ({ filterFunctions }) => {
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);
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
    <>
      {" "}
      {showSelect && (
        <Select
          defaultValue={[locationOptions[0]]}
          name="colors"
          styles={customStyles}
          options={locationOptions}
          className="select-custom"
          classNamePrefix="select"
          required
          value={{
            value: filterFunctions.location,
            label: filterFunctions.location,
          }}
          onChange={(e) => filterFunctions?.handlelocation(e.value)}
        />
      )}{" "}
    </>
  );
};

export default Location;
