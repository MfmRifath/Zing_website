import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase"; // Ensure Firebase Auth is correctly configured
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore methods

const db = getFirestore(); // Initialize Firestore

type UserDetails = {
  fullName?: string;
  role?: string;
  // Add other fields as needed
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // Function to handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Login failed! ${error.message}`);
      }
    }
  };

  // Fetch user details from Firestore
  const fetchUserDetails = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserDetails(userDoc.data() as UserDetails);
      } else {
        console.error("No such document found!");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Use Firebase's onAuthStateChanged to fetch the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserDetails(user.uid); // Fetch user details from Firestore
      } else {
        setCurrentUser(null);
        setUserDetails(null);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      {!currentUser ? (
        <form onSubmit={handleLogin}>
          <h1 className="text-2xl font-bold">Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mt-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mt-4"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">
            Login
          </button>
        </form>
      ) : (
        <div className="mt-6">
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="mt-4">Logged in as: {currentUser.email}</p>
          {userDetails ? (
            <div className="mt-4">
              <p>Full Name: {userDetails.fullName}</p>
              <p>Role: {userDetails.role}</p>
              {/* Add more fields as needed */}
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
          <button
            onClick={() => auth.signOut()}
            className="bg-red-500 text-white px-4 py-2 mt-4"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;