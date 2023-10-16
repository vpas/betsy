/** @jsxImportSource @emotion/react */

import "./Slider.css";

export const Slider = ({
    value, 
    otherValuesWithColor,
    onChange, 
    min, max,
    minAvailable = null, maxAvailable = null, 
    label, 
    className, 
    disabled = false,
    onFormatValue = v => v
}) => {
    if (minAvailable === null) {
        minAvailable = min;
    }
    if (maxAvailable === null) {
        maxAvailable = max;
    }
    function onChangeWrapper(e) {
        let v = parseInt(e.target.value);
        v = Math.max(v, minAvailable);
        v = Math.min(v, maxAvailable);
        onChange(v);
    }

    return (
        <div className={"slider-wrapper " + className}>
            <label className="label">{label}</label>
            <label className="value">{onFormatValue(value)}</label>
            <input 
                type="range" 
                className="slider background"
                min={min} 
                max={max}
            />
            {otherValuesWithColor.map((valueColor, i) => 
                <input 
                    key={i}
                    type="range" 
                    className="slider other-value"
                    min={min} 
                    max={max} 
                    value={valueColor.value}
                    // css={css`
                    //     background-color: ${valueColor.color}
                    // `}
                    style={{
                        "--thumb-color": valueColor.color
                    }}
                    disabled={true}

                />
            )}
            <input 
                type="range" 
                className="slider my-value"
                min={min} 
                max={max} 
                value={value}
                disabled={disabled}
                onChange={onChangeWrapper}
            />
        </div>
    );
};

export default Slider;