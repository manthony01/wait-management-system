import React from "react";

interface MyComponentProps {
  message: string;
}

const AddItemForm: React.FC<MyComponentProps> = ({ message }) => {
  return <div>{message}</div>;
};

export default AddItemForm;
