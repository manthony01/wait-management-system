import React from "react";

interface TextAreaInputComponentProps {
  label: string;
  placeholder: string;
  handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string | number | readonly string[] | undefined;
}

const TextAreaInputComponent: React.FC<TextAreaInputComponentProps> = ({
  label,
  placeholder,
  handleChange,
  handleKeyDown,
  value,
}) => (
  <div>
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <textarea
      className="textarea textarea-bordered h-32 w-full"
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  </div>
);

export default TextAreaInputComponent;
