import React, { useState, useEffect } from 'react';
import './player.css';
import emailjs from 'emailjs-com';

export const Players = () => {
  const bikeCount = 4; // Number of bikes
  const raceDistance = 500; // Race distance in km
  const raceDuration = 20; // Race duration in seconds (2 minutes)

  const [bikes, setBikes] = useState([]);
  const [intervalId, setIntervalId] = useState(null); // New state for interval ID
  const [raceInProgress, setRaceInProgress] = useState(false);
  const [showSpeeds, setShowSpeeds] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [winnerPopUpShown, setWinnerPopUpShown] = useState(false);

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
        email: `email${i + 1}@example.com`, // Replace with actual email
        svg: `bike-svg-${i + 1}`, // Replace with actual SVG element ID or class
      });
    }
    return newBikes;
  };
  const startRace = () => {
    if (!raceInProgress) {
      setWinner(null);
      setShowFollowUp(false);
      setRaceInProgress(true);
      setWinnerPopUpShown(false); // Reset winner pop-up status
      const id = setInterval(updateBikeSpeeds, 1000); // Update speeds every 1 second
      setIntervalId(id);
      setRaceInProgress(true);
    }
  };


  const updateBikeSpeeds = () => {
    setBikes((prevBikes) =>
      prevBikes.map((bike) => {
        if (bike.distance >= raceDistance && !raceInProgress && winner !== bike.id) {
          console.log(`Bike ${bike.id} has won!`);
          console.log(`Simulating email to Bike ${bike.id} winner.`);
          
          // Send email to the winner
          sendEmail(bike.email);
          
          setWinner(bike.id);
          setRaceInProgress(false);
          clearInterval(intervalId);
  
          if (!winnerPopUpShown) {
            setShowFollowUp(true);
            setWinnerPopUpShown(true);
          }
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

 
  const sendEmail = (toEmail) => {
    emailjs.send(
      'service_nk4vm0d', // Your email service ID from emailjs dashboard
      'template_63eg5is', // Your template ID from emailjs dashboard
      {
        to_email: toEmail,
      },
      'V32r9vN3iCxD_q1ka' // Your user ID from emailjs dashboard
    )
    .then((response) => {
      console.log('Email sent successfully', response);
    })
    .catch((error) => {
      console.error('Error sending email', error);
    });
  };

  const toggleSpeeds = () => {
    setShowSpeeds(!showSpeeds);
  };

  const resetRace = () => {
    setWinner(null);
    setShowFollowUp(false);
    setWinnerPopUpShown(false); // Reset winner pop-up status
    setBikes(generateInitialBikes());
    setRaceInProgress(false);
  };
  const sortedBikes = [...bikes].sort((a, b) => b.distance - a.distance);
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
            <li key={bike.id}>
              {bike.name}: {bike.speed.toFixed(2)} km/h
              <br />
              Email: {bike.email}
            </li>
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
      {showFollowUp && (
      <div className="rank-list">
        <h2>Ranking List</h2>
        <ol>
          {sortedBikes.map((bike, index) => (
            <li key={bike.id}>
              {index + 1}. {bike.name} - {bike.distance.toFixed(2)} km
            </li>
          ))}
        </ol>
      </div>
    )}
  </div>
);
};