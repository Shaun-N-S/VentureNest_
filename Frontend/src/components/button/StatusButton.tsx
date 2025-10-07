import React from "react";

interface StatusButtonProps {
  status: "active" | "inactive";
  onClick: () => void;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, onClick }) => {
  const isActive = status === "active";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200
        ${isActive ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-green-100 text-green-600 hover:bg-green-200"}
      `}
    >
      {isActive ? "Block" : "Unblock"}
    </button>
  );
};

export default StatusButton;
