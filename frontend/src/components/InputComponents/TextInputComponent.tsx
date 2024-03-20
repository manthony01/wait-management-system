import React from "react";

interface TextInputComponentProps {
  label: string;
  type: string;
  placeholder: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string | number | readonly string[] | undefined;
  isInvalid?: boolean;
  errorStyle?: string;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  label,
  type,
  placeholder,
  handleChange,
  handleKeyDown,
  value,
  isInvalid,
  errorStyle,
}) => (
  <div>
    <label className="label text-light-textSecondary">
      <span className="label-text">{label}</span>
    </label>
    <input
      className={`w-full input input-bordered ${isInvalid ? errorStyle : ""}`}
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  </div>
);

export default TextInputComponent;
