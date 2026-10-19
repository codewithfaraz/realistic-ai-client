"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Header = ({ brand, header }) => {
  const [navbar, setNavbar] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const logoUrl = brand?.logoUrl || "/images/header-logo.svg";
  const stickyLogoUrl =
    brand?.logoDarkUrl || brand?.logoUrl || "/images/header-logo2.svg";
  const brandName = brand?.name || "Real Estate";
  const brandTextStyle = {
    display: "inline-block",
    maxWidth: "138px",
    lineHeight: "44px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header
        className={`header-nav nav-homepage-style main-menu  ${
          navbar ? "sticky slideInDown animated" : ""
        }`}
      >
        <nav className="posr">
          <div className="container posr menu_bdrt1">
            <div className="row align-items-center justify-content-between flex-nowrap">
              <div className="col-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos mr40">
                    <Link className="header-logo logo1" href="/">
                      {brand?.logoUrl ? (
                        <img
                          width={138}
                          height={44}
                          src={logoUrl}
                          alt={brandName}
                        />
                      ) : (
                        <span
                          className="fz24 fw600 text-white"
                          style={brandTextStyle}
                        >
                          {brandName}
                        </span>
                      )}
                    </Link>
                    <Link className="header-logo logo2" href="/">
                      {brand?.logoDarkUrl || brand?.logoUrl ? (
                        <img
                          width={138}
                          height={44}
                          src={stickyLogoUrl}
                          alt={brandName}
                        />
                      ) : (
                        <span
                          className="fz24 fw600 dark-color"
                          style={brandTextStyle}
                        >
                          {brandName}
                        </span>
                      )}
                    </Link>
                  </div>
                  {/* End Logo */}

                  <MainMenu />
                  {/* End Main Menu */}
                </div>
              </div>
              {/* End .col-auto */}

              <div className="col-auto">
                <div className="d-flex align-items-center flex-nowrap">
                  {isAuthenticated ? (
                    <div className="list-inline-item position-relative">
                      <a
                        href="#"
                        className="login-info d-flex align-items-center"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        role="button"
                      >
                        <i className="far fa-user-circle fz16 me-2" />
                        <span className="d-none d-xl-block">Account</span>
                        <i className="fa fa-angle-down ms-2 d-none d-xl-inline" />
                      </a>
                      <div
                        className="dropdown-menu dropdown-menu-end p-2"
                        style={{ minWidth: "180px" }}
                      >
                        <Link
                          href="/dashboard-home"
                          className="dropdown-item d-flex align-items-center py-2 px-3 bdrs4"
                        >
                          <i className="flaticon-user me-2" />
                          Profile
                        </Link>
                        <hr className="my-1" />
                        <button
                          className="dropdown-item d-flex align-items-center py-2 px-3 bdrs4"
                          onClick={logout}
                        >
                          <i className="fas fa-sign-out-alt me-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <a
                      href="#"
                      className="login-info d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#loginSignupModal"
                      role="button"
                    >
                        <i className="far fa-user-circle fz16 me-2" />{" "}
                        <span className="d-none d-xl-block">
                          {header?.loginLabel || "Login / Register"}
                        </span>
                      </a>
                  )}
                  <Link
                    className="ud-btn add-property menu-btn bdrs60 mx-2 mx-xl-4"
                    href="/dashboard-add-property"
                  >
                    {header?.addPropertyLabel || "Add Property"}
                    <i className="fal fa-arrow-right-long" />
                  </Link>
                  {/* <a
                    className="sidemenu-btn filter-btn-right"
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
                    aria-controls="SidebarPanelLabel"
                  >
                    <Image
                      width={25}
                      height={9}
                      className="img-1"
                      src="/images/icon/nav-icon-white.svg"
                      alt="humberger menu"
                    />

                    <Image
                      width={25}
                      height={9}
                      className="img-2"
                      src="/images/icon/nav-icon-dark.svg"
                      alt="humberger menu"
                    />
                  </a> */}
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
      {/* End Header */}

      {/* Signup Modal */}
      <div className="signup-modal">
        <div
          className="modal fade"
          id="loginSignupModal"
          tabIndex={-1}
          aria-labelledby="loginSignupModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-scrollable modal-dialog-centered">
            <LoginSignupModal brand={brand} header={header} />
          </div>
        </div>
      </div>
      {/* End Signup Modal */}

      {/* DesktopSidebarMenu */}
      {/* <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="SidebarPanel"
        aria-labelledby="SidebarPanelLabel"
      >
        <SidebarPanel />
      </div> */}
      {/* Sidebar Panel End */}
    </>
  );
};

export default Header;
