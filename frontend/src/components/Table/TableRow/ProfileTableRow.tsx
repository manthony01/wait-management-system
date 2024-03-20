import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetRestaurantQuery } from "../../../services/customer";
import { getObjectPath } from "../../../utils/utilFunctions";

type Props = {
  restaurantid: number;
};

const ProfileTableRow: React.FC<Props> = ({ restaurantid }) => {
  const navigate = useNavigate();
  const restaurant = useGetRestaurantQuery(restaurantid);
  if (
    restaurant.isLoading ||
    restaurant.isError ||
    restaurant.isFetching ||
    restaurant.isUninitialized
  )
    return <>404</>;

  return (
    <div className="hover:cursor-pointer flex flex-row bg-base-100 w-full p-3">
      <img
        src={getObjectPath(restaurant.data.imagepath)}
        className="w-96 h-24 object-cover"
      />
      <div className="flex flex-col w-full justify-center pl-4 mr-4">
        <div>
          <span className="font-bold">{restaurant.data.name}</span>
        </div>
        <div>{restaurant.data.comment}</div>
      </div>
      <div className="flex flex-col w-full justify-center">
        <div
          onClick={() => navigate(`/restaurant/${restaurant.data.id}/menu`)}
          className="bg-black text-white rounded w-56 h-12 flex justify-center items-center font-bold"
        >
          View Restaurant
        </div>
      </div>
    </div>
  );
};

export default ProfileTableRow;
