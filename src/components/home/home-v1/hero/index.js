import AdvanceFilterModal from "@/components/common/advance-filter";
import HeroContent from "./HeroContent";

const Hero = ({ hero, search, showSearch = true }) => {
  return (
    <>
      <div className="inner-banner-style1 text-center">
        <h6 className="hero-sub-title animate-up-1">
          {hero?.eyebrow ?? "THE BEST WAY TO"}
        </h6>
        <h2 className="hero-title animate-up-2">
          {hero?.title ?? "Find Your Dream Home"}
        </h2>
        <p className="hero-text fz15 animate-up-3">
          {hero?.subtitle ??
            "We’ve more than 745,000 apartments, place & plot."}
        </p>
        {showSearch ? <HeroContent search={search} /> : null}
      </div>
      {/* End Hero content */}

      {showSearch ? (
        <div className="advance-feature-modal">
          <div
            className="modal fade"
            id="advanceSeachModal"
            tabIndex={-1}
            aria-labelledby="advanceSeachModalLabel"
            aria-hidden="true"
          >
            <AdvanceFilterModal />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Hero;
