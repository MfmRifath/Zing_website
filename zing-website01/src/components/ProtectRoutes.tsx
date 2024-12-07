import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAllowed, redirectTo, children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;