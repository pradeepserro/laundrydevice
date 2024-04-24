import { useState } from "react";

function SelectType({ labelTitle, labelStyle, containerStyle, defaultValue, options, updateFormValue, updateType }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const updateSelectValue = (val) => {
    setSelectedValue(val);
    updateFormValue({ updateType, value : val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
      </label>
      <select
        value={selectedValue}
        onChange={(e) => updateSelectValue(e.target.value)}
        className="select select-bordered w-full "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectType;
