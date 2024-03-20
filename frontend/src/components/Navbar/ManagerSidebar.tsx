import React from "react";
import { Link } from "react-router-dom";
import { useGetOwnedRestaurantsQuery } from "../../services/staff";
import LoadingPage from "../../pages/errors/LoadingPage";
import { KITCHENSTAFF, MANAGER, WAITSTAFF } from "../../const";
import CookIcon from "../Icons/CookIcon";
import { Restaurant } from "../../types";
import WaitStaffIcon from "../Icons/WaitStaffIcon";
import ManagerIcon from "../Icons/ManagerIcon";

const ManagerSidebar: React.FC = () => {
  const { data, isLoading, isError, isUninitialized } =
    useGetOwnedRestaurantsQuery({});

  const renderRoleIcon = (
    restaurant: Restaurant & {
      role: string;
    }
  ) => {
    if (restaurant.role === MANAGER) {
      return <ManagerIcon />;
    }
    if (restaurant.role === KITCHENSTAFF) {
      return <CookIcon />;
    }
    if (restaurant.role === WAITSTAFF) {
      return <WaitStaffIcon />;
    }
  };

  const renderRestaurants = () => {
    return (
      <>
        {data?.map((restaurant) => (
          <li key={`sidebar-restaurant-${restaurant.id}`}>
            <details open={false}>
              <summary>
                {renderRoleIcon(restaurant)}
                {restaurant.role === MANAGER ? (
                  <Link to={`/manager/restaurant/${restaurant.id}`}>
                    {restaurant.name}
                  </Link>
                ) : (
                  <span>{restaurant.name}</span>
                )}
              </summary>
              <ul>
                <li>
                  <Link to={`/staff/restaurant/${restaurant.id}/orders`}>
                    Pending Orders
                  </Link>
                </li>
                {restaurant.role === MANAGER && (
                  <li>
                    <Link to={`/manager/restaurant/menu/${restaurant.id}`}>
                      Edit Menu
                    </Link>
                  </li>
                )}
              </ul>
            </details>
          </li>
        ))}
      </>
    );
  };

  if (isLoading || isError || isUninitialized) {
    return <LoadingPage />;
  }
  return (
    <div className="drawer drawer-end w-12 h-12">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="my-drawer"
          className="btn btn-square swap swap-rotate drawer-button bg-base-100 border-none"
        >
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" />

          {/* hamburger icon */}
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-56 sm:w-80 h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <summary>My restaurants</summary>
            <ul>{renderRestaurants()}</ul>
          </li>
          <li>
            <Link to="/manager/restaurant/create">Register a Restaurant</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ManagerSidebar;
