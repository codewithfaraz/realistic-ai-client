"use client";

import { PagesService } from "@/services/pages.service";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SiteSettingsContext = createContext({
  brand: null,
  header: null,
  footer: null,
  isLoading: true,
});

const formatBrandNameFromHost = (host = "") =>
  host
    .replace(/\.localhost$/, "")
    .replace(/[-.]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getBlock = (pageData, ...keys) =>
  pageData?.contentJson?.blocks?.find((block) =>
    keys.some((key) => [block.type, block.id, block.key].includes(key)),
  );

const getTenantHost = () => {
  if (typeof window === "undefined") return "";
  return window.location.hostname;
};

const buildSettings = (homePage, tenantHost) => {
  const brandBlock = getBlock(homePage, "brand", "siteSettings");

  return {
    brand: {
      name:
        brandBlock?.name ||
        brandBlock?.brandName ||
        homePage?.contentJson?.brandName ||
        formatBrandNameFromHost(tenantHost),
      logoUrl: brandBlock?.logoUrl,
      logoDarkUrl: brandBlock?.logoDarkUrl,
      footerLogoUrl: brandBlock?.footerLogoUrl,
    },
    header: getBlock(homePage, "header"),
    footer: getBlock(homePage, "footer"),
  };
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() =>
    buildSettings(null, getTenantHost()),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const tenantHost = getTenantHost();
        const response = await PagesService.getHome(tenantHost);
        if (!cancelled && response?.success) {
          setSettings(buildSettings(response.data, tenantHost));
        }
      } catch (error) {
        console.error("Failed to fetch site settings", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      isLoading,
    }),
    [settings, isLoading],
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
