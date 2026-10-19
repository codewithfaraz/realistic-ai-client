import Explore from "@/components/common/Explore";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import About from "@/components/home/home-v1/About";
import ApartmentType from "@/components/home/home-v1/ApartmentType";
import CallToActions from "@/components/common/CallToActions";
import FeaturedListings from "@/components/home/home-v1/FeatuerdListings";
import Header from "@/components/home/home-v1/Header";
import Partner from "@/components/common/Partner";
import PropertiesByCities from "@/components/home/home-v1/PropertiesByCities";
import Testimonial from "@/components/home/home-v1/Testimonial";
import Hero from "@/components/home/home-v1/hero";
import Image from "next/image";
import Blog from "@/components/common/Blog";
import Link from "next/link";
import PopulerProperty from "@/components/home/home-v1/PopulerProperty";
import { PagesService } from "@/services/pages.service";
import { headers } from "next/headers";
import React from "react";

const stripPort = (host = "") => host.split(":")[0];

const getRequestTenantHost = async () => {
  const requestHeaders = await headers();
  return stripPort(
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "",
  );
};

const getBlocks = (pageData) => pageData?.contentJson?.blocks || [];

const sectionKeyAliases = {
  featured: "featuredListings",
  featuredListing: "featuredListings",
  featuredListings: "featuredListings",
  propertyType: "propertyTypes",
  propertyTypes: "propertyTypes",
  city: "cities",
  cities: "cities",
  location: "cities",
  locations: "cities",
  popular: "popularListings",
  popularListing: "popularListings",
  popularListings: "popularListings",
  testimonial: "testimonials",
  testimonials: "testimonials",
  blog: "blog",
  blogs: "blog",
  partner: "partners",
  partners: "partners",
  cta: "ctaBanner",
  ctaBanner: "ctaBanner",
  heroSearch: "searchBar",
  search: "searchBar",
  searchBar: "searchBar",
};

const normalizeSectionKey = (key) => {
  if (!key) return "";
  const normalized = String(key)
    .trim()
    .replace(/[-_\s]+(.)?/g, (_, letter = "") => letter.toUpperCase());

  return sectionKeyAliases[normalized] || normalized;
};

const defaultContentBlocks = [
  { id: "hero-default", type: "hero", enabled: true, sortOrder: 10 },
  {
    id: "property-types-default",
    type: "propertyTypes",
    enabled: true,
    sortOrder: 20,
  },
  { id: "services-default", type: "services", enabled: true, sortOrder: 30 },
  {
    id: "featured-listings-default",
    type: "featuredListings",
    enabled: true,
    sortOrder: 40,
  },
  { id: "cities-default", type: "cities", enabled: true, sortOrder: 50 },
  { id: "about-default", type: "about", enabled: true, sortOrder: 60 },
  {
    id: "popular-listings-default",
    type: "popularListings",
    enabled: true,
    sortOrder: 70,
  },
  {
    id: "testimonials-default",
    type: "testimonials",
    enabled: true,
    sortOrder: 80,
  },
  { id: "blog-default", type: "blog", enabled: true, sortOrder: 90 },
  { id: "partners-default", type: "partners", enabled: true, sortOrder: 100 },
  { id: "cta-default", type: "ctaBanner", enabled: true, sortOrder: 110 },
];

const contentBlockKey = (block = {}) =>
  block.type === "sectionHeader"
    ? normalizeSectionKey(block.key)
    : block.type === "richText" &&
        ["about", "about-1"].includes(block.key || block.id)
      ? "about"
      : normalizeSectionKey(block.type);

const getSectionList = (contentJson, keys) =>
  keys.flatMap((key) => {
    const value = contentJson?.[key];

    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return Object.keys(value).filter((name) => value[name]);

    return [];
  });

