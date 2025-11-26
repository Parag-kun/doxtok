import { createSignal } from "solid-js";
import Logo from "./logo";
import ConfirmModal from "./ui/confirm-modal";
import SessionTimer from "./session-timer";
import { useGetSessionQuery } from "../apis/session";
import { useDeleteSessionMutation } from "../apis/session";
import { useQueryClient } from "@tanstack/solid-query";

export default function Header() {
  const queryClient = useQueryClient();

  const getSessionQuery = useGetSessionQuery();
  const deleteSessionMutation = useDeleteSessionMutation(queryClient);

  const [showEndSessionModal, setShowEndSessionModal] = createSignal(false);

  return (
    <>
      <div class="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <Logo />
        {getSessionQuery.data && (
          <div class="flex items-center gap-4">
            <SessionTimer sessionCreatedAt={getSessionQuery.data} />
            <button
              onclick={() => setShowEndSessionModal(true)}
              class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
            >
              End Session
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showEndSessionModal()}
        onClose={() => setShowEndSessionModal(false)}
        onConfirm={() => {
          deleteSessionMutation.mutateAsync();
        }}
        title="End Session"
        message="Are you sure you want to end this session? All uploaded documents and chat history will be cleared."
        confirmText="Yes, End Session"
        cancelText="Cancel"
      />
    </>
  );
}
