import React, { useState } from 'react';
import ScratchCard from './ScratchCard';
import './App.css';

function App() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleScratchComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="app-container">
      <div className="screen">
        <h1 className="title">Congratulations!</h1>
        <p className="subtitle">Here is your Scratch Card</p>

        <div className="scratch-card-wrapper">
          <ScratchCard
            width={300}
            height={300}
            coverColor="#9C27B0"
            onComplete={handleScratchComplete}
          >
            <div className="reward-content">
              <div className="reward-icon">🎁</div>
              <p className="reward-text">You won</p>
              <p className="reward-amount">Paytm ₹50</p>
            </div>
          </ScratchCard>
        </div>

        <p className={`instruction ${isCompleted ? 'completed' : ''}`}>
          {isCompleted ? 'Scratch completed!' : 'Scratch the above card by swiping on it.'}
        </p>

        <div className={`result-card ${isCompleted ? 'show' : ''}`}>
          <h2>You won Paytm ₹50</h2>
          <p>Amount will be credited within 24 hours</p>
        </div>
      </div>
    </div>
  );
}

export default App;
