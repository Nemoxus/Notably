import React, { useState, useEffect } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const secondsDegrees = (time.getSeconds() / 60) * 360;
  const minutesDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hoursDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  return (
    <div className="analog-clock">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Clock face */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="2" />
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="15"
            transform={`rotate(${i * 30} 50 50)`}
            stroke="#333"
            strokeWidth="2"
          />
        ))}

        {/* Second markers (excluding positions where hour markers are) */}
        {[...Array(60)].map((_, i) => (
          i % 5 !== 0 && (
            <line
              key={i}
              x1="50"
              y1="12"
              x2="50"
              y2="14"
              transform={`rotate(${i * 6} 50 50)`}
              stroke="#999"
              strokeWidth="1"
            />
          )
        ))}

        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="#333"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${hoursDegrees} 50 50)`}
        />

        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          stroke="#666"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minutesDegrees} 50 50)`}
        />

        {/* Second hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="#f00"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondsDegrees} 50 50)`}
        />

        {/* Center dot */}
        <circle cx="50" cy="50" r="2" fill="#333" />
      </svg>
    </div>
  );
};

export default AnalogClock;
