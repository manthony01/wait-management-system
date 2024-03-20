import React, { useState } from "react";
import TextInputComponent from "../../InputComponents/TextInputComponent";
import { KITCHENSTAFF, MANAGER, WAITSTAFF } from "../../../const";
import { useAddStaffMutation } from "../../../services/manager";
import { raiseError, raiseNotification } from "../../../utils/utilFunctions";
import { PythonError } from "../../../types";

type AddStaffModalProps = {
  restaurantId: number;
};

const AddStaffModal: React.FC<AddStaffModalProps> = ({ restaurantId }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(WAITSTAFF);
  const clearForm = () => {
    setEmail("");
    setRole(WAITSTAFF);
  };
  const [addStaff] = useAddStaffMutation();

  const handleAddStaff = async () => {
    try {
      if (!role || !email) {
        raiseError("Please enter a valid role and email");
        return;
      }
      const staff = await addStaff({
        restaurant_id: restaurantId,
        email,
        role,
      }).unwrap();

      raiseNotification(`Successfully added staff: ${staff.email}`);
      clearForm();
    } catch (error: unknown) {
      raiseError((error as PythonError).data.detail);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary mt-5 text-primary-content"
        onClick={() => {
          if (document) {
            (
              document.getElementById("add_staff_modal") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        Add Staff
      </button>
      <dialog id="add_staff_modal" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Add staff member</h3>
          <TextInputComponent
            label="Email"
            type="text"
            placeholder="example@gmail.com"
            handleChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Select Role</span>
            </label>
            <select
              className="select select-bordered"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option disabled selected>
                Pick one
              </option>
              <option value={WAITSTAFF}>Wait Staff</option>
              <option value={KITCHENSTAFF}>Kitchen Staff</option>
              <option value={MANAGER}>Manager</option>
            </select>
          </div>
          <div className="modal-action">
            <button
              className="btn bg-accent text-accent-content"
              onClick={handleAddStaff}
            >
              Submit
            </button>
            <button
              className="btn bg-error text-error-content"
              onClick={() => clearForm()}
            >
              Cancel
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

export default AddStaffModal;
