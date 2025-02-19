import React from "react";

interface AffiliateProductDetailProps {
  product: {
    title: string;
    description: string | string[];
    imageSources: string[];
    productLink: string; // Add the productLink field
  };
  onClose: () => void;
}

const AffiliateProductDetail: React.FC<AffiliateProductDetailProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {product.imageSources.map((imageSrc, index) => (
          <div
            key={index}
            className="relative w-full h-64 bg-gray-100 rounded overflow-hidden"
          >
            <img
              src={imageSrc}
              alt={`Product Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mb-6">
        {Array.isArray(product.description)
          ? product.description.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))
          : product.description}
      </div>

      {/* "SHOP NOW WITH AMAZON" Button */}
      <div className="flex justify-center mt-4">
        <a
          href={product.productLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition"
        >
          SHOP NOW WITH AMAZON
        </a>
      </div>

      {/* Close Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AffiliateProductDetail;
