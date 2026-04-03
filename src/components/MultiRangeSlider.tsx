"use client";
import React, { useState, useEffect, useRef } from "react";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  onChange: (args: { min: number; max: number }) => void;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  min,
  max,
  step = 1,
  initialMin,
  initialMax,
  onChange,
}) => {
  const [minVal, setMinVal] = useState(initialMin ?? min);
  const [maxVal, setMaxVal] = useState(initialMax ?? max);
  const minValRef = useRef(initialMin ?? min);
  const maxValRef = useRef(initialMax ?? max);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = (value: number) => Math.round(((value - min) / (max - min)) * 100);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, max]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, max]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(value);
    minValRef.current = value;
    onChange({ min: value, max: maxVal });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(value);
    maxValRef.current = value;
    onChange({ min: minVal, max: value });
  };

  return (
    <div className="relative w-full flex items-center h-5">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        className="dual-thumb"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        className="dual-thumb"
        style={{ zIndex: 4 }}
      />

      <div className="relative w-full">
        <div className="absolute rounded-md h-[4px] bg-gray-200 w-full -top-[2px]" />
        <div ref={range} className="absolute rounded-md h-[4px] bg-orange-500 -top-[2px]" />
      </div>
    </div>
  );
};

export default MultiRangeSlider;
