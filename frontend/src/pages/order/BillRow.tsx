import React from "react";
import { useGetMenuItemQuery } from "../../services/customer";
import LoadingPage from "../errors/LoadingPage";

type BillRowProps = {
  menuItemId: number;
  quantity: number;
  key: string;
  index: number;
};

const BillRow: React.FC<BillRowProps> = ({
  menuItemId,
  quantity,
  key,
  index,
}) => {
  const { data, isLoading, isUninitialized, isError } =
    useGetMenuItemQuery(menuItemId);

  if (isLoading || isError || isUninitialized) {
    return <LoadingPage />;
  }
  return (
    <tr key={key}>
      <td className="font-bold">{index + 1}</td>
      <td>{data.title}</td>
      <td>{data.cost.toFixed(2)}</td>
      <td>{quantity}</td>
      <td>{(quantity * data.cost).toFixed(2)}</td>
    </tr>
  );
};

export default BillRow;
