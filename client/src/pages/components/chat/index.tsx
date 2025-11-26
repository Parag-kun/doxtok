import { createSignal, createEffect, For, Show, type Accessor } from "solid-js";
import ChatMessage from "./chat-message";
import ChatLoader from "./chat-loader";
import ChatPlaceholder from "./chat-placeholder";
import SendIcon from "../../../components/ui/svgs/send-icon";
import { type DefinedUseQueryResult } from "@tanstack/solid-query";
import { type GetChatResBody } from "../../../apis/chat";

type ChatSectionProps = {
  isLoading: Accessor<boolean>;
  getChatQuery: DefinedUseQueryResult<GetChatResBody | null, Error>;
  hasChats: () => boolean | undefined;
  onAskQuestion: (question: string) => void;
};

export default function ChatSection({
  isLoading,
  getChatQuery,
  hasChats,
  onAskQuestion,
}: ChatSectionProps) {
  const [question, setQuestion] = createSignal("");
  let messagesEndRef: HTMLDivElement | undefined;

  // Auto-scroll to bottom when messages change
  createEffect(() => {
    const chats = getChatQuery.data?.data.chats;
    const loading = isLoading();

    // Trigger scroll when chats change or loading state changes
    if (chats || loading) {
      setTimeout(() => {
        messagesEndRef?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  });

  const handleAskQuestion = () => {
    onAskQuestion(question());
    setQuestion("");
  };

  return (
    <div class="h-full flex flex-col bg-linear-to-br from-gray-50 to-gray-100">
      {/* Chat Header */}
      {/* <div class="px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800">Document Chat</h2>
        <p class="text-sm text-gray-500 mt-1">
          Ask questions about your documents
        </p>
      </div> */}

      {/* Messages Container */}
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <Show when={hasChats()} fallback={<ChatPlaceholder />}>
          <For each={getChatQuery.data?.data.chats || []}>
            {(message) => (
              <ChatMessage
                humanMessage={message.question}
                aiMessage={message.answer || ""}
              />
            )}
          </For>
          {isLoading() && <ChatLoader />}
          {/* Invisible element at the bottom for scrolling */}
          <div ref={messagesEndRef} />
        </Show>
      </div>

      {/* Input Area */}
      <div class="px-6 py-4 bg-white border-t border-gray-200">
        <div class="flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask a question about your document..."
            class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
            value={question()}
            onInput={(e) => setQuestion(e.currentTarget.value)}
          />
          <button
            class="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onclick={handleAskQuestion}
            disabled={question().trim() === ""}
          >
            <SendIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
