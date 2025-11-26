import { createSignal, createEffect, onCleanup, Show } from "solid-js";
import ClockIcon from "./ui/svgs/clock-icon";

interface SessionTimerProps {
  sessionCreatedAt: Date;
  sessionDurationMinutes?: number;
}

export default function SessionTimer(props: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = createSignal<number>(0);
  const sessionDuration = (props.sessionDurationMinutes || 30) * 60 * 1000; // Convert to milliseconds

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const sessionEnd = props.sessionCreatedAt.getTime() + sessionDuration;
    const remaining = sessionEnd - now;
    return Math.max(0, remaining);
  };

  // Update timer every second
  createEffect(() => {
    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Stop updating when time runs out
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  const formatTime = () => {
    const totalSeconds = Math.floor(timeRemaining() / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}m remaining`;
    } else {
      return `${seconds}s remaining`;
    }
  };

  const getColorClass = () => {
    const totalSeconds = Math.floor(timeRemaining() / 1000);
    if (totalSeconds < 60) {
      return "text-red-600 font-semibold"; // Less than 1 minute - urgent red
    } else if (totalSeconds < 300) {
      return "text-orange-600 font-medium"; // Less than 5 minutes - warning orange
    } else {
      return "text-gray-600"; // Normal state
    }
  };

  return (
    <Show
      when={timeRemaining() > 0}
      fallback={
        <span class="text-xs text-red-600 font-semibold">Session expired</span>
      }
    >
      <div class="flex items-center gap-2">
        <ClockIcon class={`w-4 h-4 ${getColorClass()}`} />
        <span class={`text-xs ${getColorClass()}`}>{formatTime()}</span>
      </div>
    </Show>
  );
}
