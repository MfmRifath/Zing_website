import React from "react";

interface stores {
  name: string;
  description: string;
  imageUrl: string;
  onClick: () => void; // Add onClick prop
}

const ShopCard: React.FC<stores> = ({ name, description, imageUrl, onClick }) => {
  return (
    <div
      className="border rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition duration-200"
      onClick={onClick} // Handle click event
    >
      <img src={imageUrl} alt={name} className="h-40 w-full object-cover rounded-md" />
      <h2 className="text-lg font-bold mt-2">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ShopCard;