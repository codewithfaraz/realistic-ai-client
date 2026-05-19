"use client";
import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";

const RecentDataTable = ({ listings, loading }) => {
  if (loading) {
    return <div className="text-center py-5">Loading recently viewed properties...</div>;
  }

  if (!listings || listings.length === 0) {
    return <div className="text-center py-5">No recently viewed properties found.</div>;
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Listing title</th>
          <th scope="col">Date Viewed</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {listings.map((item, index) => {
          const listing = item.listing || item;
          const dateStr = item.viewedAt || listing.viewedAt || listing.createdAt;

          return (
            <tr key={listing.id || index}>
              <th scope="row">
                <Link href={`/single-v6/${listing.slug}`}>{listing.title}</Link>
              </th>
              <td>{dateStr ? new Date(dateStr).toLocaleDateString() : "N/A"}</td>
              <td>
                <div className="d-flex align-items-center">
                  <Link
                    href={`/single-v6/${listing.slug}`}
                    className="icon"
                    style={{ border: "none" }}
                    data-tooltip-id={`full_screen-${listing.id}`}
                  >
                    <span className="flaticon-fullscreen-1" />
                  </Link>

                  <ReactTooltip
                    id={`full_screen-${listing.id}`}
                    place="top"
                    content="View Property"
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RecentDataTable;
