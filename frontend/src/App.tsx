import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { Home } from "./pages/Home";
import "./App.css";
import MenuEditPage from "./pages/manager/MenuEdit";
import Navbar from "./components/Navbar/Navbar";
import CustomerMenu from "./pages/customer/customerMenu";
import RestaurantCreatePage from "./pages/manager/RestaurantCreate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderPage from "./pages/order/OrderPage";
import StaffOrders from "./pages/Staff/StaffOrders/StaffOrders";
import AuthWrapper from "./components/AuthWrapper/AuthWrapper";
import LoginPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import RestaurantPage from "./pages/restaurant/RestaurantPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProfileOrders from "./pages/profile/ProfileOrders";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <Routes>
        <Route path="" element={<Home />}></Route>
        <Route element={<AuthWrapper />}>
          <Route
            path="/manager/restaurant/menu/:restaurantId"
            element={<MenuEditPage />}
          />
          <Route
            path="/manager/restaurant/:restaurantId"
            element={<RestaurantPage />}
          />
          <Route
            path="/manager/restaurant/create"
            element={<RestaurantCreatePage />}
          />
          <Route path="/restaurant/:id/menu" element={<CustomerMenu />} />
          <Route path="/customer/order/:orderId" element={<OrderPage />} />
          <Route
            path="/staff/restaurant/:restaurantId/orders"
            element={<StaffOrders />}
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/profile/orders" element={<ProfileOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
