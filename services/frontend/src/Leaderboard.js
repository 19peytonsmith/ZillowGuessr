import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Leaderboard = () => {
    const [leaderboardScores, setLeaderboardScores] = useState([]);

    // Fetch the list of scores from cookies on component mount
    useEffect(() => {
        const scoresFromCookie = Cookies.get('leaderboardScores');
        if (scoresFromCookie) {
            const parsedScores = JSON.parse(scoresFromCookie);
            // Sort scores from greatest to least
            parsedScores.sort((a, b) => b - a);
            setLeaderboardScores(parsedScores);
        }
    }, []);

    return (
        <div style={styles.container}>
            <h1>Leaderboard</h1>
            {leaderboardScores.length > 0 ? (
                <div style={styles.scoreCard}>
                    <h2>Your Total Scores</h2>
                    <ul>
                        {leaderboardScores.map((score, index) => (
                            <li key={index}>Game {index + 1}: {score}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No scores available. Play the game to see your scores!</p>
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
