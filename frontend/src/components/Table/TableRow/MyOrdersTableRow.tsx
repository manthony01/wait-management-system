import React from "react";
import { CustomerOrderResponse } from "../../../types";
import { useNavigate } from "react-router-dom";
import { useGetRestaurantQuery } from "../../../services/customer";
import { getObjectPath } from "../../../utils/utilFunctions";

type Props = {
  order: CustomerOrderResponse;
  status: string;
};

const MyOrdersTableRow: React.FC<Props> = ({ order, status }) => {
  const navigate = useNavigate();
  const restaurant = useGetRestaurantQuery(order.restaurantid);
  if (
    restaurant.isLoading ||
    restaurant.isError ||
    restaurant.isFetching ||
    restaurant.isUninitialized
  )
    return <>404</>;

  return (
    <tr
      onClick={() => navigate(`/customer/order/${order.id}`)}
      className="hover hover:cursor-pointer"
    >
      <th>
        <img
          src={getObjectPath(restaurant.data.imagepath)}
          className="w-16 h-16 object-cover"
        />
      </th>
      <th>{restaurant.data.name}</th>
      <th>{order.id}</th>
      <th>{status}</th>
    </tr>
  );
};

export default MyOrdersTableRow;
