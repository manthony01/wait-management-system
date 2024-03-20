import React, { useState } from "react";
import PageContainer from "../../containers/pageContainer";
import SectionContainer from "../../containers/sectionContainer";
import { useParams } from "react-router";
import {
  useApplyUserPointsMutation,
  useGetLoyaltyPointsQuery,
  useGetOrderCostQuery,
  useGetOrderQuery,
  useGetRestaurantLoyaltyProgramQuery,
} from "../../services/customer";
import LoadingPage from "../errors/LoadingPage";
import RestaurantInfo from "./RestaurantInfo";
import OrderItem from "./OrderItem";
import LoyaltyBar from "../../components/LoyaltyBar/LoyaltyBar";
import BillRow from "./BillRow";
import { raiseError, raiseNotification } from "../../utils/utilFunctions";
import { PythonError } from "../../types";

const OrderPage: React.FC = () => {
  const { orderId } = useParams();
  const { data, isLoading, isError, isUninitialized } = useGetOrderQuery(
    parseInt(orderId ?? "0"),
    { pollingInterval: 5000 }
  );
  const loyaltyData = useGetRestaurantLoyaltyProgramQuery(
    data?.restaurantid ?? 0
  );
  const loyaltyPoints = useGetLoyaltyPointsQuery(data?.restaurantid ?? 0);
  const [applyUserPoints] = useApplyUserPointsMutation();
  const costData = useGetOrderCostQuery(parseInt(orderId ?? "0"));
  const [discount, setDiscount] = useState<number[]>([]);

  const renderLoyaltyOption = () => {
    if (!loyaltyData.data) return <></>;
    if (!loyaltyPoints.data) return <></>;
    if (loyaltyPoints.data.points >= loyaltyData.data.minimum) {
      return (
        <button className="btn btn-accent" onClick={() => handleRedeemCoupon()}>
          Redeem ${loyaltyData.data.discount} coupon
        </button>
      );
    }
    return (
      <span>
        {loyaltyData.data.minimum - loyaltyPoints.data.points}pts needed to
        redeem ${loyaltyData.data.discount} coupon
      </span>
    );
  };

  const handleRedeemCoupon = async () => {
    try {
      await applyUserPoints(data?.restaurantid ?? 0).unwrap();
      raiseNotification(`Successfully applied loyalty discount`);
      setDiscount(discount.concat(1));
    } catch (error: unknown) {
      raiseError((error as PythonError).data.detail);
    }
  };

  if (
    isLoading ||
    isError ||
    isUninitialized ||
    costData.isLoading ||
    costData.isError ||
    costData.isUninitialized
  ) {
    return <LoadingPage />;
  }
  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex gap-y-1 p-5 justify-start flex-col text-left shadow-2xl rounded-lg">
          <RestaurantInfo restaurantId={data.restaurantid} />
          <div className="divider"></div>
          <h1 className="text-2xl font-semibold">Order Details</h1>
          <h1 className="text-lg font-semibold">
            Confirmation Number: <span className="font-normal">{data.id}</span>
          </h1>
          <h1 className="text-lg font-semibold">
            Table Number: <span className="font-normal">{data.tableid}</span>
          </h1>
          <label className="font-semibold text-lg">
            Comment: <span className="font-normal">{data.comment}</span>
          </label>
          <div className="divider"></div>
          <h1 className="text-2xl font-semibold">Order Items</h1>
          {data.orderitems.map((orderitem) => (
            <OrderItem
              menuItemId={orderitem.menuitemid}
              quantity={orderitem.quantity}
              status={orderitem.orderstatus}
              key={`order-${orderitem.orderid}-item-${orderitem.menuitemid}`}
            />
          ))}
          <div className="divider"></div>
          <h1 className="text-2xl font-semibold mb-2">Order Breakdown</h1>
          <div className="flex justify-between">
            <table className="table w-1/2">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.orderitems.map((item, idx) => (
                  <BillRow
                    key={`bill-${item.orderid}-${item.menuitemid}`}
                    menuItemId={item.menuitemid}
                    quantity={item.quantity}
                    index={idx}
                  />
                ))}
                {discount.length > 0 &&
                  loyaltyData.data &&
                  discount.map((i) => (
                    <tr key={`discount-${i}`}>
                      <td></td>
                      <td>Loyalty Discount</td>
                      <td>{loyaltyData.data?.discount.toFixed(2)}</td>
                      <td>1</td>
                      <td>-{loyaltyData.data?.discount.toFixed(2)}</td>
                    </tr>
                  ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="border-t-2 border-t-black">
                    $
                    {discount.length > 0 && loyaltyData.data?.discount
                      ? Math.max(
                          0,
                          costData.data -
                            loyaltyData.data.discount * discount.length
                        ).toFixed(2)
                      : costData.data.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-col gap-y-5">
              <LoyaltyBar restaurantId={data.restaurantid} />
              {renderLoyaltyOption()}
            </div>
          </div>
          <button
            className="btn btn-primary w-fit mt-5"
            onClick={() => {
              if (document) {
                (
                  document.getElementById(
                    `request-bill-modal`
                  ) as HTMLFormElement
                ).showModal();
              }
            }}
          >
            Request Bill
          </button>
          <dialog
            id="request-bill-modal"
            className="modal modal-bottom sm:modal-middle"
          >
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg">Requested Bill</h3>
              <p className="py-4">Go to front desk to pay</p>
              <div className="modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </div>
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default OrderPage;
