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
          <ScratchCard ref={scratchCardRef} width={280} height={280} coverColor="#4A4A4A" onComplete={() => setIsCompleted(true)}>
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
          <div className="coupon-info">
            <h3>Coupon Details</h3>
            <div className="info-item">
              <span className="info-label">Amount</span>
              <span className="info-value">₹50</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type</span>
              <span className="info-value">Paytm Cash</span>
            </div>
            <div className="info-item">
              <span className="info-label">Valid Till</span>
              <span className="info-value">30 Days</span>
            </div>
            <button className="reset-btn" onClick={handleReset}>Scratch Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
