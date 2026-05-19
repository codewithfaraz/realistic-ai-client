"use client";
import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";
import toast from "react-hot-toast";
import { ListingsService } from "@/services/listings.service";

const SearchDataTable = ({ listings, loading, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleUnsave = async (listingId) => {
    setDeletingId(listingId);
    try {
      const response = await ListingsService.unsaveListing(listingId);
      if (response?.success) {
        toast.success("Listing unsaved successfully!");
        if (onRefresh) onRefresh();
      } else {
        toast.error(response?.message || "Failed to unsave listing.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "An error occurred while unsaving.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading saved listings...</div>;
  }

  if (!listings || listings.length === 0) {
    return <div className="text-center py-5">No saved listings found.</div>;
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Listing title</th>
          <th scope="col">Date Saved</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {listings.map((listing) => (
          <tr key={listing.id}>
            <th scope="row">
              <Link href={`/single-v6/${listing.slug}`}>{listing.title}</Link>
            </th>
            <td>{new Date(listing.savedAt).toLocaleDateString()}</td>
            <td>
              <div className="d-flex align-items-center">
                <Link
                  href={`/single-v6/${listing.slug}`}
                  className="icon"
                  style={{ border: "none", marginRight: "10px" }}
                  data-tooltip-id={`full_screen-${listing.id}`}
                >
                  <span className="flaticon-fullscreen-1" />
                </Link>

                <button
                  className="icon"
                  style={{ border: "none", background: "none" }}
                  data-tooltip-id={`unsave-${listing.id}`}
                  onClick={() => handleUnsave(listing.id)}
                  disabled={deletingId === listing.id}
                >
                  {deletingId === listing.id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  ) : (
                    <span className="flaticon-bin" style={{ color: "red" }} />
                  )}
                </button>

                <ReactTooltip
                  id={`full_screen-${listing.id}`}
                  place="top"
                  content="View Property"
                />
                <ReactTooltip
                  id={`unsave-${listing.id}`}
                  place="top"
                  content="Unsave Property"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SearchDataTable;
