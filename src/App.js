import { useState, useRef } from 'react';
import ScratchCard from './ScratchCard';
import './App.css';

function App() {
  const [isCompleted, setIsCompleted] = useState(false);
  const scratchCardRef = useRef(null);

  const handleReset = () => {
    setIsCompleted(false);
    if (scratchCardRef.current) {
      scratchCardRef.current.reset();
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Congratulations!</h1>
        <p className="subtitle">Scratch to reveal your reward</p>

        <div className="scratch-card-wrapper">
          <ScratchCard ref={scratchCardRef} width={320} height={320} coverColor="#2c3e50" onComplete={() => setIsCompleted(true)}>
            <div className="coupon-card-inner">
              <h2>You Won</h2>
              <div className="coupon-amount-large">₹50</div>
              <p className="coupon-label">Paytm Cash</p>
              <div className="coupon-divider"></div>
              <p className="coupon-small-text">Valid for 30 days</p>
            </div>
          </ScratchCard>
        </div>

        {isCompleted && (
          <button className="reset-btn" onClick={handleReset}>Scratch Again</button>
        )}
      </div>
    </div>
  );
}

export default App;
