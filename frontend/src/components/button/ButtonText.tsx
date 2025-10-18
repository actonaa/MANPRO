import type { MouseEventHandler } from "react"; // ✅ perbaiki baris ini

type ButtonTextProps = {
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  color?: string;
  hoverColor?: string;
  textColor?: string;
  fontWeight?: string;
};

export default function ButtonText({
  title,
  onClick,
  color = "bg-gray-100",
  hoverColor = "hover:bg-gray-200",
  textColor = "text-gray-700",
  fontWeight = "font-medium",
}: ButtonTextProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full md:flex md:items-center md:justify-center md:w-40 ${color} ${hoverColor} ${textColor} ${fontWeight} py-3 px-5 md:text-nowrap rounded-xl shadow-sm transition duration-200`}
    >
      <span>{title}</span>
    </button>
  );
}
