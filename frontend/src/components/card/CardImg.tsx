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
  onClick?: MouseEventHandler<HTMLButtonElement>; // ⬅️ props event klik
};

export default function ActionButton({
  title,
  img,
  color = "white",
  hoverColor = "#f9fafb",
  borderColor = "#d1d5dc",
  textColor = "gray-600",
  px = "6",
  justify,
  fontWeight,
  onClick,
}: CardImageProps) {
  const [bg, setBg] = useState(color);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setBg(hoverColor)}
      onMouseLeave={() => setBg(color)}
      style={{
        borderColor: borderColor,
        backgroundColor: bg,
      }}
      className={`
        flex items-center ${justify} gap-2 border rounded-[14px]
        px-${px} py-3 active:scale-[0.98] transition-all duration-200
        shadow-sm w-full
      `}
    >
      <img src={img} alt={title} className="w-5 h-5" />
      <span className={`text-${textColor} text-sm ${fontWeight}`}>{title}</span>
    </button>
  );
}
