import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  register,
  name,
  rules,
  error,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...(register
          ? typeof register === "function"
            ? register(name, rules)
            : register
          : {})}
        className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="text-red-500 text-sm">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default Input;