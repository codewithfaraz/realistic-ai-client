import React from "react";

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const Footer = ({ brand, footer }) => {
  const brandName = brand?.name || "Real Estate";
  const footerMenuItems =
    footer?.legalLinks || [
      {
        label: "Privacy",
        link: "/privacy-policy",
      },
      {
        label: "Terms",
        link: "/terms",
      },
      {
        label: "Sitemap",
        link: "/sitemap",
      },
    ];
  const copyright =
    footer?.copyright ||
    `© ${brandName} ${getCurrentYear()} - All rights reserved`;

  return (
    <div className="container white-bdrt1 py-4">
      <div className="row">
        <div className="col-sm-6">
          <div className="text-center text-lg-start">
            <p className="copyright-text text-gray ff-heading">
              {copyright}
            </p>
          </div>
        </div>
        {/* End .col-sm-6 */}

        <div className="col-sm-6">
          <div className="text-center text-lg-end">
            <p className="footer-menu ff-heading text-gray">
              {footerMenuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <a className="text-gray" href={item.link}>
                    {item.label}
                  </a>
                  {index !== footerMenuItems.length - 1 && " · "}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        {/* End .col-sm-6 */}
      </div>
    </div>
  );
};

export default Footer;
