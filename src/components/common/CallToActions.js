import Image from "next/image";
import Link from "next/link";

const CallToActions = ({ cta }) => {
  const ctaHref = cta?.ctaHref ?? "/contact";
  const ctaLabel = cta?.ctaLabel ?? "Contact Us";
  const phoneLabel = cta?.phoneLabel ?? cta?.phone ?? "+92 300 851 9087";
  const phoneHref = cta?.phoneHref || `tel:${phoneLabel.replace(/\s/g, "")}`;

  return (
    <section className="our-cta pt0">
      <div className="cta-banner bgc-f7 mx-auto maxw1600 pt120 pt60-md pb120 pb60-md bdrs12 position-relative mx20-lg">
        <div className="img-box-5">
          <Image
            width={193}
            height={193}
            className="img-1 spin-right"
            src="/images/about/element-1.png"
            alt="spinner"
          />
        </div>
        <div className="img-box-6">
          <Image
            width={193}
            height={193}
            className="img-1 spin-left"
            src="/images/about/element-1.png"
            alt="spinner"
          />
        </div>
        {/* End image spinner */}

        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-xl-6 " data-aos="fade-right">
              <div className="cta-style1">
                <h2 className="cta-title">
                  {cta?.title ?? "Need help? Talk to our expert."}
                </h2>
                <p className="cta-text mb-0">
                  {cta?.subtitle ??
                    "Talk to a local advisor about pricing, documents, viewings and the right area for your budget."}
                </p>
              </div>
            </div>
            {/* End .col-lg-7 */}

            <div className="col-lg-5 col-xl-6 " data-aos="fade-left">
              <div className="cta-btns-style1 d-block d-sm-flex align-items-center justify-content-lg-end">
                <Link
                  href={ctaHref}
                  className="ud-btn btn-transparent mr30 mr0-xs"
                >
                  {ctaLabel}
                  <i className="fal fa-arrow-right-long" />
                </Link>
                <Link href={phoneHref} className="ud-btn btn-dark">
                  <span className="flaticon-call vam pe-2" />
                  {phoneLabel}
                </Link>
              </div>
            </div>
            {/* End col-lg-5 */}
          </div>
          {/* End .row */}
        </div>
      </div>
    </section>
  );
};

export default CallToActions;
