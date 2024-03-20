import React from "react";
import { Order } from "../../types";
import { useGetRestaurantQuery } from "../../services/customer";
import LoadingPage from "../../pages/errors/LoadingPage";
import OrderItem from "./OrderItem";
import SendOrderButton from "./SendOrderButton";

type RestaurantOrderProps = {
  restaurantId: number;
  order: Order[];
  updateRestaurantOrder: (restaurantId: number, order: Order[]) => void;
  sendRestaurantOrder: (
    restaurantid: number,
    tableid: number,
    comment: string
  ) => void;
};

const RestaurantOrder: React.FC<RestaurantOrderProps> = ({
  restaurantId,
  order,
  updateRestaurantOrder,
  sendRestaurantOrder,
}) => {
  const restaurantData = useGetRestaurantQuery(restaurantId);

  const modifyOrderItemQuantity = (menuid: number, quantity: number) => {
    const itemIdx = order.findIndex((o) => o.menuitemid === menuid);
    const cloneOrder = [...order];
    cloneOrder[itemIdx].quantity = quantity;
    updateRestaurantOrder(restaurantId, cloneOrder);
  };

  const deleteOrderItem = (menuid: number) => {
    const itemIdx = order.findIndex((o) => o.menuitemid === menuid);
    const cloneOrder = [...order];
    cloneOrder.splice(itemIdx, 1);
    updateRestaurantOrder(restaurantId, cloneOrder);
  };

  if (
    restaurantData.isLoading ||
    restaurantData.isError ||
    restaurantData.isUninitialized
  ) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="flex flex-col mb-5">
        <h1 className="text-xs">Your order at</h1>
        <h1 className="text-lg font-semibold">{restaurantData.data.name}</h1>
        {order.map((orderitem) => {
          return (
            <OrderItem
              key={`order-${restaurantId}-${orderitem.menuitemid}`}
              order={orderitem}
              modifyOrderItemQuantity={modifyOrderItemQuantity}
              deleteOrderItem={deleteOrderItem}
            />
          );
        })}
        <hr className="my-2 h-0.5 border-t-0 bg-base-300" />
        <SendOrderButton
          restaurantId={restaurantId}
          order={order}
          sendRestaurantOrder={sendRestaurantOrder}
        />
      </div>
    </>
  );
};

export default RestaurantOrder;
