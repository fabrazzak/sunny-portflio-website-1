"use client";

import { useState } from "react";

const listings = [
  {
    image:
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3087377/20491fe7-71c5-48c4-bf93-9d29334d4418.webp",
    address: "1807 Acadia Road",
    city: "Vancouver",
    price: "$8,300,000",
    beds: 7,
    baths: 7,
    sqft: "5879sqft",
    description:
      "Stunning modern estate with panoramic ocean views. Features gourmet kitchen, infinity pool, wine cellar, and smart home automation throughout.",
    features: [
      "Ocean View",
      "Infinity Pool",
      "Wine Cellar",
      "Smart Home",
      "Gourmet Kitchen",
    ],
    yearBuilt: 2019,
    lotSize: "0.5 acres",
    propertyType: "Single Family Home",
    listingAgent: "Matt Thompson",
    agentContact: "778-867-9980",
    additionalImages: [
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3087377/20491fe7-71c5-48c4-bf93-9d29334d4418.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3070774/2afd4e7c-2cd5-4884-bc52-b6d307204515.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3070774/b5a7d3ea-cf89-4a52-a927-e5117e9443ae.webp",
    ],
  },
  {
    image:
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3073033/16286aac-6bde-4577-b363-b7025202292e.webp",
    address: "4038 W 33rd Avenue",
    city: "Vancouver",
    price: "$4,388,800",
    beds: 5,
    baths: 5,
    sqft: "3946 ft",
    description:
      "Contemporary masterpiece in prime location. Open concept living, rooftop terrace, and premium finishes throughout.",
    features: [
      "Rooftop Terrace",
      "Open Concept",
      "Premium Finishes",
      "Home Theater",
      "Garage",
    ],
    yearBuilt: 2020,
    lotSize: "0.25 acres",
    propertyType: "Townhouse",
    listingAgent: "Matt Thompson",
    agentContact: "778-867-9980",
    additionalImages: [
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3073033/16286aac-6bde-4577-b363-b7025202292e.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3073033/dbebe87d-109f-4ee4-a27a-7549c03682ad.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3073033/9d525813-8a50-41fe-a1f1-b80bad6646d9.webp",
    ],
  },
  {
    image:
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3089713/829004f7-4590-4d99-b8f9-4b9143b1f745.webp",
    address: "7158 Bayview Drivet",
    city: "Burnaby",
    price: "$3,755,556",
    beds: 6,
    baths: 8,
    sqft: "5763sqft",
    description:
      "Magnificent luxury estate on private lot. Perfect for entertaining with indoor pool, tennis court, and guest house.",
    features: [
      "Indoor Pool",
      "Tennis Court",
      "Guest House",
      "Wine Cellar",
      "Home Gym",
    ],
    yearBuilt: 2018,
    lotSize: "2 acres",
    propertyType: "Estate",
    listingAgent: "Matt Thompson",
    agentContact: "778-867-9980",
    additionalImages: [
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3089713/829004f7-4590-4d99-b8f9-4b9143b1f745.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3017717/b7aa5d8f-0cd2-46e4-8ff0-79dc4a3dcd8a.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3017717/72041d61-49f8-4809-bd17-d8799246a24c.webp",
    ],
  },
  {
    image:
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3017717/309c61d4-6424-4de4-9c78-d958564785b8.webp",
    address: "20053 Fernridge Crescent",
    city: "Langley",
    price: "$4,388,000",
    beds: 9,
    baths: 8,
    sqft: "9245 ft",
    description:
      "Magnificent luxury estate on private lot. Perfect for entertaining with indoor pool, tennis court, and guest house.",
    features: [
      "Indoor Pool",
      "Tennis Court",
      "Guest House",
      "Wine Cellar",
      "Home Gym",
    ],
    yearBuilt: 2018,
    lotSize: "2 acres",
    propertyType: "Estate",
    listingAgent: "Matt Thompson",
    agentContact: "778-867-9980",
    additionalImages: [
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3017717/309c61d4-6424-4de4-9c78-d958564785b8.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3017717/b7aa5d8f-0cd2-46e4-8ff0-79dc4a3dcd8a.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3017717/72041d61-49f8-4809-bd17-d8799246a24c.webp",
    ],
  },
  {
    image:
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3080576/62d31a8e-4f41-4762-8c1c-99c5ea03382e.webp",
    address: "3456 Marine Drive",
    city: "West Vancouver",
    price: "$5,500,000",
    beds: 7,
    baths: 6,
    sqft: "6500 ft",
    description:
      "Waterfront contemporary with direct beach access. Floor-to-ceiling windows, private dock, and designer interiors.",
    features: [
      "Waterfront",
      "Private Dock",
      "Beach Access",
      "Wine Cellar",
      "Smart Home",
    ],
    yearBuilt: 2021,
    lotSize: "0.75 acres",
    propertyType: "Waterfront Home",
    listingAgent: "Matt Thompson",
    agentContact: "778-867-9980",
    additionalImages: [
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3080576/62d31a8e-4f41-4762-8c1c-99c5ea03382e.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3080576/fe3ad66c-50ea-4364-8fd2-7c5c14a5bf8a.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3080576/d2eddb21-08aa-41be-afb2-fa23aaaf753e.webp",
    ],
  },
  {
    image:
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3082982/4e27da43-a050-44b8-8cc7-1343b7d549ad.webp",
    address: "789 Belmont Avenue",
    city: "Vancouver",
    price: "$3,200,000",
    beds: 4,
    baths: 4,
    sqft: "3200 ft",
    description:
      "Charming character home with modern updates. Heritage details, gourmet kitchen, and landscaped garden.",
    features: [
      "Character Home",
      "Heritage Details",
      "Gourmet Kitchen",
      "Landscaped Garden",
      "Hardwood Floors",
    ],
    yearBuilt: 1935,
    lotSize: "0.2 acres",
    propertyType: "Character Home",
    listingAgent: "Matt Thompson",
    agentContact: "778-867-9980",
    additionalImages: [
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3082982/4e27da43-a050-44b8-8cc7-1343b7d549ad.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3082982/69416d9d-24ea-4a5e-ab52-fb0a674e0f75.webp",
      "https://photos.alphotoscdn.com/file/al-photos-s3/VancouverBridge/R3082982/f6bd66b5-d8a7-4413-9250-52c8327c01e3.webp",
    ],
  },
];

