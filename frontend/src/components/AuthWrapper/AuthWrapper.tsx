import React from "react";
import { selectCurrentToken } from "../../slices/auth";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthWrapper: React.FC = () => {
  const token = useSelector(selectCurrentToken);
  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default AuthWrapper;
