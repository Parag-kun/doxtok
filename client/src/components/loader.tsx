import { type Component } from "solid-js";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

const Loader: Component<LoaderProps> = (props) => {
  const size = props.size || "md";

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div class="flex items-center justify-center">
      <div class="relative" classList={{ [sizeClasses[size]]: true }}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .loader-ring {
            animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          }
          .loader-ring:nth-child(1) {
            animation-delay: -0.45s;
          }
          .loader-ring:nth-child(2) {
            animation-delay: -0.3s;
          }
          .loader-ring:nth-child(3) {
            animation-delay: -0.15s;
          }
        `}</style>
        <div
          class="loader-ring absolute border-4 rounded-full loader-ring"
          style={{
            width: "100%",
            height: "100%",
            "border-color": "#f97316 transparent transparent transparent",
          }}
        />
        <div
          class="loader-ring absolute border-4 rounded-full loader-ring"
          style={{
            width: "100%",
            height: "100%",
            "border-color": "#f97316 transparent transparent transparent",
          }}
        />
        <div
          class="loader-ring absolute border-4 rounded-full loader-ring"
          style={{
            width: "100%",
            height: "100%",
            "border-color": "#f97316 transparent transparent transparent",
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
