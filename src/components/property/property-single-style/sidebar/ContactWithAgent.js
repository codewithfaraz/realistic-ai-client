import React from "react";

const ContactWithAgent = ({ contactCard }) => {
  const title = contactCard?.title || "Contact Agent";
  const phone = contactCard?.phone || null;
  const email = contactCard?.email || null;
  const whatsapp = contactCard?.whatsapp || null;
  const ctaLabel = contactCard?.ctaLabel || "Get in touch";

  return (
    <>
      <div className="agent-single d-sm-flex align-items-center pb25">
        <div className="single-contant">
          <h6 className="title mb-1">{title}</h6>
          <div className="agent-meta mb10">
            {phone && (
              <a className="text fz15 d-block mb-1" href={`tel:${phone}`}>
                <i className="flaticon-call pe-1" />
                {phone}
              </a>
            )}
            {email && (
              <a className="text fz15 d-block mb-1" href={`mailto:${email}`}>
                <i className="flaticon-email pe-1" />
                {email}
              </a>
            )}
            {whatsapp && (
              <a
                className="text fz15 d-block"
                href={`https://wa.me/${whatsapp.replace(/\+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp pe-1" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
      {/* End agent-single */}

      <div className="d-grid">
        {phone && (
          <a href={`tel:${phone}`} className="ud-btn btn-white2">
            {ctaLabel}
            <i className="fal fa-arrow-right-long" />
          </a>
        )}
      </div>
    </>
  );
};

export default ContactWithAgent;
