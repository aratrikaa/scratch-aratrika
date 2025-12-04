import React, { useRef, useEffect, useState } from 'react';

const ScratchCard = ({ width = 300, height = 300, onComplete, coverColor = '#9C27B0', children }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const contextRef = useRef(null);
  const clearPercentageRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.fillStyle = coverColor;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'destination-out';
    contextRef.current = context;
  }, [width, height, coverColor]);

  const getTouchPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const scratch = (x, y) => {
    const context = contextRef.current;
    context.beginPath();
    context.arc(x, y, 25, 0, Math.PI * 2);
    context.fill();

    checkClearedArea();
  };

  const checkClearedArea = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let clearedPixels = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) {
        clearedPixels++;
      }
    }

    const totalPixels = canvas.width * canvas.height;
    const percentage = (clearedPixels / totalPixels) * 100;
    clearPercentageRef.current = percentage;

    if (percentage > 60 && !isCompleted) {
      completeCard();
    }
  };

  const completeCard = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.globalCompositeOperation = 'source-over';
    context.clearRect(0, 0, canvas.width, canvas.height);
    setIsCompleted(true);
    if (onComplete) onComplete();
  };

  const handleMouseDown = (e) => {
    if (!isCompleted) {
      setIsDrawing(true);
      const pos = getTouchPos(e);
      scratch(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && !isCompleted) {
      const pos = getTouchPos(e);
      scratch(pos.x, pos.y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e) => {
    if (!isCompleted) {
      setIsDrawing(true);
      const pos = getTouchPos(e);
      scratch(pos.x, pos.y);
    }
  };

  const handleTouchMove = (e) => {
    if (isDrawing && !isCompleted) {
      e.preventDefault();
      const pos = getTouchPos(e);
      scratch(pos.x, pos.y);
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  return (
    <div style={{ position: 'relative', width, height, borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width, height }}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: isCompleted ? 'default' : 'pointer',
          display: 'block'
        }}
      />
    </div>
  );
};

export default ScratchCard;
