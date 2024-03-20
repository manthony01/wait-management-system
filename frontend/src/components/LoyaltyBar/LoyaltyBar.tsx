import React from "react";
import {
  useGetLoyaltyPointsQuery,
  useGetRestaurantLoyaltyProgramQuery,
} from "../../services/customer";
import LoyaltyPointsIcon from "../Icons/LoyaltyPointsIcon";

type LoyaltyBarProps = {
  restaurantId: number;
};

const LoyaltyBar: React.FC<LoyaltyBarProps> = ({ restaurantId }) => {
  const loyaltyDetails = useGetRestaurantLoyaltyProgramQuery(restaurantId);
  const userPoints = useGetLoyaltyPointsQuery(restaurantId);
  if (
    loyaltyDetails.isLoading ||
    loyaltyDetails.isError ||
    loyaltyDetails.isUninitialized
  ) {
    return <></>;
  }
  return (
    <div>
      <div className="flex justify-center gap-x-2">
        <LoyaltyPointsIcon />
        <span className="italic">{userPoints.data?.points ?? 0} pts</span>
      </div>
      <div className="flex place-items-center gap-x-2">
        <span>0</span>
        <progress
          className="progress progress-accent w-56 transition ease-in duration-100"
          value={userPoints.data?.points ?? "0"}
          max={loyaltyDetails.data?.minimum}
        />
        <span>{loyaltyDetails.data?.minimum}</span>
      </div>
    </div>
  );
};

export default LoyaltyBar;
