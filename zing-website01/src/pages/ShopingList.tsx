import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import ShopCard from "../components/ShopCart";
import { useNavigate } from "react-router-dom";

// Define the Shop type
type Shop = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

const ShopList: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]); // Updated type
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "stores"));
        const shopList: Shop[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Shop, "id">), // Map Firestore data to Shop type
        }));
        setShops(shopList);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Shops</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            name={shop.name}
            description={shop.description}
            imageUrl={shop.imageUrl}
            onClick={() => navigate(`/shops/${shop.id}`)} // Navigate to shop details
          />
        ))}
      </div>
    </div>
  );
};

export default ShopList;