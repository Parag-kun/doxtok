import ChatBubbleIcon from "../../../components/ui/svgs/chat-bubble-icon";

export default function ChatPlaceholder() {
  return (
    <div class="flex flex-col items-center justify-center h-full py-12 px-6">
      <div class="max-w-md text-center">
        {/* Icon */}
        <div class="mb-6 flex justify-center">
          <div class="w-20 h-20 bg-linear-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
            <ChatBubbleIcon class="w-10 h-10 text-orange-600" />
          </div>
        </div>

        {/* Title */}
        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          No Conversations Yet
        </h3>

        {/* Description */}
        <p class="text-gray-500 mb-6 leading-relaxed">
          Start chatting about your documents! Ask questions, get summaries, or
          explore key insights from your uploaded files.
        </p>

        {/* Suggestions */}
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
          <div class="space-y-2">
            <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 text-left hover:border-orange-300 transition-colors cursor-pointer">
              <p class="text-sm text-gray-700">
                "Summarize the key points from this document"
              </p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 text-left hover:border-orange-300 transition-colors cursor-pointer">
              <p class="text-sm text-gray-700">
                "What are the main topics discussed?"
              </p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 text-left hover:border-orange-300 transition-colors cursor-pointer">
              <p class="text-sm text-gray-700">
                "Extract important dates and deadlines"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
