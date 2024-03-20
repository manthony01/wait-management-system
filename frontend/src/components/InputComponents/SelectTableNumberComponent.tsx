import React from "react";
import { useGetRestaurantTablesQuery } from "../../services/customer";
import LoadingDots from "../LoadingIcons/LoadingDots";

type SelectTableNumberComponentProps = {
  restaurantId: number;
  tableNumber: number | undefined;
  setTableNumber: (number: number) => void;
};

const SelectTableNumberComponent: React.FC<SelectTableNumberComponentProps> = ({
  restaurantId,
  tableNumber,
  setTableNumber,
}) => {
  const { data, isLoading, isError, isUninitialized } =
    useGetRestaurantTablesQuery(restaurantId);
  if (isLoading || isError || isUninitialized) {
    return <LoadingDots />;
  }
  return (
    <>
      <label className="label">
        <span className="label-text">Select your table number</span>
      </label>
      <select
        className="select select-bordered w-full"
        value={tableNumber}
        onChange={(e) => setTableNumber(parseInt(e.target.value, 10))}
      >
        <option disabled selected></option>
        {data.map((table) => (
          <option
            key={`restaurant-${table.restaurantid}-table-${table.tableid}`}
            value={table.tableid}
          >
            {table.tableid}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectTableNumberComponent;
