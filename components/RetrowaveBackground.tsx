'use client';

import React from 'react';

export default function RetrowaveBackground() {
  const [elements, setElements] = React.useState<any[]>([]);

  React.useEffect(() => {
    const newElements = [...Array(15)].map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 10,
      rotation: Math.random() * 360,
      duration: Math.random() * 3 + 2,
      type: Math.random() > 0.5 ? 'sparkle' : 'circle'
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#fbb6ce]">
      {/* Decorative Pastel Elements */}
      {elements.map((el, i) => (
        <div
          key={i}
          className={`absolute opacity-20 ${el.type === 'sparkle' ? 'animate-sparkle' : ''}`}
          style={{
            top: el.top,
            left: el.left,
            width: el.size,
            height: el.size,
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          {el.type === 'sparkle' ? (
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
            </svg>
          ) : (
            <div className="w-full h-full rounded-full border-2 border-white" />
          )}
        </div>
      ))}
      
      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
    </div>
  );
}
