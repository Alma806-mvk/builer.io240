import React, { useState } from "react";
import HeaderDevControls from "./HeaderDevControls";

interface FloatingDevControlsProps {
  userPlan?: string;
  refreshBilling?: () => void;
}

export const FloatingDevControls: React.FC<FloatingDevControlsProps> = ({
  userPlan: initialUserPlan,
  refreshBilling,
}) => {
  // Local state for dev controls
  const [devUserPlan, setDevUserPlan] = useState(initialUserPlan || "free");

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-32 right-6 z-40">
      <HeaderDevControls
        userPlan={devUserPlan}
        setUserPlan={setDevUserPlan}
        refreshBilling={refreshBilling}
        className=""
      />
    </div>
  );
};

export default FloatingDevControls;
