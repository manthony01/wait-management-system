import React, { useEffect, useState } from "react";
import NavButton from "./NavButton";
import CartIcon from "../Icons/CartIcon";
import { Order, TotalOrder } from "../../types";
import RestaurantOrder from "./RestaurantOrder";
import { useCreateOrderMutation } from "../../services/customer";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const OrderSideBar: React.FC = () => {
  const [createOrder] = useCreateOrderMutation();

  const totalOrder: TotalOrder = JSON.parse(
    localStorage.getItem("order") ?? "{}"
  );

  // Callback to refetch when clicking the cart icon
  const [update, setUpdate] = useState(false);
  const triggerUpdate = () => {
    setUpdate(!update);
  };
  useEffect(() => {
    triggerUpdate();
  }, []);

  const updateRestaurantOrder = (restaurantId: number, order: Order[]) => {
    if (order.length === 0) {
      delete totalOrder[restaurantId];
    } else {
      totalOrder[restaurantId] = order;
    }
    localStorage.setItem("order", JSON.stringify(totalOrder));
    setUpdate(!update);
    window.dispatchEvent(new Event("storage"));
  };

  const sendRestaurantOrder = (
    restaurantid: number,
    tableid: number,
    comment: string
  ) => {
    const orders = totalOrder[restaurantid];
    createOrder({ tableid, restaurantid, comment, orderitems: orders })
      .unwrap()
      .then((response) => {
        toast(
          <Link to={`/customer/order/${response.id}`} className="text-info">
            Order successfully submitted - #{response.id}
          </Link>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        delete totalOrder[restaurantid];
        localStorage.setItem("order", JSON.stringify(totalOrder));
        setUpdate(!update);
        window.dispatchEvent(new Event("storage"));
      })
      .catch((err) => {
        toast(err);
      });
  };

  const renderOrders = () => {
    const restaurantIds = Object.keys(totalOrder).map((restaurantId) =>
      parseInt(restaurantId, 10)
    );
    return (
      <div className="flex flex-col">
        {restaurantIds.length === 0 ? (
          <h1 className="text-center text-lg font-semibold mt-80">
            Add an item to order
          </h1>
        ) : (
          restaurantIds.map((restaurantId) => (
            <RestaurantOrder
              key={`restaurant-order-${restaurantId}`}
              restaurantId={restaurantId}
              order={totalOrder[restaurantId]}
              updateRestaurantOrder={updateRestaurantOrder}
              sendRestaurantOrder={sendRestaurantOrder}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <>
      <div className="drawer drawer-end">
        <input id="order-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <NavButton
            isDrawerButton={true}
            drawerId="order-drawer"
            triggerUpdateOrder={triggerUpdate}
          >
            <CartIcon />
          </NavButton>
        </div>
        <div className="drawer-side z-50">
          <label htmlFor="order-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full h-fit bg-base-200 text-base-content">
            {/* Sidebar content here */}
            {renderOrders()}
          </ul>
        </div>
      </div>
    </>
  );
};

export default OrderSideBar;
