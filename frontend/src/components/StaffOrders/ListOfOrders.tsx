import React, { useEffect, useState } from "react";
import { useGetOrdersByStatusQuery } from "../../services/staff";
import { CustomerOrder } from "../../types";
import { toast } from "react-toastify";
import styles from "./ListOfOrders.module.css";
import Notification from "./Notification";

type OrdersListProps = {
  restaurantId: string;
  onSelectOrder: (order: CustomerOrder) => void;
  status: string;
};

const WaitOrdersList: React.FC<OrdersListProps> = ({
  restaurantId,
  onSelectOrder,
  status,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(
    null
  );

  const [prevOrder, setPrevOrder] = useState<number | null>(null);

  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useGetOrdersByStatusQuery(
    {
      restaurant_id: parseInt(restaurantId ?? "0", 10),
      status: status,
    },
    { pollingInterval: 3000 }
  );

  useEffect(() => {
    if (orderData) {
      const newOrders = prevOrder
        ? orderData.filter((order) => order.id > prevOrder)
        : orderData;
      for (const newOrder of newOrders) {
        toast(<Notification order={newOrder} />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setPrevOrder(orderData.at(-1)?.id ?? null);
    }
  }, [orderData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !orderData) {
    console.error(error);
    return <div>Error loading orders.</div>;
  }
  const orders = orderData.map((order) => {
    const items = order.orderitems.map((item) => ({
      ...item,
      time: order.ordered_at,
    }));
    return { ...order, orderitems: items };
  });
  const flatOrderData = orders.flatMap((order) => order.orderitems);
  return (
    <div className={`${styles.block} h-screen w-full pt-12 overflow-scroll bg`}>
      {flatOrderData.map((item, index) => {
        const time = new Date(item.time);
        time.setHours((time.getHours() - 2) % 12);
        return (
          <div
            key={index}
            className="border-b border-neutral-content w-full h-16"
          >
            <div
              onClick={() => {
                onSelectOrder(item);
                setSelectedOrder(item);
              }}
              className={`w-full h-full inline-flex items-center justify-between px-3 font-bold
                          ${
                            item === selectedOrder
                              ? "border-l-8 border-accent"
                              : "border-l-8 border-transparent"
                          }`}
            >
              <div>
                <div>
                  <span className="mr-12">Order No: {item.orderid}</span>{" "}
                </div>
                <div>
                  <span className="font-normal text-sm">
                    {item.quantity} items
                  </span>
                </div>
              </div>
              <div>
                <span className="font-normal italic">
                  {time.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WaitOrdersList;
