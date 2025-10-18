import { useState, type MouseEventHandler } from "react";

type ButtonCardProps = {
  title: string;
  color?: string;
  hoverColor?: string;
  borderColor?: string;
  textColor?: string;
  px?: string;
  justify?: string;
  fontWeight?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonCard({
  title,
  color = "white",
  hoverColor = "#f9fafb",
  borderColor = "#d1d5dc",
  textColor = "#4b5563", // default: gray-600
  px = "6",
  justify = "justify-center",
  fontWeight = "font-medium",
  onClick,
}: ButtonCardProps) {
  const [bg, setBg] = useState(color);
  const [border, setBorder] = useState(borderColor);

  const handleMouseEnter = () => {
    setBg(hoverColor);
    setBorder(hoverColor || borderColor);
  };

  const handleMouseLeave = () => {
    setBg(color);
    setBorder(borderColor);
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: bg,
        borderColor: border,
        color: textColor,
      }}
      className={`flex items-center ${justify} border rounded-[14px] px-${px} py-3 md:py-2 active:scale-[0.98] transition-all duration-200 shadow-sm w-full md:w-auto`}
    >
      <span className={`text-sm ${fontWeight}`}>{title}</span>
    </button>
  );
}
