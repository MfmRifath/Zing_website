import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShopList from "./pages/ShopingList";
import ShopDetails from "./pages/ShopingDetails";
import PolicyPage from "./pages/PolicyPage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ProtectedRoute from "./components/ProtectRoutes";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      const auth = getAuth();
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role || null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    };

    const authListener = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        fetchUserRole();
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => authListener();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Shop List Route - Restricted to Admins */}
        <Route
          path="/shops"
          element={
            <ProtectedRoute isAllowed={userRole === "Admin"} redirectTo="/">
              <ShopList />
            </ProtectedRoute>
          }
        />

        {/* Shop Details Dynamic Route */}
        <Route
          path="/shops/:shopId"
          element={
            <ProtectedRoute isAllowed={userRole === "Admin"} redirectTo="/">
              <ShopDetails />
            </ProtectedRoute>
          }
        />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Policies Route */}
        <Route path="/policies" element={<PolicyPage />} />
      </Routes>
    </Router>
  );
};

export default App;