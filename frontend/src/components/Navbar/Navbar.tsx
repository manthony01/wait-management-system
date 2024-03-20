import React from "react";
import ManagerSidebar from "./ManagerSidebar";
import AvatarIcon from "../Icons/AvatarIcon";
import OrderSideBar from "./OrderSideBar";
import RequestAssistance from "./RequestAssistance";
import { useLocation } from "react-router";
import { selectCurrentUser } from "../../slices/auth";
import { useSelector } from "react-redux";
import { getObjectPath } from "../../utils/utilFunctions";
import { Link } from "react-router-dom";
import { selectCurrentRestaurant } from "../../slices/restaurant";

const Navbar: React.FC = () => {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const restaurant = useSelector(selectCurrentRestaurant);
  return (
    <>
      <div className="fixed w-full z-50" id="navbar">
        <nav className="flex border-b-2 bg-base-100 text-base-content h-12 items-center justify-between px-5">
          <div className="flex place-items-center gap-x-10">
            <Link to="/">
              <div className="flex text-xl gap-x-2 place-items-center">
                <h1 className="tracking-wider">Fiveplay</h1>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>
            </Link>
            {restaurant && <div>Restaurant: {restaurant.name}</div>}
          </div>
          <div className="flex place-items-center">
            {/restaurant\/\d+\/menu/g.test(location.pathname) && (
              <RequestAssistance />
            )}
            {user && <OrderSideBar />}
            {user && <ManagerSidebar />}
            {user ? (
              <AvatarIcon imagePath={getObjectPath(user.imagepath)} />
            ) : (
              <Link to="/auth/login">
                <button className="btn btn-ghost">Login</button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
