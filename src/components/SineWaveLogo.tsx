import React from 'react';

export interface SineWaveLogoProps {
  darkMode: boolean;
}

const SineWaveLogo: React.FC<SineWaveLogoProps> = ({ darkMode }) => {
  const svgVisibleWidth = 40;         // Width of the visible part of the wave
  const waveAmplitude = 14;           // Amplitude of the wave (pixels from center)
  const waveHeight = waveAmplitude * 2; // Total height of the SVG canvas for the wave (28px)
  const verticalCenter = waveAmplitude; // Y-coordinate for the center line of the wave
  
  const waveLength = svgVisibleWidth;   // Length of one full sine cycle (same as visible width)
  const numCyclesToDraw = 2;            // Draw two cycles for a seamless looping animation
  const totalPathWidth = waveLength * numCyclesToDraw;
  const segmentsPerCycle = 20;          // Number of line segments to draw per sine cycle for smoothness

  // Generate the SVG path string for the sine wave
  let pathD = `M 0 ${verticalCenter}`;
  for (let i = 0; i <= segmentsPerCycle * numCyclesToDraw; i++) {
    const x = (i / segmentsPerCycle) * waveLength;
    // Calculate angle for sine function: (i / segmentsPerCycle) gives progress through one cycle
    const angle = (i / segmentsPerCycle) * (2 * Math.PI);
    const y = verticalCenter - waveAmplitude * Math.sin(angle);
    pathD += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return (
    <div 
      className="logo-wave-container mr-2" // Class for targeting hover
      style={{ 
        width: `${svgVisibleWidth}px`, 
        height: `${waveHeight}px`, 
        overflow: 'hidden', // Clip the SVG to the visible width
      }}
    >
      <svg
        width={totalPathWidth} // SVG is wider than container to allow scrolling content
        height={waveHeight}
        className="sine-wave-svg" // Class for targeting the SVG itself
      >
        <path
          d={pathD}
          stroke={darkMode ? '#4ade80' : '#22c55e'} // Tailwind: green-400 (dark), green-500 (light)
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <style>{`
        .logo-wave-container:hover .sine-wave-svg {
          animation: scrollWave 2s linear infinite;
        }
        @keyframes scrollWave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${waveLength}px); /* Scroll one full cycle width */
          }
        }
      `}</style>
    </div>
  );
};

export default SineWaveLogo; 