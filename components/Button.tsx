import { MouseEventHandler } from "react";
const Button: React.FC<{
  text: string;
  disabled?: boolean;
  clickHandler?: MouseEventHandler;
  type?: string;
  width?: number;
  className?: string;
}> = ({ text, disabled, clickHandler, type = "primary", width, className }) => {
  return (
    <button
      onClick={clickHandler}
      disabled={disabled}
      className={`text-white bg-callejero px-12 py-4 mx-auto rounded-full w-full
      font-medium
      ${
        disabled ? "opacity-40" : "hover:scale-105 transition-all"
      } ${className}`}
      style={{ width: `${width}px` }}
    >
      {text}
    </button>
  );
};

export default Button;
