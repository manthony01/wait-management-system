import React, { useState } from "react";
import TagIcon from "../Icons/TagIcon";

interface TextInputComponentProps {
  data: string[];
  label: string;
  type: string;
  placeholder: string;
  addValue: (value: string) => void;
  removeValue: (idx: number) => void;
}

const ListInputComponent: React.FC<TextInputComponentProps> = ({
  data,
  label,
  type,
  placeholder,
  addValue,
  removeValue,
}) => {
  const [value, setValue] = useState<string>("");
  const [warn, setWarn] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!value) {
      return;
    }
    setWarn(false);
    if (e.key === "Enter") {
      const uniqueValues = new Set(data);
      if (uniqueValues.has(value)) {
        setWarn(true);
        return;
      }
      addValue(value.trim());
      setValue("");
    }
  };

  return (
    <div>
      <label className="label text-light-textSecondary">
        <span className="label-text">{label}</span>
      </label>
      <div className="flex items-center gap-x-2">
        <input
          className={`input input-bordered w-full p-2 mt-0 border border-light-secondary rounded ${
            warn ? "input-error" : ""
          }`}
          type={type}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="0"
        />
        <TagIcon />
      </div>
      <div className="flex gap-2 mt-2 w-full flex-wrap pr-2">
        {data.length === 0 ? (
          <div className="h-5 text-sm pl-1">No {label}</div>
        ) : (
          data.map((value, idx) => (
            <div
              key={`tablenumber-${idx}`}
              className="badge badge-outline badge-info hover:bg-error hover:text-black select-none px-5"
              onClick={() => removeValue(idx)}
            >
              {value}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListInputComponent;
