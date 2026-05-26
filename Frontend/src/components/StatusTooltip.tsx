import React, { useEffect, useState, useRef } from "react";

interface StatusTooltipProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void; // Callback to close the tooltip
  duration?: number; // Duration in milliseconds before auto-closing
}

const StatusTooltip: React.FC<StatusTooltipProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const timerRef = useRef<number | null>(null); // Use number for `setTimeout` in TypeScript

  useEffect(() => {
    startTimer();

    return () => {
      clearTimer(); // Cleanup timer on unmount
    };
  }, [onClose, duration]);

  const startTimer = () => {
    clearTimer(); // Clear any existing timer before starting a new one
    timerRef.current = window.setTimeout(() => {
      setShowTooltip(false);
      onClose(); // Automatically close the tooltip after the duration
    }, duration);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopTimer = () => {
    clearTimer(); // Stop the timer when hovering
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return showTooltip ? (
    <div
      className={`fixed flex items-start justify-between top-4 right-4 px-4 py-2 text-white rounded shadow-lg ${getBackgroundColor()} w-[300px] z-50`}
      onMouseEnter={stopTimer} // Stop the timer on hover
      onMouseLeave={startTimer} // Resume the timer when hover ends
    >
      <span>{message}</span>
      <button
        onClick={() => {
          clearTimer(); // Clear the timer when manually closing
          setShowTooltip(false);
          onClose();
        }}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  ) : null;
};

export default StatusTooltip;
