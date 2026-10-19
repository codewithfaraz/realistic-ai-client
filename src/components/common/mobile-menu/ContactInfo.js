import React from "react";

const ContactInfo = ({ footer }) => {
  const contactInfo =
    footer?.contacts || [
      {
        id: 1,
        title: "Customer Care",
        phone: footer?.phone || "+(0) 123 050 945 02",
        phoneHref: `tel:${footer?.phone || "+012305094502"}`,
      },
      {
        id: 2,
        title: "Need Live Support?",
        email: footer?.email || "support@example.com",
        emailHref: `mailto:${footer?.email || "support@example.com"}`,
      },
    ];

  return (
    <>
      {contactInfo.map((info) => (
        <div className="col-auto" key={info.id}>
          <div className="contact-info">
            <p className="info-title dark-color">{info.title}</p>
            {info.phone && (
              <h6 className="info-phone dark-color">
                <a href={info.phoneHref}>{info.phone}</a>
              </h6>
            )}
            {info.email && (
              <h6 className="info-mail dark-color">
                <a href={info.emailHref}>{info.email}</a>
              </h6>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
