import React from "react";
import { useGetRestaurantQuery } from "../../services/customer";
import LoadingPage from "../errors/LoadingPage";

type RestaurantInfoProps = {
  restaurantId: number;
};

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurantId }) => {
  const { data, isLoading, isError, isUninitialized } =
    useGetRestaurantQuery(restaurantId);
  if (isLoading || isError || isUninitialized) {
    return <LoadingPage />;
  }
  return (
    <div className="flex flex-col gap-3 mt-5">
      <h1 className="font-semibold text-2xl">Restaurant</h1>
      <h1 className="">{data.name}</h1>
    </div>
  );
};

export default RestaurantInfo;
