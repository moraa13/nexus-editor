import { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocity: {
    x: number;
    y: number;
    rotation: number;
  };
}

const confettiColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

export default function ConfettiAnimation({ isActive, onComplete }: ConfettiAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [animationId, setAnimationId] = useState<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Create confetti pieces
    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 3 + 2,
        rotation: (Math.random() - 0.5) * 10
      }
    }));

    setConfetti(pieces);

    // Start animation
    let startTime = Date.now();
    const duration = 3000; // 3 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setConfetti([]);
        onComplete?.();
        return;
      }

      setConfetti(prev => prev.map(piece => ({
        ...piece,
        x: piece.x + piece.velocity.x,
        y: piece.y + piece.velocity.y,
        rotation: piece.rotation + piece.velocity.rotation,
        velocity: {
          ...piece.velocity,
          y: piece.velocity.y + 0.1 // gravity
        }
      })).filter(piece => piece.y < window.innerHeight + 50));

      const id = requestAnimationFrame(animate);
      setAnimationId(id);
    };

    const id = requestAnimationFrame(animate);
    setAnimationId(id);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, onComplete]);

  if (!isActive || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: piece.x,
            top: piece.y,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            boxShadow: `0 0 6px ${piece.color}`
          }}
        />
      ))}
    </div>
  );
}

