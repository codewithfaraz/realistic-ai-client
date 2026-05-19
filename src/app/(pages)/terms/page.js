"use client";
import { useEffect, useState } from "react";
import { PagesService } from "@/services/pages.service";
import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/common/default-footer";

export default function TermsPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const res = await PagesService.getTerms();
        if (res?.success && res?.data) {
          setPageData(res.data);
        } else {
          setError("Failed to load terms page.");
        }
      } catch (err) {
        console.error("Failed to fetch terms:", err);
        setError("Failed to load terms page.");
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  return (
    <>
      <div className="body_wrapper">
        <DefaultHeader />
        <MobileMenu />
        <div className="body_wrapper">
          <section className="terms-conditions-area pt60 pb90 bgc-f7">
            <div className="container">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text">Loading terms...</p>
                </div>
              ) : error ? (
                <div className="text-center py-5">
                  <h3>{error}</h3>
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="terms-conditions-content bgc-white bdrs12 default-box-shadow2 p30">
                      <h2 className="terms-conditions-title mb30">
                        {pageData.title || "Terms & Conditions"}
                      </h2>

                      {/* Render contentHtml if available */}
                      {pageData.contentHtml ? (
                        <div
                          className="text"
                          dangerouslySetInnerHTML={{
                            __html: pageData.contentHtml,
                          }}
                        />
                      ) : pageData.contentJson?.sections ? (
                        /* Fallback to contentJson sections */
                        pageData.contentJson.sections.map((section, index) => (
                          <div key={section.key || index} className="mb30">
                            {section.title && (
                              <h4 className="title fz17 mb15">
                                {section.title}
                              </h4>
                            )}
                            {section.body && (
                              <p className="text">{section.body}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text">No content available.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className="footer-style1 pt60 pb-0">
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
}
