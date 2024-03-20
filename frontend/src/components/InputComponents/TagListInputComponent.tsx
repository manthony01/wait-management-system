import React from "react";
import TagIcon from "../Icons/TagIcon";
import { Autocomplete, Box } from "@mui/material";
import { Tag } from "../../types";

interface TagListInputComponentProps {
  options: Tag[];
  data: Tag[];
  label?: string;
  placeholder: string;
  addValue: (value: Tag | null) => void;
  removeValue: (idx: number) => void;
}

const TagListInputComponent: React.FC<TagListInputComponentProps> = ({
  options,
  data,
  label,
  placeholder,
  addValue,
  removeValue,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="flex items-center gap-x-2 w-full">
        <Autocomplete
          disablePortal
          id="country-select-demo"
          className="w-5/6"
          options={options}
          autoHighlight
          getOptionLabel={(option) => option.tagname}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <button
                className="w-full h-full text-left justify-start"
                onClick={() => addValue(option)}
              >
                {option.tagname}
              </button>
            </Box>
          )}
          renderInput={(params) => (
            <div
              ref={params.InputProps.ref}
              className="w-full bg-base-100 rounded-full flex justify-center items-center gap-x-4"
            >
              <input
                {...params.inputProps}
                type="text"
                placeholder={placeholder}
                className="input w-full p-3 bg-base-100 input-bordered"
              />
              <TagIcon />
            </div>
          )}
        />
      </div>
      <div className="flex gap-2 mt-2 w-full flex-wrap pr-2">
        {data.length === 0 ? (
          <div className="h-5 pl-1 text-sm">No {label}</div>
        ) : (
          data.map((value) => (
            <div
              key={`preference-${value.id}`}
              className="badge badge-outline hover:bg-error hover:text-black select-none px-5 hover:cursor-pointer"
              style={{ color: value.colour, borderColor: value.colour }}
              onClick={() => removeValue(value.id)}
            >
              {value.tagname}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TagListInputComponent;