const getExplicitlyRemovedBlockKeys = (pageData) => {
  const contentJson = pageData?.contentJson || {};
  const removalKeys = [
    "disabledSections",
    "hiddenSections",
    "removedSections",
    "deletedSections",
    "disabledBlockTypes",
    "hiddenBlockTypes",
    "removedBlockTypes",
    "deletedBlockTypes",
  ];

  const removedFromLists = getSectionList(contentJson, removalKeys);
  const removedFromBlocks = getBlocks(pageData)
    .filter(
      (block) =>
        block.enabled === false ||
        block.hidden === true ||
        block.removed === true ||
        block.deleted === true,
    )
    .map(contentBlockKey);

  return new Set([...removedFromLists, ...removedFromBlocks].map(normalizeSectionKey));
};

const getManagedBlockKeys = (pageData) => {
  const contentJson = pageData?.contentJson || {};
  const managedKeys = getSectionList(contentJson, [
    "managedSections",
    "activeSections",
    "enabledSections",
    "visibleSections",
    "sectionOrder",
    "blockOrder",
  ]);

  if (!managedKeys.length) return null;

  return new Set(managedKeys.map(normalizeSectionKey));
};

const getMergedBlocks = (pageData) => {
  const backendBlocks = getBlocks(pageData);
  const defaultKeys = new Set(defaultContentBlocks.map(contentBlockKey));
  const removedKeys = getExplicitlyRemovedBlockKeys(pageData);
  const managedKeys = getManagedBlockKeys(pageData);
  const defaultBlocks = defaultContentBlocks
    .filter((defaultBlock) => {
      const key = contentBlockKey(defaultBlock);

      return !removedKeys.has(key) && (!managedKeys || managedKeys.has(key));
    })
    .map((defaultBlock) => {
      const override = backendBlocks.find(
        (block) => contentBlockKey(block) === contentBlockKey(defaultBlock),
      );

      return override ? { ...defaultBlock, ...override } : defaultBlock;
    });
  const customBackendBlocks = backendBlocks.filter(
    (block) =>
      !defaultKeys.has(contentBlockKey(block)) && !removedKeys.has(contentBlockKey(block)),
  );

  return [...defaultBlocks, ...customBackendBlocks];
};

const getEnabledBlocks = (pageData) =>
  getMergedBlocks(pageData)
    .filter(
      (block) =>
        block.enabled !== false &&
        block.hidden !== true &&
        block.removed !== true &&
        block.deleted !== true,
    )
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

const getBlock = (blocks, ...keys) =>
  blocks.find((block) =>
    keys.some((key) => [block.type, block.id, block.key].includes(key)),
  );

const getHomePageData = async () => {
  try {
    const tenantHost = await getRequestTenantHost();
    const response = await PagesService.getHome(tenantHost);
    return response?.success ? response.data : null;
  } catch (error) {
    console.error("Failed to fetch synced home page data", error);
    return null;
  }
};

