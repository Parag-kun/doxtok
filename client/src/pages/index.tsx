import Header from "../components/header";
import DocumentSection from "./components/document";
import ChatSection from "./components/chat";
import useDocument from "./hooks/document";
import useChat from "./hooks/chat";
import { Show } from "solid-js";

export default function Page() {
  const {
    isLoading,
    createSessionMutation,
    getDocumentUrlsQuery,
    hasDocuments,
  } = useDocument();
  const {
    isLoading: chatLoading,
    getChatQuery,
    hasChats,
    askQuestionMutation,
  } = useChat();

  return (
    <div class="h-screen bg-white flex flex-col">
      <Header />
      <div class="flex-1 flex overflow-y-hidden">
        {/* Document Section - Full width when no documents, half width when documents exist */}
        <div
          class="border-r border-gray-200 max-h-full transition-all duration-500 ease-in-out"
          classList={{
            "w-full": !hasDocuments(),
            "w-1/2": hasDocuments(),
          }}
        >
          <DocumentSection
            isLoading={isLoading}
            createSessionMutation={createSessionMutation}
            getDocumentUrlsQuery={getDocumentUrlsQuery}
            hasDocuments={hasDocuments}
          />
        </div>

        {/* Chat Section - Only visible when documents exist */}
        <Show when={hasDocuments()}>
          <div class="w-1/2 max-h-full transition-all duration-500 ease-in-out">
            <ChatSection
              isLoading={chatLoading}
              getChatQuery={getChatQuery}
              hasChats={hasChats}
              onAskQuestion={(question) =>
                askQuestionMutation.mutateAsync({ question })
              }
            />
          </div>
        </Show>
      </div>
    </div>
  );
}
