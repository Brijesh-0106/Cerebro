import { useState } from "react";
type styleType = {
  bg: string;
  border: string;
  icon: string;
};
export const Alert = ({
  title = "Successfully saved!",
  type = "success", // success, error, warning, info
}: {
  title?: string;
  type?: "success" | "error" | "warning" | "info";
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: "bg-slate-800",
      border: "border-green-500",
      icon: "text-green-500",
    },
    error: {
      bg: "bg-slate-800",
      border: "border-red-500",
      icon: "text-red-500",
    },
    warning: {
      bg: "bg-slate-800",
      border: "border-yellow-500",
      icon: "text-yellow-500",
    },
    info: {
      bg: "bg-slate-800",
      border: "border-blue-500",
      icon: "text-blue-500",
    },
  };

  const currentStyle: styleType = styles[type];

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div
        className={`${currentStyle.bg} ${currentStyle.border} border-l-4 rounded-lg shadow-lg p-4 pr-12 min-w-80 max-w-md`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`${currentStyle.icon} shrink-0 mt-0.5`}>
            {type === "success" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {type === "error" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {type === "warning" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            {type === "info" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base">{title}</h3>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
