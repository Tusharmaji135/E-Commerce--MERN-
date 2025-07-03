import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * CheckAuth component is used to control access to routes based on authentication and user role.
 * It handles redirection for login/register pages, admin/shop page protection, and unauth access cases.
 */
const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  // Case 1: If not authenticated and trying to access a page that is not login or register, redirect to login
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to={"/auth/login"} />;
  }

  // Case 2: If already authenticated and trying to access login or register pages
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    // If user is admin, redirect to admin dashboard
    if (user?.role === "admin") {
      return <Navigate to={"/admin/dashboard"} />;
    } 
    // If user is not admin, redirect to shop home
    else {
      return <Navigate to={"/shop/home"} />;
    }
  }

  // Case 3: If authenticated normal user tries to access admin routes, redirect to unauthorized page
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to={"/unauth-page"} />;
  }

  // Case 4: If authenticated admin user tries to access shop pages, redirect to admin dashboard
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to={"/admin/dashboard"} />;
  }

  // If none of the above cases match, allow access to the requested route
  return <>{children}</>;
};

export default CheckAuth;
