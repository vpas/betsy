import React from "react";
import "./Slider.css";

export const Slider = ({
    value, 
    onChange, 
    min, max, 
    label, 
    className, 
    onFormatValue = v => v
}) => {
    return (
        <div className={"slider-wrapper " + className}>
            <label className="label">{label}</label>
            <label className="value">{onFormatValue(value)}</label>
            <input 
                type="range" 
                className="slider"
                min={min} 
                max={max} 
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Slider;