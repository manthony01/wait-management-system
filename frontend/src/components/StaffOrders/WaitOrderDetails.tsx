import React from "react";
import { CustomerOrder } from "../../types";
import { useGetMenuItemQuery, useGetOrderQuery } from "../../services/customer";
import LoadingPage from "../../pages/errors/LoadingPage";
import { useUpdateOrderStatusMutation } from "../../services/staff";
import { toast } from "react-toastify";
import { getObjectPath } from "../../utils/utilFunctions";
import SectionContainer from "../../containers/sectionContainer";
import PageContainer from "../../containers/pageContainer";
type OrderDetailsProps = {
  order: CustomerOrder;
  onSelectOrder: (order: CustomerOrder | null) => void;
};

const WaitOrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onSelectOrder,
}) => {
  const {
    data: menuItem,
    isLoading: isMenuItemLoading,
    isError: isMenuItemError,
    isUninitialized: isMenuItemUninitialized,
  } = useGetMenuItemQuery(order.menuitemid);

  const {
    data: orderDetails,
    isLoading: isOrderDetailsLoading,
    isError: isOrderDetailsError,
    isUninitialized: isOrderDetailsUninitialized,
  } = useGetOrderQuery(order.orderid);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  if (isMenuItemLoading || isMenuItemError || isMenuItemUninitialized) {
    return <LoadingPage />;
  }
  if (
    isOrderDetailsLoading ||
    isOrderDetailsError ||
    isOrderDetailsUninitialized
  ) {
    return <LoadingPage />;
  }
  return (
    <PageContainer>
      <div className="h-full flex flex-col justify-between">
        <div className="flex h-full flex-col justify-between">
          <div className="w-full flex flex-grow">
            <div className="w-full flex flex-col">
              <SectionContainer>
                <div className="w-full border-b border-b-neutral">
                  <span className="font-bold">Order ID:</span> {order.orderid}
                </div>
              </SectionContainer>
              <div>
                <span className="font-light text-lg">Items:</span>
              </div>
              <div className="flex flex-row items-center justify-between pl-3">
                <div>
                  <p className="gap-8">
                    {order.quantity}x {menuItem.title}
                  </p>
                </div>
                <div className="flex flex-row items-center">
                  <img
                    src={getObjectPath(menuItem.imagepath)}
                    className="w-16 h-16"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-5">
                <span>Deliver to table No {orderDetails.tableid}</span>
              </div>
            </div>
          </div>
          <div className="w-full h-16 pt-32">
            <button
              className="w-full h-full btn btn-primary rounded-none "
              onClick={() => {
                updateOrderStatus({
                  order_id: order.orderid,
                  menu_id: order.menuitemid,
                  orderstatus: "served",
                })
                  .unwrap()
                  .then(() => onSelectOrder(null))
                  .catch(() =>
                    toast.error(`Failed to update order status`, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    })
                  );
              }}
            >
              Mark as served
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WaitOrderDetails;
