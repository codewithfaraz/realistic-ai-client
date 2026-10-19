import Image from "next/image";
import Link from "next/link";

const Explore = () => {
  // Array of iconbox data
  const iconboxData = [
    {
      id: 1,
      icon: "/images/icon/property-buy.svg",
      title: "Buy a property",
      text: "Browse verified homes, apartments, plots, and commercial spaces across Lahore, Islamabad, Rawalpindi, Karachi, and nearby societies.",
      linkText: "Browse listings",
    },
    {
      id: 2,
      icon: "/images/icon/property-sell.svg",
      title: "Sell a property",
      text: "Present your property with clear photos, location details, pricing guidance, and buyer-ready documentation notes.",
      linkText: "List property",
    },
    {
      id: 3,
      icon: "/images/icon/property-rent.svg",
      title: "Rent a property",
      text: "Shortlist practical rentals by commute, security, schools, parking, backup power, and monthly maintenance costs.",
      linkText: "Find a rental",
    },
  ];

  return (
    <>
      {iconboxData.map((item) => (
        <div
          className="col-sm-6 col-lg-4"
          key={item.id}
          data-aos="fade-up"
          data-aos-delay={(item.id + 1) * 100} // Increase delay for each item
        >
          <div className="iconbox-style2 text-center">
            <div className="icon">
              <Image width={150} height={150} src={item.icon} alt="icon" />
            </div>
            <div className="iconbox-content">
              <h4 className="title">{item.title}</h4>
              <p className="text">{item.text}</p>
              <Link href="/listings" className="ud-btn btn-white2">
                {item.linkText}
                <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Explore;
