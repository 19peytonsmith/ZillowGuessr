// src/Rounds.js
import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Rounds = ({ round, handleClick, disabled}) => {
    const circles = [1, 2, 3, 4, 5];

    return (
        <h5 className="d-flex gap-2 justify-content-center">
            Round
            {circles.map((circle, index) => {
                if (index < round - 1) {
                    return (
                        <i
                            key={index}
                            className="bi bi-ban text-danger"
                            onClick={!disabled ? () => handleClick(index + 1) : null}
                            style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
                            disabled={disabled}
                        ></i>
                    );
                } else if (index === round - 1) {
                return <i key={index} className={`bi bi-${round}-circle text-success`}></i>;
                } else {
                return (
                    <i key={index} className={`bi bi-${index+1}-circle text-info`}></i>
                );
                }
            })}
        </h5>
    );
};

export default Rounds;