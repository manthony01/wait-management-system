import React, { useState } from "react";
import InfoCircleIcon from "../Icons/InfoCircleIcon";
import SelectTableNumberComponent from "../InputComponents/SelectTableNumberComponent";
import { useLocation } from "react-router";
import { useRequestAssistanceMutation } from "../../services/customer";
import { toast } from "react-toastify";

const RequestAssistance: React.FC = () => {
  const location = useLocation();
  const id = location.pathname.match(/restaurant\/(\d+)\/menu/)?.at(1);

  const restaurantId = parseInt(id ?? "0", 10);

  const [tableNumber, setTableNumber] = useState<number | undefined>();
  const [requestAssistance] = useRequestAssistanceMutation();

  const handleChangeTableNumber = (number: number) => {
    setTableNumber(number);
  };

  const sendRequestAssistance = async () => {
    if (!tableNumber) {
      toast.error(`Please enter a table number`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      await requestAssistance({
        tableid: tableNumber,
        restaurantid: restaurantId,
      }).unwrap();
      toast(`Successfully sent request for waiter`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error(`Table #${tableNumber} already requested assistance`, {
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
  };

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="Request Assistance">
        <button
          className="drawer-button btn btn-square swap w-12 h-12 place-items-center bg-base-100 hover:bg-base-300 border-none"
          onClick={() => {
            if (document) {
              (
                document.getElementById(
                  `restaurant-${restaurantId}-request-assistance`
                ) as HTMLFormElement
              ).showModal();
            }
          }}
        >
          <InfoCircleIcon />
        </button>
      </div>
      <dialog
        id={`restaurant-${restaurantId}-request-assistance`}
        className="modal modal-bottom sm:modal-middle overflow-x-scroll"
      >
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Request Waiter Assistance</h3>
          <SelectTableNumberComponent
            restaurantId={restaurantId}
            tableNumber={tableNumber}
            setTableNumber={handleChangeTableNumber}
          />
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-info w-full"
              onClick={sendRequestAssistance}
            >
              Request Assistance
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default RequestAssistance;
