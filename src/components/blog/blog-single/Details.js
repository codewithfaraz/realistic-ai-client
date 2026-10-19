import { allblogs } from '@/data/blogs';
import Image from 'next/image';
import React from 'react'

export default function Details({id}) {
    const data = allblogs.filter((elm) => elm.id == id)[0] || allblogs[0];
    const category = data.tag || data.category || "Property Guide";
    const author = data.author || "Nirvana Nests Research Desk";
    const summary =
      data.text ||
      "A practical guide for Pakistani buyers, sellers and tenants comparing real locations, documents and day-to-day property costs.";
  return (
    <>
     <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-12">
              <h2 className="blog-title">
                {data.title ||  data.content || `7 Simple Ways to Keep Your Kid&apos;s Toys From Taking Over Your
                Home`}
                
              </h2>
              <div className="blog-single-meta">
                <div className="post-author d-sm-flex align-items-center">
                  <Image
                    width={40}
                    height={40}
                    className="mr10"
                    src="/images/blog/author-1.png"
                    alt="blog"
                  />
                  <a className="pr15 bdrr1" href="#">
                    {author}
                  </a>
                  <a className="ml15 pr15 bdrr1" href="#">
                    {Array.isArray(category) ? category[0] : category}
                  </a>
                  <a className="ml15" href="#">
                    {data.date.month} {data.date.day}, {data.date.year || 2022}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End .container */}

        <div
          className="mx-auto maxw1600 mt60"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="large-thumb">
                <Image
                  width={1200}
                  height={600}
                  priority
                  className="w-100 h-100 cover"
                  // style={{maxHeight:'600px',objectFit:'cover'}}
                  src={data.image || "/images/blog/blog-single-1.jpg"}
                  alt="blog"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mt60">
          <div className="row">
            <div className="col-xl-8 offset-xl-2">
              <p className="text fz15 mb25">{summary}</p>
              <p className="text fz15 mb25">
                In Pakistan, a good property decision is rarely about price
                alone. Buyers and tenants should compare access roads, security,
                utilities, maintenance charges, parking, nearby schools,
                commercial areas and the reliability of the society or building
                management.
              </p>
              <p className="text fz15 mb0">
                Before committing, request updated photos, confirm ownership or
                allotment documents, check transfer requirements, and keep all
                token and payment terms written clearly. A short, verified
                shortlist is better than visiting ten properties that do not
                match your actual budget or lifestyle.
              </p>
            </div>
          </div>
        </div>

    </>
  )
}
