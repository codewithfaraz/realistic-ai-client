"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "photoswipe/dist/photoswipe.css";

const isRemoteImage = (src) => /^https?:\/\//.test(src || "");

const PropertyGallery = ({ media, coverImageUrl }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Build images array from API media, fallback to coverImageUrl
  const images =
    media && media.length > 0
      ? media
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((m) => ({ url: m.url, alt: m.altText || "Property image" }))
      : coverImageUrl
        ? [{ url: coverImageUrl, alt: "Property cover" }]
        : [{ url: "/images/listings/listing-single-6-1.jpg", alt: "Property" }];

  return (
    <>
      <div className="row">
        <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
          <div className="ps-v4-hero-tab position-relative">
            <ul
              className="nav nav-pills justify-content-end"
              id="pills-tab2"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active mr10"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  <span className="flaticon-images text-white fz20" />
                </button>
              </li>
            </ul>
          </div>
          {/* End .ps-v4-hero-tab */}

          <div className="ps-v4-hero-tab">
            <div
              className="tab-content overflow-visible"
              id="pills-tabContent2"
            >
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <div className="container p-0">
                  <div className="row" data-aos="fade-up" data-aos-delay="300">
                    <div className="col-lg-12">
                      <div className="ps-v6-slider nav_none slider-1-grid owl-theme owl-carousel">
                        <Swiper
                          loop={images.length > 1}
                          spaceBetween={10}
                          navigation={{
                            prevEl: ".prev-btn",
                            nextEl: ".next-btn",
                          }}
                          thumbs={{
                            swiper:
                              thumbsSwiper && !thumbsSwiper.destroyed
                                ? thumbsSwiper
                                : null,
                          }}
                          modules={[FreeMode, Navigation, Thumbs]}
                          className="mySwiper2"
                        >
                          {images.map((item, i) => (
                            <SwiperSlide key={i}>
                              {isRemoteImage(item.url) ? (
                                <img
                                  height={736}
                                  width={1100}
                                  src={item.url}
                                  alt={item.alt}
                                  className="w-100 h-auto bdrs12"
                                  style={{ objectFit: "cover", maxHeight: "500px" }}
                                />
                              ) : (
                                <Image
                                  height={736}
                                  width={1100}
                                  src={item.url}
                                  alt={item.alt}
                                  className="w-100 h-auto bdrs12"
                                  style={{ objectFit: "cover", maxHeight: "500px" }}
                                />
                              )}
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        {images.length > 1 && (
                          <div className="row">
                            <div className="col-lg-7 col-md-8">
                              <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={images.length > 1}
                                spaceBetween={10}
                                slidesPerView={Math.min(images.length, 4)}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper mt20"
                              >
                                {images.map((item, i) => (
                                  <SwiperSlide key={i}>
                                    {isRemoteImage(item.url) ? (
                                      <img
                                        height={90}
                                        width={120}
                                        src={item.url}
                                        alt={item.alt}
                                        className="w-100 bdrs12 cover pointer"
                                        style={{ objectFit: "cover", height: "80px" }}
                                      />
                                    ) : (
                                      <Image
                                        height={90}
                                        width={120}
                                        src={item.url}
                                        alt={item.alt}
                                        className="w-100 bdrs12 cover pointer"
                                        style={{ objectFit: "cover", height: "80px" }}
                                      />
                                    )}
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End tab-pane */}
            </div>
          </div>
          {/* End ps-v4-hero-tab content */}
        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default PropertyGallery;
