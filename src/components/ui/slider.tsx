"use client";

import * as React from "react";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  className = "",
}) => {
  const [isDragging, setIsDragging] = React.useState<number | null>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const getValueFromPosition = React.useCallback((clientX: number) => {
    if (!sliderRef.current) return min;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const newValue = min + percentage * (max - min);
    return Math.round(Math.max(min, Math.min(max, newValue)) / step) * step;
  }, [min, max, step]);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    setIsDragging(index);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging !== null) {
        const newValue = getValueFromPosition(e.clientX);
        const newValues = [...value];
        
        if (isDragging === 0) {
          newValues[0] = Math.min(newValue, value[1] || max);
        } else {
          newValues[1] = Math.max(newValue, value[0] || min);
        }
        
        onValueChange(newValues);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, value, min, max, onValueChange, getValueFromPosition]);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full h-6 ${className}`}>
      <div
        ref={sliderRef}
        className="absolute top-1/2 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2 cursor-pointer"
      >
        {/* Track highlight */}
        <div
          className="absolute h-2 bg-primary-600 rounded-full"
          style={{
            left: `${getPercentage(value[0] || min)}%`,
            width: `${getPercentage(value[1] || value[0] || min) - getPercentage(value[0] || min)}%`,
          }}
        />
        
        {/* Thumb 1 */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary-600 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 shadow-md"
          style={{
            left: `${getPercentage(value[0] || min)}%`,
            top: '50%',
          }}
          onMouseDown={handleMouseDown(0)}
        />
        
        {/* Thumb 2 (if range) */}
        {value.length > 1 && (
          <div
            className="absolute w-4 h-4 bg-white border-2 border-primary-600 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 shadow-md"
            style={{
              left: `${getPercentage(value[1])}%`,
              top: '50%',
            }}
            onMouseDown={handleMouseDown(1)}
          />
        )}
      </div>
    </div>
  );
};