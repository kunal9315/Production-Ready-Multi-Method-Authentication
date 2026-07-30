import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white w-[430px] rounded-xl shadow-lg p-8">
      {children}
    </div>
  );
};

export default Card;