import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Define the type for user details
type UserDetails = {
  name?: string;
  role?: string;
  email?: string;
};

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true); // State for loading
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // State for user details

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true); // Start loading
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const db = getFirestore();
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserDetails(userDoc.data() as UserDetails);
          } else {
            console.error("No user document found.");
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Welcome to Zing</h1>
        <p className="text-lg text-gray-600">
          Boost your business by showcasing your shop and products on our platform. Gain more visibility and connect with customers directly.
        </p>
        <p className="text-xl font-semibold text-gray-800 mt-4">
          You can continue on our mobile app to access our services.
        </p>
        {userDetails && (
          <p className="text-xl font-bold text-green-700">
            Hello, {userDetails.name || "Shop Owner"}! You are logged in.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="p-6 border rounded-lg shadow-md bg-gradient-to-r from-gray-100 to-gray-50"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-3">Exclusive for Shop Owners</h2>
          <p className="text-gray-700 text-lg">
            Only shop owners can market their shops and products on Zing.
          </p>
        </motion.div>

        <motion.div
          className="p-6 border rounded-lg shadow-md bg-gradient-to-r from-gray-100 to-gray-50"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-3">Wide Reach</h2>
          <p className="text-gray-700 text-lg">
            Showcase your products to a broad audience and drive more foot traffic to your store.
          </p>
        </motion.div>

        <motion.div
          className="p-6 border rounded-lg shadow-md bg-gradient-to-r from-gray-100 to-gray-50"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-3">Simple Payment Process</h2>
          <p className="text-gray-700 text-lg">
            Pay a flat rate of 1000 LKR per month to gain full access to our marketing features.
          </p>
        </motion.div>

        <motion.div
          className="p-6 border rounded-lg shadow-md bg-gradient-to-r from-gray-100 to-gray-50"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-3">Subscription Plan</h2>
          <p className="text-gray-700 text-lg">
            Market your shop for just 1000 LKR per month. Payment can only be made by shop owners.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;