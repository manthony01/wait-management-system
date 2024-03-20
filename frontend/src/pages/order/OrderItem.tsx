import React from "react";
import { useGetMenuItemQuery } from "../../services/customer";
import LoadingPage from "../errors/LoadingPage";
import { getObjectPath } from "../../utils/utilFunctions";
import CookingGif from "../../assets/cooking.gif";
import ServingGif from "../../assets/serving.gif";
import ServedGif from "../../assets/served.gif";

type OrderItemProps = {
  menuItemId: number;
  quantity: number;
  status: string;
};

const OrderItem: React.FC<OrderItemProps> = ({
  menuItemId,
  quantity,
  status,
}) => {
  const { data, isLoading, isUninitialized, isError } =
    useGetMenuItemQuery(menuItemId);

  const renderStatus = () => {
    if (status === "pending") {
      return (
        <div className="flex flex-col justify-center items-center">
          <span>Status: Cooking</span>
          <img
            className="rounded-lg h-40 object-cover my-auto ml-5"
            src={CookingGif}
          />
        </div>
      );
    } else if (status === "ready") {
      return (
        <div className="flex flex-col justify-center items-center">
          <span>Status: Serving</span>
          <img
            className="rounded-lg h-40 object-cover my-auto ml-5"
            src={ServingGif}
          />
        </div>
      );
    } else if (status === "served") {
      return (
        <div className="flex flex-col justify-center items-center">
          <span>Status: Served</span>
          <img
            className="rounded-lg h-40 object-cover my-auto ml-5"
            src={ServedGif}
          />
        </div>
      );
    }
    return <></>;
  };

  if (isLoading || isError || isUninitialized) {
    return <LoadingPage />;
  }
  return (
    <div className="flex gap-x-5 items-center justify-between bg-base-100">
      <div
        className="flex 
        bg-base-100
        rounded-md
        w-3/4
        h-40
        transform 
        gap-5
        transition"
      >
        <img
          className="rounded-lg w-1/5 h-3/4 object-cover my-auto ml-5"
          src={getObjectPath(data.imagepath)}
          alt={data.title}
        />
        <div className="flex flex-col px-4 py-6 justify-center gap-y-1">
          <div className="text-lg font-bold line-clamp-1">{data.title}</div>
          <div className="text-md line-clamp-2">{data.description}</div>
          <div className="font-semibold text-sm font-['Verdana'] tracking-wide text-slate-600">
            ${data.cost.toFixed(2)} x {quantity} = $
            {(quantity * data.cost).toFixed(2)}
          </div>
        </div>
      </div>
      {renderStatus()}
    </div>
  );
};

export default OrderItem;
