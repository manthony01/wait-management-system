import React from "react";
import { useGetRestaurantLoyaltyProgramQuery } from "../../services/customer";
import { PythonError } from "../../types";
import CreateLoyaltyModal from "./CreateLoyaltyModal";
import DollarIcon from "../../components/Icons/DollarIcon";
import PointIcon from "../../components/Icons/PointIcon";
import MultiplierIcon from "../../components/Icons/MultiplierIcon";
import { useGetLoyaltyUsersQuery } from "../../services/manager";
import { getObjectPath } from "../../utils/utilFunctions";

type LoyaltySectionProps = {
  restaurantId: number;
};

const LoyaltySection: React.FC<LoyaltySectionProps> = ({ restaurantId }) => {
  const loyaltyData = useGetRestaurantLoyaltyProgramQuery(restaurantId);
  const loyaltyUsers = useGetLoyaltyUsersQuery(restaurantId);

  const renderError = (error: PythonError) => {
    return (
      <>
        <span>{error.data.detail}</span>
        <button
          className="btn btn-primary w-fit mt-2"
          onClick={() => {
            if (document) {
              (
                document.getElementById(
                  `loyalty-modal-${restaurantId}`
                ) as HTMLFormElement
              ).showModal();
            }
          }}
        >
          Add Loyalty Program
        </button>
        <dialog id={`loyalty-modal-${restaurantId}`} className="modal">
          <form method="dialog" className="modal-box">
            <CreateLoyaltyModal restaurantId={restaurantId} />
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </>
    );
  };

  const renderLoyaltyDetails = () => {
    return (
      <>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <PointIcon />
            </div>
            <div className="stat-title">Points</div>
            <div className="stat-value text-accent">
              {loyaltyData.data?.minimum}pts
            </div>
            <div className="stat-desc">
              Number of points needed for <br /> customer to redeem coupon
            </div>
          </div>
          <div className="stat">
            <div className="stat-figure text-green-500">
              <DollarIcon />
            </div>
            <div className="stat-title">Coupon Value</div>
            <div className="stat-value text-green-500">
              ${loyaltyData.data?.discount}
            </div>
            <div className="stat-desc">
              Customer can redeem ${loyaltyData.data?.discount} at checkout
            </div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <MultiplierIcon />
            </div>
            <div className="stat-title">Purchase to Point Multiplier</div>
            <div className="stat-value text-secondary">
              {loyaltyData.data?.multiplier}x
            </div>
            <div className="stat-desc">
              $10 -{">"} {10 * (loyaltyData.data?.multiplier ?? 0)}pts
            </div>
          </div>
        </div>
        <h1 className="text-md font-semibold pl-3 mt-3">Participating users</h1>
        <table className="table">
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>Progress</th>
            <th>Points</th>
          </thead>
          <tbody>
            {loyaltyUsers.data?.map((loyaltyUser) => (
              <tr key={`loyal-${loyaltyUser.user.email}`}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={getObjectPath(loyaltyUser.user.imagepath)} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {loyaltyUser.user.firstname} {loyaltyUser.user.lastname}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{loyaltyUser.user.email}</td>
                <td>
                  <div className="flex gap-x-2 place-items-center">
                    <span>0</span>
                    <progress
                      className="progress progress-info w-56"
                      value={loyaltyUser.points}
                      max={loyaltyData.data?.minimum}
                    ></progress>
                    <span>{loyaltyData.data?.minimum}</span>
                  </div>
                </td>
                <td>{loyaltyUser.points}pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Your Loyalty Program</h2>
      {loyaltyData.isError && renderError(loyaltyData.error as PythonError)}
      {loyaltyData.isSuccess && renderLoyaltyDetails()}
    </div>
  );
};

export default LoyaltySection;
