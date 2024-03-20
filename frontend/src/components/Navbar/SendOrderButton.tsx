import React, { useState } from "react";
import { useGetMenuItemsQuery } from "../../services/customer";
import LoadingPage from "../../pages/errors/LoadingPage";
import { Order } from "../../types";
import TextAreaInputComponent from "../InputComponents/TextAreaInputComponent";
import SelectTableNumberComponent from "../InputComponents/SelectTableNumberComponent";

type SendOrderButtonProps = {
  restaurantId: number;
  order: Order[];
  sendRestaurantOrder: (
    restaurantid: number,
    tableid: number,
    comment: string
  ) => void;
};

const SendOrderButton: React.FC<SendOrderButtonProps> = ({
  restaurantId,
  order,
  sendRestaurantOrder,
}) => {
  const menuItemData = useGetMenuItemsQuery(order.map((o) => o.menuitemid));

  const [tableNumber, setTableNumber] = useState<number | undefined>();
  const [comment, setComment] = useState("");

  const handleSendOrder = () => {
    if (tableNumber === undefined) return;
    sendRestaurantOrder(restaurantId, tableNumber, comment);
  };

  if (menuItemData.data?.length === 0) {
    return <></>;
  }
  let totalCost = 0;
  for (const orderitem of order) {
    totalCost +=
      orderitem.quantity *
      (menuItemData.data?.find((item) => item.id === orderitem.menuitemid)
        ?.cost ?? 0);
  }
  if (
    menuItemData.isLoading ||
    menuItemData.isError ||
    menuItemData.isUninitialized
  ) {
    return <LoadingPage />;
  }
  return (
    <>
      <button
        className="btn btn-accent text-accent-content rounded-full"
        onClick={() => {
          if (document) {
            (
              document.getElementById(
                `restaurant-${restaurantId}-order-modal`
              ) as HTMLFormElement
            ).showModal();
          }
        }}
      >
        Send Order - ${totalCost.toFixed(2)}
      </button>
      <dialog
        id={`restaurant-${restaurantId}-order-modal`}
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box shadow-none">
          <h3 className="font-bold text-lg">SEND YOUR ORDER</h3>
          <div className="form-control justify-center mt-3">
            <SelectTableNumberComponent
              restaurantId={restaurantId}
              tableNumber={tableNumber}
              setTableNumber={(number: number) => setTableNumber(number)}
            />
            <TextAreaInputComponent
              label={"Note"}
              placeholder={"No cheese"}
              value={comment}
              handleChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="modal-action justify-evenly">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-accent" onClick={handleSendOrder}>
              Send
            </button>
            <button className="btn btn-error">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default SendOrderButton;
