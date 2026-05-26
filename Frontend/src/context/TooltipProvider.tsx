import React, { createContext, useContext, useState } from "react";
import StatusTooltip from "../components/StatusTooltip";

interface TooltipContextProps {
  showTooltip: (message: string, type?: "success" | "error" | "info") => void;
}

const TooltipContext = createContext<TooltipContextProps | undefined>(
  undefined
);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tooltip, setTooltip] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({
    message: "",
    type: "info",
    visible: false,
  });

  const showTooltip = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setTooltip({ message, type, visible: true });

    const timer = setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 3000); // Auto-hide after 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  };

  return (
    <TooltipContext.Provider value={{ showTooltip }}>
      {children}
      {tooltip.visible && (
        <StatusTooltip
          key={`${tooltip.message}-${tooltip.type}`} // Add a unique key
          message={tooltip.message}
          type={tooltip.type}
          onClose={() => setTooltip((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </TooltipContext.Provider>
  );
};

export const useTooltip = (): TooltipContextProps => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
};
