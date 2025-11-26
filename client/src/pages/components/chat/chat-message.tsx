interface ChatMessageProps {
  humanMessage: string;
  aiMessage: string;
}

export default function ChatMessage(props: ChatMessageProps) {
  return (
    <>
      {/* User Message */}
      <div class="flex justify-end">
        <div class="max-w-[80%] bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-md">
          <p class="text-sm leading-relaxed">{props.humanMessage}</p>
          <span class="text-xs opacity-75 mt-1 block">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* AI Response */}
      {props.aiMessage && (
        <div class="flex justify-start">
          <div class="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-5 py-3 shadow-md border border-gray-200">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">AI</span>
              </div>
              <span class="text-xs font-medium text-gray-600">Assistant</span>
            </div>
            <p class="text-sm text-gray-800 leading-relaxed">
              {props.aiMessage}
            </p>
            <span class="text-xs text-gray-400 mt-2 block">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
