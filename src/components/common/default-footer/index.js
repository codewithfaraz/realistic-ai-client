"use client";
import { useEffect, useState } from "react";
import { MenuService } from "@/services/menu.service";
import Image from "next/image";
import Link from "next/link";
import ContactMeta from "./ContactMeta";
import AppWidget from "./AppWidget";
import Social from "./Social";
import Subscribe from "./Subscribe";
import MenuWidget from "./MenuWidget";
import Copyright from "./Copyright";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const Footer = ({ brand, footer }) => {
  const siteSettings = useSiteSettings();
  const resolvedBrand = brand || siteSettings.brand;
  const resolvedFooter = footer || siteSettings.footer;
  const [isLoading, setIsLoading] = useState(true);
  const [footerQuickLinks, setFooterQuickLinks] = useState([]);
  const logoUrl = resolvedBrand?.footerLogoUrl || resolvedBrand?.logoUrl;
  const brandName = resolvedBrand?.name || "Real Estate";
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await MenuService.getMenu("FOOTER");
        setFooterQuickLinks(res?.data?.items);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFooter();
  }, []);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="footer-widget mb-4 mb-lg-5">
              <Link className="footer-logo" href="/">
                {logoUrl ? (
                  <img
                    width={138}
                    height={44}
                    className="mb40"
                    src={logoUrl}
                    alt={brandName}
                  />
                ) : (
                  <span className="d-inline-block mb40 fz24 fw600 text-white">
                    {brandName}
                  </span>
                )}
              </Link>
              {/* <ContactMeta /> */}
              {/* <AppWidget /> */}
              {/* <div className="social-widget">
                <h6 className="text-white mb20">Follow us on social media</h6>
                <Social />
              </div> */}
            </div>
          </div>
          {/* End .col-lg-5 */}

          <div className="col-lg-7">
            <div className="footer-widget mb-4 mb-lg-5">
              {/* <Subscribe /> */}
              <div className="row justify-content-between">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <MenuWidget quickLinks={footerQuickLinks} />
                )}
                {/* <MenuWidget /> */}
              </div>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}

      <Copyright brand={resolvedBrand} footer={resolvedFooter} />
      {/* End copyright */}
    </>
  );
};

export default Footer;
