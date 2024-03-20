import React from "react";
import { Link } from "react-router-dom";
import { setCredentials } from "../../slices/auth";
import { useDispatch } from "react-redux";

type AvatarIconProps = {
  imagePath: string;
};

const AvatarIcon: React.FC<AvatarIconProps> = ({
  imagePath,
}: AvatarIconProps) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(setCredentials({ user: null, token: null }));
    localStorage.clear();
  };

  return (
    <>
      <div className="dropdown">
        <div
          tabIndex={0}
          className="btn btn-square swap w-12 h-12 place-items-center bg-base-100 hover:bg-base-300 border-none"
        >
          <div className="avatar">
            <div className="w-6 h-6 rounded-full">
              <img src={imagePath} />
            </div>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 right-0"
        >
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          <li>
            <Link to="/profile/orders">My Orders</Link>
          </li>
          <li>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </>
  );
};
export default AvatarIcon;