export default function FeaturedListings() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedListing, setSelectedListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? listings.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= listings.length - 3 ? 0 : prev + 1));
  };

  const openPopup = (listing) => {
    setSelectedListing(listing);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setSelectedListing(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    if (selectedListing) {
      setCurrentImageIndex((prev) =>
        prev === selectedListing.additionalImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedListing) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedListing.additionalImages.length - 1 : prev - 1
      );
    }
  };

  const getVisibleListings = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % listings.length;
      result.push(listings[index]);
    }
    return result;
  };

  const visibleListings = getVisibleListings();
  const totalDots = listings.length;

  return (
    <section className="w-full bg-white py-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-6">
          <p className="text-xl font-medium tracking-widest text-black mb-2">
            FEATURED
          </p>
          <h2 className="md:text-5xl text-3xl font-bold tracking-tight">
            LISTINGS
          </h2>
        </div>

        {/* Navigation Arrows - Top Right */}
        <div className="flex justify-end gap-6 mb-4">
          <button
            onClick={handlePrev}
            className="flex items-center text-xl justify-center cursor-pointer transition-colors duration-300"
            aria-label="Previous listing"
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center text-xl cursor-pointer transition-colors duration-300"
            aria-label="Next listing"
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {visibleListings.map((listing, index) => (
            <div
              key={`${listing.address}-${currentIndex}-${index}`}
              className="flex flex-col hover:scale-95 transition-all duration-700 ease-in-out"
            >
              {/* Image */}
              <div className="relative h-70 overflow-hidden mb-0">
                <img
                  src={listing.image}
                  alt={listing.address}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details - Black Background */}
              <div className="bg-black text-white p-6 grow">
                <h3 className="text-2xl font-normal mb-1">
                  {listing.address}
                </h3>
                <p className="text-2xl text-gray-300 mb-4">{listing.city}</p>
                <p className="text-3xl font-light text-[#888888] mb-4">
                  {listing.price}
                </p>
                <div className="flex gap-4 text-md">
                  <span>
                    <strong>{listing.beds}</strong> bed
                  </span>
                  <span>|</span>
                  <span>
                    <strong>{listing.baths}</strong> bath
                  </span>
                  <span>|</span>
                  <span>
                    <strong>{listing.sqft}</strong>
                  </span>
                </div>
              </div>

              {/* More Details Button */}
              <button
                
                className="bg-[#929292] text-white text-left pl-6 py-4 text-xl tracking-wide transition-colors duration-300 hover:bg-[#7a7a7a]"
              >
                More details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex
                  ? "bg-gray-700"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Popup Modal */}
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-300"
                aria-label="Close popup"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image Gallery */}
              <div className="relative h-[400px] overflow-hidden">
                <img
                  src={selectedListing.additionalImages[currentImageIndex]}
                  alt={selectedListing.address}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-300"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-300"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {selectedListing.additionalImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-gray-400"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="">
                <div className="">
                  <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex items-center justify-between gap-8">
                      <p className="text-center text-[#333232e3] font-semibold">
                        {selectedListing.beds} Beds
                      </p>
                      <p className="text-center text-[#333232e3] font-semibold">
                        {selectedListing.baths} Baths
                      </p>
                      <p className="text-center text-[#333232e3] font-semibold">
                        {selectedListing.sqft}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-md text-[#333232e3] font-semibold">
                        {selectedListing.address}, {selectedListing.city}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="bg-[#d6d4d4] mb-4">
                  <div className="px-6 py-4 flex justify-between items-center">
                    <div className="text-3xl font-bold text-[#464747]">
                      {selectedListing.price}
                    </div>

                    <div>
                      <a
                        href={`tel:${selectedListing.agentContact.replace(/-/g, "")}`}
                        className="block w-full px-4 bg-black text-white text-center py-3 rounded hover:bg-gray-800 transition-colors duration-300"
                      >
                        View Listing
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}