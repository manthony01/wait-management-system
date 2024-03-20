import React, { useState } from "react";
import TextInputComponent from "../../InputComponents/TextInputComponent";
import { useAddCategoryMutation } from "../../../services/manager";
import { LexoRank } from "lexorank";

type AddCategoryFormProps = {
  restaurantId: number;
  lastRank: string | undefined;
};

const AddCategoryModal: React.FC<AddCategoryFormProps> = ({
  restaurantId,
  lastRank,
}) => {
  const [name, setName] = useState("");
  const [addCategory] = useAddCategoryMutation();
  return (
    <>
      <button
        className="btn bg-accent hover:bg-accent-focus text-accent-content"
        onClick={() => {
          if (document) {
            (
              document.getElementById("add_category_modal") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        Add Category
      </button>
      <dialog
        id="add_category_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Add Category Form</h3>
          <TextInputComponent
            label="Name"
            type="text"
            placeholder="Entreé"
            handleChange={(e) => setName(e.target.value)}
            value={name}
          />
          <div className="modal-action">
            <button
              className="btn bg-accent text-accent-content"
              onClick={() => {
                addCategory({
                  name,
                  restaurantid: restaurantId,
                  orderindex: lastRank
                    ? LexoRank.parse(lastRank).genNext().toString()
                    : LexoRank.middle().toString(),
                });
                setName("");
              }}
            >
              Submit
            </button>
            <button
              className="btn bg-error text-error-content"
              onClick={() => setName("")}
            >
              Cancel
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button />
        </form>
      </dialog>
    </>
  );
};

export default AddCategoryModal;
