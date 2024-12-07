import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
  isAvailable: boolean;
  status?: string;
}

interface OwnerDetails {
  email: string;
  id: string;
  name: string;
  phone: string;
  profileImageUrl: string;
}

interface Order {
  id: string;
  deliveryMethod: string;
  placedAt: string;
  products: Product[];
}

interface StoreDetails {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  deliveryCost: number;
  deliveryOptions: string[];
  owner: OwnerDetails;
}

const StoreDetails: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<StoreDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const db = getFirestore();

        const storeDocRef = doc(db, "stores", shopId || "");
        const storeDoc = await getDoc(storeDocRef);

        if (storeDoc.exists()) {
          setStore({ id: storeDoc.id, ...storeDoc.data() } as StoreDetails);
        } else {
          console.error("Store not found");
        }

        const productsRef = collection(db, `stores/${shopId}/products`);
        const productsSnapshot = await getDocs(productsRef);
        const productList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productList);

        const ordersRef = collection(db, `stores/${shopId}/orders`);
        const ordersSnapshot = await getDocs(ordersRef);
        const orderList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(orderList);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [shopId]);

  const handleDeleteStore = async () => {
    if (!shopId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this store and all its data? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const db = getFirestore();

      const deleteSubcollection = async (subcollectionName: string) => {
        const subcollectionRef = collection(db, `stores/${shopId}/${subcollectionName}`);
        const subcollectionDocs = await getDocs(subcollectionRef);

        const deletePromises = subcollectionDocs.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      };

      await deleteSubcollection("products");
      await deleteSubcollection("orders");

      await deleteDoc(doc(db, "stores", shopId));
      alert("Store deleted successfully!");
      navigate("/shops");
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Failed to delete the store. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading store details...</div>;
  }

  if (!store) {
    return <div className="p-4 text-center text-red-500">Store not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Store Details */}
      <motion.div
        className="border rounded-lg shadow-lg p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={store.imageUrl}
          alt={store.name}
          className="w-full h-64 object-cover rounded-md shadow-lg"
        />
        <h1 className="text-4xl font-bold mt-4">{store.name}</h1>
        <p className="mt-2 text-lg">{store.description}</p>
        <p className="mt-2">Category: {store.category}</p>
        <p className="mt-2">Delivery Cost: ${store.deliveryCost}</p>
        <p className="mt-2">
          Delivery Options: {store.deliveryOptions.join(", ")}
        </p>
      </motion.div>

      {/* Owner Details */}
      <motion.div
        className="border rounded-lg shadow-md p-6 bg-gray-100"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">Owner Information</h2>
        <div className="flex items-center space-x-4 mt-4">
          <motion.img
            src={store.owner.profileImageUrl}
            alt={store.owner.name}
            className="w-16 h-16 rounded-full shadow-md"
            whileHover={{ scale: 1.1 }}
          />
          <div>
            <p className="font-semibold text-lg">{store.owner.name}</p>
            <p className="text-gray-600">{store.owner.email}</p>
            <p className="text-gray-600">{store.owner.phone}</p>
          </div>
        </div>
      </motion.div>

      {/* Products */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-md"
                />
                <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-green-600 font-semibold">Price: ${product.price}</p>
                <p className="text-yellow-500">Rating: {product.rating}/5</p>
                {product.isAvailable ? (
                  <p className="text-green-500">In Stock</p>
                ) : (
                  <p className="text-red-500">Out of Stock</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Orders */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders available.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                className="p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold">Order ID: {order.id}</h3>
                <p className="text-gray-700">Delivery Method: {order.deliveryMethod}</p>
                <p className="text-gray-700">
                  Placed At: {new Date(order.placedAt).toLocaleString()}
                </p>
                <h4 className="text-md font-bold mt-4">Products:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.name} - ${product.price} - Status:{" "}
                      {product.status || "N/A"}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Delete Button */}
      <motion.div
        className="flex justify-center"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={handleDeleteStore}
          className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Delete Store
        </button>
      </motion.div>
    </div>
  );
};

export default StoreDetails;