const formatBrandNameFromHost = (host = "") =>
  host
    .replace(/\.localhost$/, "")
    .replace(/[-.]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const heroBackgroundStyle = (block) =>
  block?.imageUrl
    ? {
        backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2)), url(${block.imageUrl})`,
        backgroundPosition: block.imagePosition || "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }
    : undefined;

export async function generateMetadata() {
  const homePage = await getHomePageData();

  return {
    title: homePage?.metaTitle ?? homePage?.title ?? "Home",
    description: homePage?.metaDescription || undefined,
  };
}

const Home_V1 = async () => {
  const tenantHost = await getRequestTenantHost();
  const homePage = await getHomePageData();
  const enabledBlocks = getEnabledBlocks(homePage);
  const removedBlockKeys = getExplicitlyRemovedBlockKeys(homePage);
  const brandBlock = getBlock(enabledBlocks, "brand", "siteSettings");
  const headerBlock = getBlock(enabledBlocks, "header");
  const footerBlock = getBlock(enabledBlocks, "footer");
  const searchBlock = getBlock(enabledBlocks, "searchBar");
  const isSearchRemoved = removedBlockKeys.has("searchBar");

  const brand = {
    name:
      brandBlock?.name ||
      brandBlock?.brandName ||
      homePage?.contentJson?.brandName ||
      formatBrandNameFromHost(tenantHost),
    logoUrl: brandBlock?.logoUrl,
    logoDarkUrl: brandBlock?.logoDarkUrl,
    footerLogoUrl: brandBlock?.footerLogoUrl,
  };

  const renderHero = (block) => (
    <section className="home-banner-style1 p0" style={heroBackgroundStyle(block)}>
      <div className="home-style1">
        <div className="container">
          <div className="row">
            <div className="col-xl-11 mx-auto">
              <Hero
                hero={block}
                search={isSearchRemoved ? null : searchBlock}
                showSearch={
                  !isSearchRemoved &&
                  block.showSearch !== false &&
                  block.searchEnabled !== false
                }
              />
            </div>
          </div>
        </div>

        <a href="#explore-property">
          <div className="mouse_scroll animate-up-4">
            <Image
              width={20}
              height={105}
              src="/images/about/home-scroll.png"
              alt="scroll image"
            />
          </div>
        </a>
      </div>
    </section>
  );

  const renderPropertyTypes = (block) => (
    <section id="explore-property" className="pb90 pb30-md">
      <div className="container">
        <div className="row  justify-content-between align-items-center">
          <div className="col-auto">
            <div className="main-title" data-aos="fade-up" data-aos-delay="300">
              <h2 className="title">{block.title ?? "Explore Property Types"}</h2>
              <p className="paragraph">
                {block.subtitle ?? searchBlock?.title ?? "Start your property search"}
              </p>
            </div>
          </div>

          <div className="col-auto mb30">
            <div className="row align-items-center justify-content-center">
              <div className="col-auto">
                <button className="prev__active swiper_button">
                  <i className="far fa-arrow-left-long" />
                </button>
              </div>
              <div className="col-auto">
                <div className="pagination swiper--pagination pagination__active" />
              </div>
              <div className="col-auto">
                <button className="next__active swiper_button">
                  <i className="far fa-arrow-right-long" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div
              className="explore-apartment-slider"
              data-aos="fade-up"
              data-aos-delay="300"
              style={{
                marginRight: "calc(-1 * (100vw - 100%) / 2)",
                overflow: "hidden",
              }}
            >
              <ApartmentType />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderServices = (block) => (
    <section className="pt0 pb90 pb10-md">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto" data-aos="fade-up" data-aos-delay="300">
            <div className="main-title text-center">
              <h2 className="title">{block.title ?? "See How We Can Help"}</h2>
              <p className="paragraph">
                {block.subtitle ?? "Find the right property faster with expert guidance."}
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <Explore />
        </div>
      </div>
    </section>
  );

  const renderFeaturedListings = (block) => (
    <section className="bgc-f7">
      <div className="container">
        <div className="row align-items-center" data-aos="fade-up">
          <div className="col-lg-9">
            <div className="main-title2">
              <h2 className="title">
                {block.title ?? "Discover Our Featured Listings"}
              </h2>
              <p className="paragraph">
                {block.subtitle ?? "Handpicked properties from our latest inventory."}
              </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="text-start text-lg-end mb-3">
              <Link className="ud-btn2" href={block.ctaHref || "/listings"}>
                {block.ctaLabel || "See All Properties"}
                <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-listing-slider">
              <FeaturedListings limit={block.limit || 6} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCities = (block) => (
    <section className="pb40-md pb90">
      <div className="container">
        <div className="row align-items-center" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-9">
            <div className="main-title2">
              <h2 className="title">{block.title ?? "Properties by Cities"}</h2>
              <p className="paragraph">
                {block.subtitle ?? "Explore active listings in popular cities."}
              </p>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="text-start text-lg-end mb-3">
              <Link className="ud-btn2" href={block.ctaHref || "/listings"}>
                {block.ctaLabel ?? "See All Cities"}
                <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
            <div className="property-city-slider position-relative">
              <PropertiesByCities />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderRichText = (block) => (
    <section className="pt0 pb40-md">
      <div className="container">
        <div className="row mb40">
          <div className="col-lg-8 m-auto text-center">
            <div className="main-title">
              {block.title ? <h2 className="title">{block.title}</h2> : null}
              {block.html ? (
                <div
                  className="paragraph"
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderAbout = (block) => (
    <section className="pt0 pb40-md">
      <div className="container">
        {block.title || block.html ? (
          <div className="row mb40">
            <div className="col-lg-8 m-auto text-center">
              <div className="main-title">
                {block.title ? <h2 className="title">{block.title}</h2> : null}
                {block.html ? (
                  <div
                    className="paragraph"
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        <About />
      </div>
    </section>
  );

  const renderTestimonials = (block) => (
    <section className="pb100 pb50-md bgc-thm-light">
      <div className="container">
        <div className="row  justify-content-between align-items-center">
          <div className="col-auto">
            <div className="main-title" data-aos="fade-up" data-aos-delay="300">
              <h2 className="title">{block.title ?? "People Love Living Here"}</h2>
              <p className="paragraph">
                {block.subtitle ??
                  "Hear from clients who found their next property with us."}
              </p>
            </div>
          </div>

          <div className="col-auto mb30">
            <div className="row align-items-center justify-content-center">
              <div className="col-auto">
                <button className="testimonila_prev__active swiper_button">
                  <i className="far fa-arrow-left-long" />
                </button>
              </div>
              <div className="col-auto">
                <div className="pagination swiper--pagination testimonila_pagination__active" />
              </div>
              <div className="col-auto">
                <button className="testimonila_next__active swiper_button">
                  <i className="far fa-arrow-right-long" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="testimonial-slider" data-aos="fade-up" data-aos-delay="300">
              <Testimonial />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderBlog = (block) => (
    <section className="pb90 pb20-md">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto" data-aos="fade-up">
            <div className="main-title text-start text-md-center">
              <h2 className="title">{block.title ?? "From Our Blog"}</h2>
              <p className="paragraph">
                {block.subtitle ?? "Insights, market updates, and buying guides."}
              </p>
            </div>
          </div>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <Blog />
        </div>
      </div>
    </section>
  );

  const renderPartners = (block) => (
    <section className="our-partners pt0">
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up">
            <div className="main-title text-center">
              <h6>{block.title ?? "Trusted by our partners"}</h6>
            </div>
          </div>
          <div className="col-lg-12 text-center">
            <div className="dots_none nav_none" data-aos="fade-up" data-aos-delay="300">
              <Partner />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderBlock = (block) => {
    const blockType = contentBlockKey(block);

    switch (blockType) {
      case "hero":
        return renderHero(block);
      case "propertyTypes":
        return renderPropertyTypes(block);
      case "services":
        return renderServices(block);
      case "featuredListings":
        return renderFeaturedListings(block);
      case "cities":
        return renderCities(block);
      case "about":
        return renderAbout(block);
      case "richText":
        return renderRichText(block);
      case "popularListings":
        return <PopulerProperty section={block} />;
      case "testimonials":
        return renderTestimonials(block);
      case "blog":
        return renderBlog(block);
      case "partners":
        return renderPartners(block);
      case "ctaBanner":
        return <CallToActions cta={block} />;
      default:
        return null;
    }
  };

  const contentBlocks = enabledBlocks.filter(
    (block) =>
      !["brand", "siteSettings", "header", "footer", "searchBar"].includes(
        block.type,
      ),
  );

  return (
    <>
      <Header brand={brand} header={headerBlock} />
      <MobileMenu brand={brand} header={headerBlock} footer={footerBlock} />

      {contentBlocks.map((block) => (
        <React.Fragment key={block.id || `${block.type}-${block.sortOrder}`}>
          {renderBlock(block)}
        </React.Fragment>
      ))}

      <section className="footer-style1 pt60 pb-0">
        <Footer brand={brand} footer={footerBlock} />
      </section>
    </>
  );
};

export default Home_V1;
