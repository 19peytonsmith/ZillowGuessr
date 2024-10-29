// src/PropertySlider.js
import React from 'react';
import Slider from '@mui/material/Slider';


const PropertySlider = ({ value, onChange, color}) => {
    const marks = [
        {
          value: 0,
          label: '$0',
        },
        {
          value: 250,
          label: '$100,000',
        },
        {
          value: 750,
          label: '$1M',
        },
        {
            value: 1000,
            label: '$20M',
        }
      ];
    function calculateValue(value) {
        if (value <= 250) {
            return (value / 250) * 100000; // Scale from 0 to 250 to 0 to 100,000
        } else if (value <= 750) {
            return 100000 + ((value - 250) / (750 - 250)) * (1000000 - 100000); // Scale from 250 to 500 to 100,000 to 1,000,000
        } else {
            return 1000000 + ((value - 750) / (1000 - 750)) * (20000000 - 1000000); // Scale from 500 to 1000 to 1,000,000 to 20,000,000
        }
    }
    function prettyValue(value){
        return `$${Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return (
        <Slider
            color={color}
            aria-label="Default"
            valueLabelDisplay="auto"
            marks={marks}
            min={0}
            max={1000}
            scale={calculateValue}
            valueLabelFormat={prettyValue}
            value={value}
            onChange={onChange}
            className="slider"
        />    
    );
};

export default PropertySlider;
