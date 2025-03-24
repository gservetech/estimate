"use client";

interface PaymentStatusProps {
  paymentStatus: string;
  message?: string;
}

export const PaymentStatus = ({
  paymentStatus,
  message,
}: PaymentStatusProps) => {
  if (paymentStatus === "idle") return null;

  const statusConfig = {
    loading: {
      text: "Processing payment...",
      className: "bg-blue-50 border border-blue-200 text-blue-700",
      icon: (
        <svg
          className="h-5 w-5 text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    success: {
      text: "Payment successful!",
      className: "bg-green-50 border border-green-200 text-green-700",
      icon: (
        <svg
          className="h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    error: {
      text: message || "Payment failed. Please try again.",
      className: "bg-red-50 border border-red-200 text-red-700",
      icon: (
        <svg
          className="h-5 w-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const config =
    statusConfig[paymentStatus as keyof typeof statusConfig] ||
    statusConfig.error;

  return (
    <div className={`w-full p-4 rounded-md ${config.className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">{config.icon}</div>
        <p className="text-sm font-medium">{config.text}</p>
      </div>
    </div>
  );
};
