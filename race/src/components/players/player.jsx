import React, { useState, useEffect } from 'react';
import './player.css';

export const Players = () => {
  const bikeCount = 4; // Number of bikes
  const raceDistance = 1000; // Race distance in km
  const raceDuration = 60; // Race duration in seconds (2 minutes)

  const [bikes, setBikes] = useState([]);
  const [intervalId, setIntervalId] = useState(null); // New state for interval ID
  const [raceInProgress, setRaceInProgress] = useState(false);
  const [showSpeeds, setShowSpeeds] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  useEffect(() => {
    // Generate initial bike data
    const initialBikes = generateInitialBikes();
    setBikes(initialBikes);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []); // No need to start the interval here

  const generateInitialBikes = () => {
    const newBikes = [];
    for (let i = 0; i < bikeCount; i++) {
      newBikes.push({
        id: i + 1,
        name: `Bike ${i + 1}`,
        speed: 0,
        distance: 0,
      });
    }
    return newBikes;
  };

  const startRace = () => {
    if (!raceInProgress) {
      // Start the race
      const id = setInterval(updateBikeSpeeds, 1000); // Update speeds every 1 second
      setIntervalId(id);
      setRaceInProgress(true);
    }
  };

  const updateBikeSpeeds = () => {
    setBikes((prevBikes) =>
      prevBikes.map((bike) => {
        if (bike.distance >= raceDistance && !raceInProgress) {
          console.log(`Bike ${bike.id} has won!`);
          console.log(`Simulating email to Bike ${bike.id} winner.`);
          setWinner(bike.id);
          setShowFollowUp(true);
          setRaceInProgress(true);
        }
        return {
          ...bike,
          speed: Math.random() * 5 + 1,
          distance: bike.distance + bike.speed,
          percentage: (bike.distance + bike.speed) / raceDistance * 100,
        };
      })
    );
  };

  const toggleSpeeds = () => {
    setShowSpeeds(!showSpeeds);
  };

  const resetRace = () => {
    setWinner(null);
    setShowFollowUp(false);
    setBikes(generateInitialBikes());
    setRaceInProgress(false);
  };

  return (
    <div className="race-container">
      <div className="race-track">
        <svg width={raceDistance} height="100">
          {/* Race track */}
          <rect x="0" y="0" width={raceDistance} height="100" fill="#ddd" />

          {/* Bikes */}
          {bikes.map((bike, index) => (
            <rect
              key={bike.id}
              x="0"
              y={index * 30}
              width={`${bike.percentage}%`}
              height="20"
              fill={winner === bike.id ? '#f39c12' : `hsl(${120 - bike.percentage}, 100%, 50%)`} // Change color based on percentage
            />
          ))}
        </svg>
      </div>
      <div className={`speed-popup ${showSpeeds ? 'visible' : ''}`}>
        <h2>Bike Speeds</h2>
        <ul>
          {bikes.map((bike) => (
            <li key={bike.id}>Bike {bike.id}: {bike.speed.toFixed(2)} km/h</li>
          ))}
        </ul>
      </div>
      <div className={`follow-up-popup ${showFollowUp ? 'visible' : ''}`}>
        <h2>Race Completed!</h2>
        <p>{winner ? `Bike ${winner} is the winner!` : 'No winner this time.'}</p>
        <button onClick={resetRace}>Start Another Race</button>
      </div>
      <button className="race-button" onClick={startRace} disabled={raceInProgress}>
        {raceInProgress ? 'Race in Progress' : 'Start Race'}
      </button>
      <button className="speed-button" onClick={toggleSpeeds}>
        {showSpeeds ? 'Hide Speeds' : 'Show Speeds'}
      </button>
    </div>
  );
};
