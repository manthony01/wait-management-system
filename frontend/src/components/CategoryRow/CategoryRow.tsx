import React from "react";
import { EditIcon } from "../Icons/EditIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";

type CategoryProps = {
  name: string;
};

const CategoryRow: React.FC<CategoryProps> = ({ name }: CategoryProps) => {
  return (
    <>
      <div className="bg-light-accent1 rounded-lg drop-shadow-md my-6 p-6">
        <div className="grid grid-cols-2">
          <div className="flex justify-between">
            <h2>{name}</h2>
          </div>
          <div className="flex justify-end space-x-4">
            <EditIcon />
            <DeleteIcon />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryRow;
