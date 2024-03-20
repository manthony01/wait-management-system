import React, { useEffect, useState } from "react";
import { useGetAssistanceRequestsQuery } from "../../services/staff";
import { RequestAssistanceResponse } from "../../types";
import { toast } from "react-toastify";
import styles from "../StaffOrders/ListOfOrders.module.css";

type Props = {
  restaurantId: string;
  onSelectRequest: (request: RequestAssistanceResponse) => void;
};

const TableRequestList: React.FC<Props> = ({
  restaurantId,
  onSelectRequest,
}) => {
  const [selectedRequest, setSelectedRequest] =
    useState<RequestAssistanceResponse | null>(null);

  const [prevRequest, setPrevRequest] = useState<number | null>(null);

  const {
    data: assistanceData,
    isLoading,
    isError,
    error,
  } = useGetAssistanceRequestsQuery(
    {
      restaurant_id: parseInt(restaurantId ?? "0", 10),
    },
    { pollingInterval: 3000 }
  );

  useEffect(() => {
    if (assistanceData) {
      const newRequests = prevRequest
        ? assistanceData.filter((request) => request.requestid > prevRequest)
        : assistanceData;
      for (const newRequest of newRequests) {
        toast(`New assistance request at table:\n ${newRequest.tableid}`, {
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
      setPrevRequest(assistanceData.at(-1)?.requestid ?? null);
    }
  }, [assistanceData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !assistanceData) {
    console.error(error);
    return <div>Error loading orders.</div>;
  }
  return (
    <div className={`${styles.block} h-screen w-full pt-12 overflow-scroll bg`}>
      {assistanceData.map((item, index) => {
        const time = new Date(item.requested_at);
        time.setHours((time.getHours() - 2) % 12);
        return (
          <div
            key={index}
            className="border-b border-neutral-content w-full h-16"
          >
            <div
              onClick={() => {
                onSelectRequest(item);
                setSelectedRequest(item);
              }}
              className={`w-full h-full inline-flex items-center justify-between px-3 font-bold
                          ${
                            item === selectedRequest
                              ? "border-l-8 border-accent"
                              : "border-l-8 border-transparent"
                          }`}
            >
              <span>{`Table: ${item.tableid}`}</span>
              <span className="font-normal italic">
                {time.toLocaleTimeString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableRequestList;
