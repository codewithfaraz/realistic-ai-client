import React from "react";

const featuresData = [
  {
    points: [
      "Confirm the seller, owner or authorized agent identity.",
      "Verify ownership, allotment or registry documents before token.",
      "Compare access roads, schools, markets and commute time.",
      "Ask about transfer fees, taxes and society charges.",
      "Check water, gas, power backup and maintenance history.",
      "Keep token, payment schedule and possession terms in writing.",
    ],
  },
  {
    points: [
      "Visit in daylight and after office hours if possible.",
      "Inspect seepage, wiring, lifts, parking and security desk.",
      "Confirm rent escalation, notice period and maintenance dues.",
      "Use recent nearby transactions as a pricing reference.",
      "Avoid pressure deals without document verification.",
    ],
  },
];

const Features = () => {
  return (
    <>
      {featuresData.map((featureSection, index) => (
        <div className="col-auto" key={index}>
          <div className="ui-content">
            <div className="list-style1">
              <ul>
                {featureSection.points.map((point, pointIndex) => (
                  <li key={pointIndex}>
                    <i className="far fa-check text-thm3 bgc-thm3-light" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Features;
