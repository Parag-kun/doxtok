import DocumentIcon from "../../../components/ui/svgs/document-icon";
import ExternalLinkIcon from "../../../components/ui/svgs/external-link-icon";

interface DocumentCardProps {
  url: string;
  index: number;
  baseUrl: string;
}

export default function DocumentCard(props: DocumentCardProps) {
  const fullUrl = `${props.baseUrl}${props.url}`;
  const fileName = props.url.split("/").pop() || `Document ${props.index + 1}`;

  return (
    <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div class="flex items-center gap-4">
        {/* Document Icon */}
        <div class="shrink-0 w-12 h-12 bg-linear-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
          <DocumentIcon class="w-6 h-6 text-orange-600" />
        </div>

        {/* Document Info */}
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-medium text-gray-900 truncate">{fileName}</h3>
          <p class="text-xs text-gray-500 truncate mt-1">{props.url}</p>
        </div>

        {/* Open Button */}
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow flex items-center gap-2"
        >
          <span>Open</span>
          <ExternalLinkIcon class="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
