import React from "react";

const Button = ({
  children,
  loading = false,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;