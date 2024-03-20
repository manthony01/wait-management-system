import React from "react";
import { useGetMenuItemQuery } from "../../services/customer";
import { Order } from "../../types";
import LoadingPage from "../../pages/errors/LoadingPage";
import { getObjectPath } from "../../utils/utilFunctions";
import MinusCircle from "../Icons/MinusCircle";
import PlusCircle from "../Icons/PlusCircle";
import CrossCircle from "../Icons/CrossCircle";

type OrderItemProps = {
  order: Order;
  modifyOrderItemQuantity: (menuid: number, quantity: number) => void;
  deleteOrderItem: (menuid: number) => void;
};

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  modifyOrderItemQuantity,
  deleteOrderItem,
}) => {
  const { data, isLoading, isError, isUninitialized } = useGetMenuItemQuery(
    order.menuitemid
  );

  const incQuantity = () =>
    modifyOrderItemQuantity(order.menuitemid, order.quantity + 1);

  const decQuantity = () => {
    if (order.quantity === 1) {
      deleteOrderItem(order.menuitemid);
      return;
    }
    modifyOrderItemQuantity(order.menuitemid, order.quantity - 1);
  };

  if (isLoading || isError || isUninitialized) {
    return <LoadingPage />;
  }
  return (
    <>
      <hr className="my-2 h-0.5 border-t-0 bg-base-300" />
      <div className="flex items-center">
        <img
          src={getObjectPath(data.imagepath)}
          className="w-24 h-24 object-cover rounded"
        />
        <div className="flex flex-col items-center mx-auto justify-center gap-y-2">
          <span className="text-md font-semibold px-4 text-center line-clamp-2">
            {data.title}
          </span>
          <div className="flex flex-row select-none rounded-full bg-base-300">
            <button
              onClick={decQuantity}
              className={`outline-none border-none`}
            >
              {order.quantity === 1 ? <CrossCircle /> : <MinusCircle />}
            </button>
            <div className="mx-7 select-none my-auto">{order.quantity}</div>
            <button onClick={incQuantity}>
              <PlusCircle />
            </button>
          </div>
          <span className="text-sm">
            ${(order.quantity * data.cost).toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export default OrderItem;
