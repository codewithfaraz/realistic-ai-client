"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const HeroContent = ({ search }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { id: "buy", label: "Buy" },
    { id: "rent", label: "Rent" },
    { id: "sold", label: "Sold" },
  ];

  const getPurpose = () => {
    if (activeTab === "buy") return "SALE";
    if (activeTab === "rent") return "RENT";
    return "";
  };

  const handleSearch = (event) => {
    event?.preventDefault();

    const params = new URLSearchParams();
    const trimmedSearch = searchTerm.trim();
    const purpose = getPurpose();

    if (trimmedSearch) params.set("q", trimmedSearch);
    if (purpose) params.set("purpose", purpose);

    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
  };

  return (
    <div className="advance-search-tab mt70 mt30-md mx-auto animate-up-3">
      {search?.title ? (
        <h3 className="fz18 mb20 text-start text-md-center">{search.title}</h3>
      ) : null}
      <ul className="nav nav-tabs p-0 m-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            className={`${activeTab === tab.id ? "active" : ""} tab-pane`}
            key={tab.id}
          >
            <div className="advance-content-style1">
              <div className="row">
                <div className="col-md-8 col-lg-9">
                  <div className="advance-search-field position-relative text-start">
                    <form
                      className="form-search position-relative"
                      onSubmit={handleSearch}
                    >
                      <div className="box-search">
                        <span className="icon flaticon-home-1" />
                        <input
                          className="form-control bgc-f7 bdrs12"
                          type="text"
                          name="search"
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder={
                            search?.placeholder ??
                            `Enter an address, neighborhood, city, or ZIP code for ${tab.label}`
                          }
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* End .col-md-8 */}

                <div className="col-md-4 col-lg-3">
                  <div className="d-flex align-items-center justify-content-start justify-content-md-center mt-3 mt-md-0">
                    <button
                      className="advance-search-btn"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#advanceSeachModal"
                    >
                      <span className="flaticon-settings" /> Advanced
                    </button>
                    <button
                      className="advance-search-icon ud-btn btn-thm ms-4"
                      onClick={handleSearch}
                      type="button"
                    >
                      <span className="flaticon-search" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;
