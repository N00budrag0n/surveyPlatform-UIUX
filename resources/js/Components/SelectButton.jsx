import React from "react";

const SelectButton = ({
    label,
    options,
    valueKey,
    labelKey,
    selectedValues,
    onChange,
}) => {
    return (
        <div className="mb-3">
            {label && <label className="fw-bold mb-1">{label}</label>}
            {options.map((option, index) => (
                <div className=" form-check-inline" key={index}>
                    <button
                        type="button"
                        className={`btn ${
                            selectedValues.includes(option[valueKey])
                                ? "btn-primary"
                                : "btn-secondary"
                        } mx-1 mb-1`}
                        style={{
                            backgroundColor: selectedValues.includes(
                                option[valueKey]
                            )
                                ? "var(--nav-color)"
                                : "white",
                            color: selectedValues.includes(option[valueKey])
                                ? "white"
                                : "black",
                        }}
                        key={index}
                        onClick={() => {
                            onChange(option[valueKey]);
                        }}
                    >
                        {option[labelKey]}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SelectButton;
