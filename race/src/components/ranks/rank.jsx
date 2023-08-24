import React from 'react';
import './rank.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const RankModal = ({ isOpen, onClose, ranks }) => {
  if (!isOpen) return null;

  return (
    <div className="rank-modal">
      <div className="modal-content">
        <h2>Race Results</h2>
        <ul>
          {ranks.map((rank, index) => (
            <li key={index}>
              <span className="animal-icon">
                <FontAwesomeIcon icon={rank.icon} />
              </span>
              <span>{`Speed: ${rank.speed.toFixed(2)}`}</span>
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};


