import React from "react";
import { CustomerOrder, CustomerOrderResponse } from "../../types";
import { useGetMenuItemQuery } from "../../services/customer";
import LoadingDots from "../LoadingIcons/LoadingDots";

type NotificationProps = {
  order: CustomerOrderResponse;
};

const OrderItemRow: React.FC<{ orderitem: CustomerOrder }> = ({
  orderitem,
}) => {
  const { data, isLoading, isError, isUninitialized } = useGetMenuItemQuery(
    orderitem.menuitemid
  );
  if (isLoading || isError || isUninitialized) {
    return <LoadingDots />;
  }
  return (
    <li>
      - {data.title} x {orderitem.quantity}
    </li>
  );
};

const Notification: React.FC<NotificationProps> = ({
  order,
}: NotificationProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">New Order - {order.id}</h1>
      <span>Send to table: {order.tableid}</span>
      <span>Order items:</span>
      <ul>
        {order.orderitems.map((orderitem) => (
          <OrderItemRow
            orderitem={orderitem}
            key={`order-${orderitem.quantity}-${orderitem.menuitemid}`}
          />
        ))}
      </ul>
    </div>
  );
};

export default Notification;
