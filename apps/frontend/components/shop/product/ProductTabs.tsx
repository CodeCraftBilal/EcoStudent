import ProductReviews from "./ProductReviews";
import ProductLocation from "./ProductLocation";

interface ProductTabsProps {
  description: string;
  specifications?: { [key: string]: string };
  reviews: any[];
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  distance: number;
}

export default function ProductTabs({
  description,
  specifications,
  reviews,
  location,
  distance,
}: ProductTabsProps) {
  const tabs = [
    { id: "description", name: "Description" },
    { id: "specifications", name: "Specifications" },
    { id: "reviews", name: `Reviews (${reviews.length})` },
    { id: "location", name: "Location" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:cursor-pointer`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-5 p-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-4">Product Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {description
              ? description
              : "No description available for this product."}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specifications &&
              Object.entries(specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium text-gray-600">{key}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <ProductReviews reviews={reviews} />
        </div>

        <div>
          {/* <ProductLocation location={location} distance={distance} /> */}
        </div>
      </div>
    </div>
  );
}
