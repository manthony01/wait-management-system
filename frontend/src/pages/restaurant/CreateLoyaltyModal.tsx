import React, { useState } from "react";
import TextInputComponent from "../../components/InputComponents/TextInputComponent";
import { useCreateLoyaltyProgramMutation } from "../../services/manager";
import { raiseError, raiseNotification } from "../../utils/utilFunctions";
import { PythonError } from "../../types";

type Props = {
  restaurantId: number;
};

const CreateLoyaltyModal: React.FC<Props> = ({ restaurantId }) => {
  const [minimum, setMinimum] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [multiplier, setMultiplier] = useState(0);

  const [createLoyaltyProgram] = useCreateLoyaltyProgramMutation();

  const resetForm = () => {
    setMinimum(0);
    setDiscount(0);
    setMultiplier(0);
  };

  const handleSubmit = async () => {
    try {
      await createLoyaltyProgram({
        minimum,
        discount,
        multiplier,
        restaurantid: restaurantId,
      }).unwrap();
      raiseNotification("Succesfully created a loyalty program");
      resetForm();
    } catch (error: unknown) {
      raiseError(
        `Failed to create a loyalty program: ${
          (error as PythonError).data.detail
        }`
      );
    }
  };

  const renderButtons = () => (
    <>
      <button
        className="btn bg-accent text-accent-content"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
      <button
        className="btn bg-error text-error-content"
        onClick={() => resetForm()}
      >
        Cancel
      </button>
    </>
  );
  return (
    <>
      <h3 className="font-bold text-lg">Setup Loyalty Program</h3>
      <form className="space-y-4">
        <TextInputComponent
          label="Minimum Points to Redeem Coupon (pts)"
          type="number"
          value={minimum}
          placeholder="0"
          handleChange={(e) => setMinimum(parseInt(e.target.value))}
        />
        <TextInputComponent
          label="Coupon Value ($)"
          type="number"
          value={discount}
          placeholder="0"
          handleChange={(e) => setDiscount(parseInt(e.target.value))}
        />
        <TextInputComponent
          label="Item Cost to Points Multiplier"
          type="number"
          value={multiplier}
          placeholder="0"
          handleChange={(e) => setMultiplier(parseInt(e.target.value))}
        />
      </form>
      <div className="flex justify-end gap-x-5 mt-5">{renderButtons()}</div>
    </>
  );
};

export default CreateLoyaltyModal;
