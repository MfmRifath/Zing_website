import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Define the type for user details
type UserDetails = {
  name?: string;
  role?: string;
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // Typed userDetails state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    let unsubscribeFirestore: (() => void) | null = null;

    // Listen to Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setLoading(true);

        // Set up a Firestore listener for the user's document
        const userDocRef = doc(db, "users", currentUser.uid);
        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserDetails(docSnapshot.data() as UserDetails);
            } else {
              setUserDetails(null);
              console.error("User document does not exist!");
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error listening to Firestore:", error);
            setLoading(false);
          }
        );
      } else {
        setIsLoggedIn(false);
        setUserDetails(null);
        setLoading(false);
        if (unsubscribeFirestore) unsubscribeFirestore();
      }
    });

    // Clean up listeners on component unmount
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserDetails(null);
      alert("You have been logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-dashed border-transparent rounded-full border-t-blue-300 border-b-blue-700 animate-spin-slow"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      {/* Brand */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
          <span className="text-blue-500 font-bold text-lg">Z</span>
        </div>
        <h1 className="text-lg font-bold">Zing</h1>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center">
        <Link
          to="/"
          className={`mx-2 hover:underline ${
            location.pathname === "/" ? "font-bold border-b-2 border-white" : ""
          }`}
        >
          Home
        </Link>
        {userDetails?.role === "Admin" && (
          <Link
            to="/shops"
            className={`mx-2 hover:underline ${
              location.pathname === "/shops"
                ? "font-bold border-b-2 border-white"
                : ""
            }`}
          >
            Shops
          </Link>
        )}
        <Link
          to="/policies"
          className={`mx-2 hover:underline ${
            location.pathname === "/policies"
              ? "font-bold border-b-2 border-white"
              : ""
          }`}
        >
          Policies
        </Link>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="mx-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Log Out
          </button>
        ) : (
          <Link
            to="/login"
            className={`mx-2 hover:underline ${
              location.pathname === "/login"
                ? "font-bold border-b-2 border-white"
                : ""
            }`}
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </div>

      {/* Dropdown for mobile */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-600 text-white flex flex-col items-center md:hidden">
          <Link
            to="/"
            className="py-2 w-full text-center hover:bg-blue-700"
            onClick={toggleMenu}
          >
            Home
          </Link>
          {userDetails?.role === "Admin" && (
            <Link
              to="/shops"
              className="py-2 w-full text-center hover:bg-blue-700"
              onClick={toggleMenu}
            >
              Shops
            </Link>
          )}
          <Link
            to="/policies"
            className="py-2 w-full text-center hover:bg-blue-700"
            onClick={toggleMenu}
          >
            Policies
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="py-2 w-full text-center bg-red-600 hover:bg-red-700"
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/login"
              className="py-2 w-full text-center hover:bg-blue-700"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Display User Details */}
      {userDetails && (
        <div className="hidden md:flex items-center ml-4">
          <span className="text-sm font-medium">
            Welcome, {userDetails.name || "User"}
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;