import React, { useEffect, useState } from "react";
import WaitStaffSidebar from "../../../components/Sidebars/WaitStaffSidebar";
import { useParams } from "react-router-dom";
import { useGetOrdersByStatusQuery } from "../../../services/staff";
import { CustomerOrder, RequestAssistanceResponse } from "../../../types";
import TableRequestList from "../../../components/TableAssitanceRequests/TableRequestList";
import TableRequestDetails from "../../../components/TableAssitanceRequests/TableRequestDetails";
import WaitOrderDetails from "../../../components/StaffOrders/WaitOrderDetails";
import KitchenOrderDetails from "../../../components/StaffOrders/KitchenOrderDetails";
import ListOfOrders from "../../../components/StaffOrders/ListOfOrders";
import { useGetRestaurantQuery } from "../../../services/customer";
import { setFocusedRestaurant } from "../../../slices/restaurant";
import { useDispatch } from "react-redux";
import LoadingPage from "../../errors/LoadingPage";

type StaffOrdersProps = {
  // restaurantId: string;
};

const StaffOrders: React.FC<StaffOrdersProps> = () => {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();

  const [selectedKitchenOrder, setSelectedKitchenOrder] =
    useState<CustomerOrder | null>(null);

  const [selectedWaitOrder, setSelectedWaitOrder] =
    useState<CustomerOrder | null>(null);

  const [selectedRequest, setSelectedRequest] =
    useState<RequestAssistanceResponse | null>(null);

  const setWaitOrder = (order: CustomerOrder) => {
    setSelectedWaitOrder(order);
    setSelectedKitchenOrder(null);
    setSelectedRequest(null);
  };
  const setKitchenOrder = (order: CustomerOrder) => {
    setSelectedKitchenOrder(order);
    setSelectedWaitOrder(null);
    setSelectedRequest(null);
  };
  const setRequest = (request: RequestAssistanceResponse) => {
    setSelectedRequest(request);
    setSelectedWaitOrder(null);
    setSelectedKitchenOrder(null);
  };

  const reset = () => {
    setSelectedWaitOrder(null);
    setSelectedKitchenOrder(null);
    setSelectedRequest(null);
  };

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const orders = useGetOrdersByStatusQuery({
    restaurant_id: parseInt(restaurantId ?? "0", 10),
    status: "prepared",
  });
  const restaurantData = useGetRestaurantQuery(parseInt(restaurantId ?? "0"));

  dispatch(setFocusedRestaurant({ focused: restaurantData.data ?? null }));
  useEffect(() => {
    return () => {
      dispatch(setFocusedRestaurant({ focused: null }));
    };
  }, []);

  useEffect(() => {
    reset();
  }, [restaurantId, activeButton]);

  if (
    restaurantData.isLoading ||
    restaurantData.isUninitialized ||
    restaurantData.isError ||
    orders.isLoading ||
    orders.isError ||
    orders.isUninitialized
  ) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-row">
      <div className="w-1/12">
        <WaitStaffSidebar
          onButtonClick={(buttonName: string) => {
            setActiveButton(buttonName);
          }}
        />
      </div>
      <div className="w-3/12 border-r border-black">
        {activeButton === "receipt" && (
          <ListOfOrders
            status="pending"
            restaurantId={restaurantId ?? "0"}
            onSelectOrder={(order) => setKitchenOrder(order)}
          />
        )}
        {activeButton === "turkey" && (
          <ListOfOrders
            status="ready"
            restaurantId={restaurantId ?? "0"}
            onSelectOrder={(order) => setWaitOrder(order)}
          />
        )}
        {activeButton === "bell" && (
          <TableRequestList
            restaurantId={restaurantId ?? "0"}
            onSelectRequest={(request) => setRequest(request)}
          />
        )}
      </div>
      <div className="w-8/12">
        {selectedWaitOrder && (
          <WaitOrderDetails
            order={selectedWaitOrder}
            onSelectOrder={(order: CustomerOrder | null) =>
              setSelectedWaitOrder(order)
            }
          />
        )}
        {selectedKitchenOrder && (
          <KitchenOrderDetails
            order={selectedKitchenOrder}
            onSelectOrder={(order: CustomerOrder | null) =>
              setSelectedKitchenOrder(order)
            }
          />
        )}
        {selectedRequest && (
          <TableRequestDetails
            request={selectedRequest}
            onSelectRequest={(request: RequestAssistanceResponse | null) =>
              setSelectedRequest(request)
            }
          />
        )}
      </div>
    </div>
  );
};

export default StaffOrders;
