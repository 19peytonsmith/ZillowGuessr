// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './App.css';
import PropertySlider from './PropertySlider';
import PropertyCarousel from './PropertyCarousel';
import SubmitButton from './SubmitButton';
import Rounds from './Rounds';
import Leaderboard from './Leaderboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBed, faBathtub, faRuler } from '@fortawesome/free-solid-svg-icons'



function App() {
    const [propertyDataQueue, setPropertyDataQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [originalIndex, setOriginalIndex] = useState(0);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [sliderValue, setSliderValue] = useState(250);
    const [sliderValues, setSliderValues] = useState([]);
    const [scores, setScores] = useState([]);
    const [total, setTotal] = useState(0);
    const [roundLocked, setRoundLocked] = useState(false);
    const [pendingNextRound, setPendingNextRound] = useState(false);
    const [color, setColor] = useState("primary");
    const [getResults, setGetResults] = useState(false);

    const handleOnChange = (event, newValue) => {
        if (!roundLocked) { 
            setSliderValue(newValue);
        }
    };
    // Function to fetch property data from the server
    const fetchPropertyInfo = async (index) => {
        try {
            const response = await axios.get(`http://localhost:5000/property_info?page=${index}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;
    
        const fetchInQueue = async () => {
            for (let i = 0; i < 5; i++) {
                const data = await fetchPropertyInfo(i);
                if (data && isMounted) {
                    setPropertyDataQueue((prevData) => [...prevData, data]);
                }
            }
        };
    
        fetchInQueue();
    
        return () => {
            isMounted = false;
        };
    }, []);
    

    const currentData = propertyDataQueue[currentIndex];

    // Function to update the color of the slider based on whether the round is locked or not
    useEffect(() => {
        if (roundLocked) {
          setColor("gray");
        } else {
          setColor("primary");
        }
    }, [roundLocked]);

    // Function used to calculate the score based on your slider value guess
    const calculateScore = (sliderValue, valueOfHome) => {
        const percentageError = (sliderValue - valueOfHome) / (valueOfHome)
        return Math.round(1000*(Math.E**(-Math.abs(percentageError))));
    }

    const convertValueToSliderValue = (moneyValue) => {
        if (moneyValue <= 100000) {
            return (moneyValue / 100000) * 250; // Scale from 0 to 100,000 to 0 to 250
        } else if (moneyValue <= 1000000) {
            return 250 + ((moneyValue - 100000) / (1000000 - 100000)) * (750 - 250); // Scale from 100,000 to 1,000,000 to 250 to 750
        } else {
            return 750 + ((moneyValue - 1000000) / (20000000 - 1000000)) * (1000 - 750); // Scale from 1,000,000 to 20,000,000 to 750 to 1000
        }
    }

    // Handle moving to the next property
    const handleSubmit = (valueOfHome) => {
        const scoreForRound = calculateScore(calculateValue(sliderValue), valueOfHome)
        setSliderValues(prevValues => {
            const updatedValues = [...prevValues];
            updatedValues[currentIndex] = sliderValue;
            return updatedValues;
        });
        setScores((prevScores) => [...prevScores, scoreForRound]);
        setTotal(prevTotal => prevTotal + scoreForRound);
        setSliderValue([sliderValue, convertValueToSliderValue(valueOfHome)]);
        setRoundLocked(true);
        (currentIndex < 4) ? setPendingNextRound(true) : setGetResults(true)
        setColor("warning");
    };

    const handleNextRoundClick = () =>{
        setRoundLocked(false);
        setPendingNextRound(false);
        setColor("primary");
        setSliderValue(250);
        setCurrentIndex(prevIndex => prevIndex + 1);
        setOriginalIndex(currentIndex+1);
        setCarouselIndex(0);
    }

    const handleRoundClick = (round) => {
        if (!roundLocked){
            setOriginalIndex(currentIndex);
            setRoundLocked(true);
        }
        setCurrentIndex(round - 1);

        if (sliderValues[round - 1] !== undefined) {
            setSliderValue(sliderValues[round - 1]);
        } else {
            setSliderValue(250);
        }
    };

    const handleBackToOriginalRound = () =>{
        setCurrentIndex(originalIndex);
        setRoundLocked(false);
        setSliderValue(250);
    };
    const handleGetResults = () => {
        const storedScores = Cookies.get('leaderboardScores');
        const leaderboardScores = storedScores ? JSON.parse(storedScores) : [];

        const updatedScores = [...leaderboardScores, total];

        Cookies.set('leaderboardScores', JSON.stringify(updatedScores), { expires: 7 });
                window.location.href = '/leaderboards'
    }

    function calculateValue(value) {
        if (value <= 250) {
            return (value / 250) * 100000; // Scale from 0 to 250 to 0 to 100,000
        } else if (value <= 750) {
            return 100000 + ((value - 250) / (750 - 250)) * (1000000 - 100000); // Scale from 250 to 500 to 100,000 to 1,000,000
        } else {
            return 1000000 + ((value - 750) / (1000 - 750)) * (20000000 - 1000000); // Scale from 500 to 1000 to 1,000,000 to 20,000,000
        }
    }

    const buttonState = () => {
        if (getResults){
            return (
                <button className="btn btn-success" onClick={handleGetResults}>
                    Get Results
                </button>
            );
        }
        else if (pendingNextRound) {
            return (
                <button className="btn btn-primary" onClick={handleNextRoundClick}>
                    Next Round
                </button>
            );
        } else if (roundLocked) {
            return (
                <button className="btn btn-secondary" onClick={handleBackToOriginalRound}>
                    Round {originalIndex + 1}
                </button>
            );
        } else {
            return (
                <SubmitButton onClick={() => handleSubmit(currentData.value)}>
                    Go!
                </SubmitButton>
            );
        }
    };
    

    return (
        <Routes>
            <Route path="/" element={
                <div className="mx-auto my-auto d-flex h-100">
                    {currentData ? (
                        <div className="d-flex gap-2 mx-auto" id="container">
                            <div className="half-width p-lg-4 p-2" style={{backgroundColor: 'whitesmoke'}}>
                                <h2 className="my-0">{currentData.address}</h2>
                                <div className="d-flex justify-content-between">
                                    <h4>{currentData.city_state_zipcode}</h4>
                                    <div className="property-data d-flex gap-2">
                                        <h5>
                                            <FontAwesomeIcon icon={faBed} /> {currentData.beds}<span className="small-text">bd</span>
                                        </h5>
                                        <h5>
                                            <FontAwesomeIcon icon={faBathtub} /> {currentData.baths}<span className="small-text">ba</span>
                                        </h5>
                                        <h5>
                                            <FontAwesomeIcon icon={faRuler} /> {currentData.square_footage}<span className="small-text">ft<sup>2</sup></span>
                                        </h5>
                                    </div>
                                </div>
                                <hr />
                                <h5>Score: <span className="text-success">{total}</span></h5>
                                <hr />
                                <PropertyCarousel
                                    urls={currentData.urls}
                                    className="property-carousel"
                                    startIndex={carouselIndex}
                                    onChangeIndex={setCarouselIndex}
                                />
                                <PropertySlider value={sliderValue} onChange={handleOnChange} disabled={roundLocked} color={color}/>
                                <div className="round-div">
                                    <Rounds round={originalIndex + 1} handleClick={handleRoundClick} disabled={pendingNextRound}></Rounds>
                                </div>
                                <div className="submit-btn text-center my-3">
                                    {buttonState()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
        } />
        <Route path="/leaderboards" element={<Leaderboard />} />
    </Routes>
    );
}

export default App;
