// src/Leaderboard.js
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Leaderboard = () => {
    const [leaderboardTotal, setLeaderboardTotal] = useState(null);

    // Fetch the total from cookies on component mount
    useEffect(() => {
        const totalFromCookie = Cookies.get('leaderboardTotal');
        if (totalFromCookie) {
            setLeaderboardTotal(parseInt(totalFromCookie, 10));
        }
    }, []);

    return (
        <div style={styles.container}>
            <h1>Leaderboard</h1>
            {leaderboardTotal !== null ? (
                <div style={styles.scoreCard}>
                    <h2>Your Total Score</h2>
                    <p>{leaderboardTotal}</p>
                </div>
            ) : (
                <p>No score available. Play the game to see your score!</p>
            )}
        </div>
    );
};
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
    },
    scoreCard: {
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }
};

export default Leaderboard;
