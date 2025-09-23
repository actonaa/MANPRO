import { useState } from "react";

interface InputLoginProps {
  placeholder: string;
  type: string;
  name: string;
}

export default function InputLogin({
  placeholder,
  name,
  type,
}: InputLoginProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isFloating = isFocused || value !== "";

  return (
    <div className="flex items-center pt-1.5 font-open w-full mb-2 md:mb-6">
      <div className="relative mx-auto lg:mx-0">
        {/* Input */}
        <input
          type={type}
          id={name}
          name={name}
          placeholder=" "
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="peer w-[335px] md:w-[578px] lg:w-[395px] h-12 rounded-xl border border-[#66666666] px-3 text-sm outline-none placeholder-transparent"
        />

        {/* Label floating */}
        <label
          htmlFor={name}
          className={`absolute left-3 px-1 transition-all duration-200 cursor-text
            ${
              isFloating
                ? "-top-2 text-xs text-[#66666666] bg-white"
                : "top-3 text-sm text-gray-400"
            }`}
        >
          {placeholder}
        </label>
      </div>
    </div>
  );
}
