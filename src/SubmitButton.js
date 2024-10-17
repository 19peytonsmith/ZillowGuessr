// src/SubmitButton.js
import React from 'react';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


const SubmitButton = ({ onClick, children }) => {
    return (
        <Button className="px-5" variant="contained" onClick={onClick}>
            {children}
        </Button>
    );
};

export default SubmitButton;
