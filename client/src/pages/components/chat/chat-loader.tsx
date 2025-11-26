import Loader from "../../../components/loader";

export default function ChatLoader() {
  return (
    <div class="flex justify-start items-center gap-2">
      <Loader size="sm" />
      <div class="text-sm text-gray-600">
        Please wait while we fetch the response...
      </div>
    </div>
  );
}
