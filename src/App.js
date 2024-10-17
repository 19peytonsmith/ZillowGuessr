// src/App.js
import React, { useEffect, useState } from 'react';
import { redirect, Routes, Route} from 'react-router-dom';
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

    const calculateScore = (sliderValue, valueOfHome) => {
        const percentageError = (sliderValue - valueOfHome) / (valueOfHome)
        return Math.round(1000*(Math.E**(-Math.abs(percentageError))));
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
        alert(scoreForRound)
        if (currentIndex < propertyDataQueue.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setCarouselIndex(0); // TODO: Reset the PropertyCarousel index to 0 somehow?
            setSliderValue(250);
        } else {
            Cookies.set('leaderboardTotal', total + scoreForRound, { expires: 7 });
            redirect("/leaderboards");
        }
    };

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

    function calculateValue(value) {
        if (value <= 250) {
            return (value / 250) * 100000; // Scale from 0 to 250 to 0 to 100,000
        } else if (value <= 750) {
            return 100000 + ((value - 250) / (750 - 250)) * (1000000 - 100000); // Scale from 250 to 500 to 100,000 to 1,000,000
        } else {
            return 1000000 + ((value - 750) / (1000 - 750)) * (20000000 - 1000000); // Scale from 500 to 1000 to 1,000,000 to 20,000,000
        }
    }

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
                                />
                                <PropertySlider value={sliderValue} onChange={handleOnChange} disabled={roundLocked} />
                                <div className="round-div">
                                    <Rounds round={currentIndex + 1} handleClick={handleRoundClick}></Rounds>
                                </div>
                                <div className="submit-btn text-center my-3">
                                    {roundLocked ? (
                                        <button className="btn btn-secondary" onClick={handleBackToOriginalRound}>
                                            Round {originalIndex + 1}
                                        </button>
                                    ) : (
                                        <SubmitButton onClick={() => handleSubmit(currentData.value)}>Go!</SubmitButton>
                                    )}
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
