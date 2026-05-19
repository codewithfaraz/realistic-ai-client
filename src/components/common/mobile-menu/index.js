"use client";
import Link from "next/link";
import Image from "next/image";
import ContactInfo from "./ContactInfo";
import Social from "./Social";
import ProSidebarContent from "./ProSidebarContent";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

const MobileMenu = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserIconClick = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (isAuthenticated) {
      setShowAccountMenu((prev) => !prev);
    } else {
      // Open the login/signup modal via Bootstrap
      const modalEl = document.getElementById("loginSignupModal");
      if (modalEl && typeof window !== "undefined" && window.bootstrap) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
    }
  };

  const handleLogout = async () => {
    setShowAccountMenu(false);
    await logout();
    window.location.reload();
  };

  return (
    <div className="mobilie_header_nav stylehome1">
      <div className="mobile-menu">
        <div className="header innerpage-style">
          <div className="menu_and_widgets">
            <div className="mobile_menu_bar d-flex justify-content-between align-items-center">
              {/* Left side: hamburger + logo */}
              <div className="d-flex align-items-center">
                <a
                  className="menubar"
                  href="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#mobileMenu"
                  aria-controls="mobileMenu"
                >
                  <Image
                    width={25}
                    height={9}
                    src="/images/mobile-dark-nav-icon.svg"
                    alt="mobile icon"
                  />
                </a>
                <Link className="mobile_logo ms-3" href="/">
                  <Image
                    width={138}
                    height={44}
                    src="/images/header-logo2.svg"
                    alt="logo"
                  />
                </Link>
              </div>

              {/* Right side: user icon with auth-aware behavior */}
              <div className="position-relative" ref={accountMenuRef}>
                {isAuthenticated ? (
                  /* Logged in: toggle account dropdown — matches desktop header style */
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAccountMenu((prev) => !prev);
                    }}
                    className="login-info d-flex align-items-center"
                    role="button"
                    aria-label="Account menu"
                  >
                    <i className="far fa-user-circle fz16 me-1" />
                    <span className="fz14">Account</span>
                    <i className="fa fa-angle-down ms-1 fz12" />
                  </a>
                ) : (
                  /* Logged out: open login/signup modal via Bootstrap attributes */
                  <a
                    href="#"
                    className="login-info d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#loginSignupModal"
                    role="button"
                    aria-label="Login or Register"
                  >
                    <i className="far fa-user-circle fz16 me-1" />
                    <span className="fz14">Login / Register</span>
                  </a>
                )}

                {/* Authenticated dropdown */}
                {isAuthenticated && showAccountMenu && (
                  <div
                    className="position-absolute bg-white shadow rounded-3 p-2"
                    style={{
                      right: 0,
                      top: "100%",
                      minWidth: "160px",
                      zIndex: 9999,
                      marginTop: "8px",
                    }}
                  >
                    <Link
                      href="/dashboard-home"
                      className="dropdown-item d-flex align-items-center py-2 px-3 bdrs4"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <i className="flaticon-user me-2" />
                      Profile
                    </Link>
                    <hr className="my-1" />
                    <button
                      className="dropdown-item d-flex align-items-center py-2 px-3 bdrs4"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /.mobile-menu meta */}

      <div
        className="offcanvas offcanvas-start mobile_menu-canvas"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
        data-bs-scroll="true"
      >
        <div className="rightside-hidden-bar">
          <div className="hsidebar-header">
            <div
              className="sidebar-close-icon"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <span className="far fa-times"></span>
            </div>
            <h4 className="title">Welcome to Homez</h4>
          </div>
          {/* End header */}

          <div className="hsidebar-content ">
            <div className="hiddenbar_navbar_content">
              <ProSidebarContent />
              {/* End .hiddenbar_navbar_menu */}

              <div className="hiddenbar_footer position-relative bdrt1">
                <div className="row pt45 pb30 pl30">
                  <ContactInfo />
                </div>
                {/* End .row */}

                <div className="row pt30 pb30 bdrt1">
                  <div className="col-auto">
                    <div className="social-style-sidebar d-flex align-items-center pl30">
                      <h6 className="me-4 mb-0">Follow us</h6>
                      <Social />
                    </div>
                  </div>
                </div>
              </div>
              {/* hiddenbar_footer */}
            </div>
          </div>
          {/* End hsidebar-content */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
