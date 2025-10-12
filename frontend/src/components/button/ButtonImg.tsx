import { useState, type MouseEventHandler } from "react";

type CardImageProps = {
  title: string;
  img: string;
  color?: string;
  hoverColor?: string;
  borderColor?: string;
  textColor?: string;
  px?: string;
  justify?: string;
  fontWeight?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonImg({
  title,
  img,
  color = "white",
  hoverColor = "#f9fafb",
  borderColor = "#d1d5dc",
  textColor = "gray-600",
  px = "6",
  justify,
  fontWeight = "font-medium",
  onClick,
}: CardImageProps) {
  const [bg, setBg] = useState(color);
  const [border, setBorder] = useState(borderColor);

  const handleMouseEnter = () => {
    if (color === "white") {
      setBg("#f9fafb");
      setBorder("#d1d5dc");
    } else {
      setBg(hoverColor);
      setBorder(hoverColor || borderColor);
    }
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
      }}
      className={`flex items-center ${justify} gap-2 border rounded-[14px] px-${px} py-3 md:py-0 active:scale-[0.98] transition-all duration-200 shadow-sm w-full md:w-auto`}
    >
      <img src={img} alt={title} className="w-5 h-5" />
      <span className={`text-${textColor} text-sm ${fontWeight}`}>{title}</span>
    </button>
  );
}
