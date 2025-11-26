import { Show } from "solid-js";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal(props: ConfirmModalProps) {
  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 bg-black opacity-50 z-40 transition-opacity"
        onclick={props.onClose}
      />

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all"
          onclick={(e: MouseEvent) => e.stopPropagation()}
        >
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">{props.title}</h3>
          </div>
          <div class="px-6 py-4">
            <p class="text-gray-600 leading-relaxed">{props.message}</p>
          </div>

          <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              onclick={props.onClose}
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              {props.cancelText || "No"}
            </button>
            <button
              onclick={() => {
                props.onConfirm();
                props.onClose();
              }}
              class="px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow font-medium"
            >
              {props.confirmText || "Yes"}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
