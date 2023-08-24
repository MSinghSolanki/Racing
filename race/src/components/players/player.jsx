import React, { useState } from 'react';
import './player.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHorse, faDog, faCat, faFish, faDove, faBug } from '@fortawesome/free-solid-svg-icons';
import { RankModal } from '../ranks/rank';
import emailjs from '@emailjs/browser';

const animalIcons = [faHorse, faDog, faCat, faFish, faDove, faBug];

export const Players = () => {
  const [winner, setWinner] = useState(null);
  const [raceInProgress, setRaceInProgress] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [ranks, setRanks] = useState([]);
  const [speeds, setSpeeds] = useState([]);

  const openRankModal = () => {
    setRankModalOpen(true);
  };

  const closeRankModal = () => {
    setRankModalOpen(false);
  };

  const sendEmail = () => {
    emailjs.send(
      'service_nk4vm0d', // Your email service ID from emailjs dashboard
      'template_63eg5is', // Your template ID from emailjs dashboard
      {
        to_email: 'mohit.solanki@allen.in', // Replace with recipient's email
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

  const handleTransitionEnd = () => {
    // Check if all animal animations have finished
    const animalElements = document.querySelectorAll('.animal');
    const unfinishedAnimations = Array.from(animalElements).filter(
      (animal) => animal.style.left !== `${window.innerWidth - 100}px`
    );

    if (unfinishedAnimations.length === 0) {
      const sortedRanks = speeds.map((speed, index) => ({ speed, icon: animalIcons[index] }))
        .sort((a, b) => a.speed - b.speed);
      setRanks(sortedRanks);
      sendEmail();
      setTimeout(openRankModal, 1000);
    }
  };

  const startRace = () => {
    if (!raceInProgress) {
      setRaceInProgress(true);
      setWinner(null);

      const endPoint = window.innerWidth - 100; // Adjust based on icon width
      const newSpeeds = Array.from({ length: 6 }, () => Math.random() * 5 + 1);
      setSpeeds(newSpeeds);

      const animalElements = document.querySelectorAll('.animal');

      animalElements.forEach((animal, index) => {
        const speed = newSpeeds[index];
        const animationDuration = endPoint / speed;

        animal.style.transition = `left ${animationDuration}s linear`;
        animal.style.left = endPoint + 'px';

        animal.addEventListener('transitionend', () => {
          if (animal.style.left === endPoint + 'px' && !winner) {
            setWinner(index);
            setRaceInProgress(false);
          }
        });
      });
    }
  };


  return (
    <div>
        <h1>Get Ready!!!!!</h1>
        <h1>For The Show</h1>
    <div className="players">
      <div className="race-track">
        {animalIcons.map((icon, index) => (
          <div className={`animal ${index === winner ? 'winner' : ''}`} key={index}>
            <FontAwesomeIcon icon={icon} />
          </div>
        ))}
      </div>
       <button onClick={startRace} disabled={raceInProgress}>
        {raceInProgress ? 'Race in Progress' : 'Start Race'}
      </button>
      <p className="winner-text">{winner !== null && `Winner: ${animalIcons[winner].iconName}`}</p>

<RankModal isOpen={rankModalOpen} onClose={closeRankModal} ranks={ranks} />
</div>
</div>
  );
};


