import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";
import React from "react";

const Input = ({
  className,
  fullWidth,
  error,
  helperText,
  onClear,
  value,
  icon,
  ...inputProps
}) => {
  const showClearButton = Boolean(onClear) && Boolean(value);

  return (
    <div className={clsx("flex flex-col", fullWidth && "w-full")}>
      <div className="relative">
        {icon && (
          <div
            className={clsx(
              "absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center",
              "pointer-events-none" // Ensures icon does not block input interaction
            )}
          >
            {icon}
          </div>
        )}
        <input
          {...inputProps}
          className={clsx(
            className,
            "text-body2",
            "px-2 py-1",
            showClearButton && "pr-8",
            icon && "pl-8",
            "border border-solid border-grey-400",
            "placeholder:text-grey-500",
            "disabled:bg-grey-200",
            "disabled:border-transparent",
            error && "!border-red-500",
            fullWidth && "w-full" 
          )}
          value={value}
        />
        {showClearButton && (
          <button
            className={clsx(
              "p-0",
              "absolute right-2 top-1/2 -translate-y-1/2",
              "border-none",
              "bg-transparent",
              "cursor-pointer"
            )}
            type="button"
            aria-label="Clear"
            onClick={onClear}
          >
            <CloseIcon className="text-grey-500" fontSize="small" />
          </button>
        )}
      </div>
      {helperText && (
        <div className={clsx("text-body3", "mt-1", error && "text-red-500")}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
