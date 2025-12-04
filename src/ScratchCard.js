import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const ScratchCard = forwardRef(({ width = 300, height = 300, onComplete, coverColor = '#0066ff', children }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    reset: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, width, height);
      setIsCompleted(false);
      setIsDrawing(false);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);
  }, [width, height, coverColor]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const drawLine = (fromX, fromY, toX, toY) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || isCompleted) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 50;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    checkCompletion();
  };

  const scratch = (x, y) => {
    if (isCompleted) return;
    drawLine(lastPosRef.current.x, lastPosRef.current.y, x, y);
    lastPosRef.current = { x, y };
  };

  const checkCompletion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || isCompleted) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let clearedPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) clearedPixels++;
    }

    const percentage = (clearedPixels / (width * height)) * 100;
    if (percentage > 50) {
      setIsCompleted(true);
      ctx.clearRect(0, 0, width, height);
      if (onComplete) onComplete();
    }
  };

  const handleMouseDown = (e) => {
    if (isCompleted) return;
    const { x, y } = getCoords(e);
    lastPosRef.current = { x, y };
    setIsDrawing(true);
    scratch(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || isCompleted) return;
    const { x, y } = getCoords(e);
    scratch(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e) => {
    if (isCompleted) return;
    e.preventDefault();
    const { x, y } = getCoords(e);
    lastPosRef.current = { x, y };
    setIsDrawing(true);
    scratch(x, y);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing || isCompleted) return;
    e.preventDefault();
    const { x, y } = getCoords(e);
    scratch(x, y);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  return (
    <div style={{ position: 'relative', width, height, borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width, height, zIndex: 1 }}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
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
          cursor: isCompleted ? 'default' : 'grab', 
          display: 'block',
          zIndex: isCompleted ? -1 : 10,
          touchAction: 'none'
        }}
      />
    </div>
  );
});

ScratchCard.displayName = 'ScratchCard';
export default ScratchCard;
