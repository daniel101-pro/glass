'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  opacity: number;
  size: number;
  shape: 'square' | 'circle' | 'triangle';
}

export default function GlassConfetti() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Generate confetti pieces
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        fallSpeed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.3,
        size: Math.random() * 12 + 8,
        shape: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)] as 'square' | 'circle' | 'triangle',
      });
    }
    setConfetti(pieces);

    // Animation loop
    const animate = () => {
      setConfetti((prevConfetti) =>
        prevConfetti.map((piece) => ({
          ...piece,
          y: piece.y + piece.fallSpeed,
          rotation: piece.rotation + piece.rotationSpeed,
          x: piece.x + Math.sin(piece.y * 0.01) * 0.5, // Slight horizontal drift
        })).filter((piece) => piece.y < window.innerHeight + 50)
      );
    };

    const interval = setInterval(animate, 16); // 60fps

    // Clean up after 15 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setConfetti([]);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const getShapeStyle = (piece: ConfettiPiece) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: piece.x,
      top: piece.y,
      width: piece.size,
      height: piece.size,
      opacity: piece.opacity,
      transform: `rotate(${piece.rotation}deg)`,
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      pointerEvents: 'none' as const,
    };

    switch (piece.shape) {
      case 'circle':
        return {
          ...baseStyle,
          borderRadius: '50%',
        };
      case 'triangle':
        return {
          ...baseStyle,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        };
      default: // square
        return {
          ...baseStyle,
          borderRadius: '3px',
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          style={getShapeStyle(piece)}
        />
      ))}
    </div>
  );
}
