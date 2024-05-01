import React from "react";

const RadioSelect = ({
    id,
    label,
    options,
    selectedValue,
    onChange,
    error,
}) => {
    return (
        <div className="mb-3">
            <label className="fw-bold" htmlFor={id}>
                {label}
            </label>
            <br />
            {options.map((option) => (
                <div className="form-check form-check-inline" key={option.id}>
                    <input
                        className="form-check-input"
                        type="radio"
                        value={option.value}
                        onChange={() => onChange(option.value)}
                        id={`radio-${id}-${option.id}`}
                        checked={selectedValue === option.value}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`radio-${id}-${option.id}`}
                    >
                        {option.label}
                    </label>
                </div>
            ))}
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default RadioSelect;
