import MajorFileInput from "./major-file-input";
import DocumentCard from "./document-card";
import { Show, type Accessor } from "solid-js";
import Loader from "../../../components/loader";
import {
  type DefinedUseQueryResult,
  type UseMutationResult,
} from "@tanstack/solid-query";
import { type APIResponse } from "../../../apis/types";
import { type CreateSessionReqBody } from "../../../apis/session";
import { type DocumentUrlsRes } from "../../../apis/document";

type DocumentSectionProps = {
  isLoading: Accessor<boolean>;
  createSessionMutation: UseMutationResult<
    APIResponse,
    Error,
    CreateSessionReqBody,
    unknown
  >;
  getDocumentUrlsQuery: DefinedUseQueryResult<DocumentUrlsRes | null, Error>;
  hasDocuments: () => boolean | undefined;
};

export default function DocumentSection({
  isLoading,
  createSessionMutation,
  getDocumentUrlsQuery,
  hasDocuments,
}: DocumentSectionProps) {
  return (
    <div class="h-full flex flex-col">
      {isLoading() ? (
        <div class="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <Show
          when={hasDocuments()}
          fallback={
            <div class="flex-1 flex justify-center items-center">
              <MajorFileInput
                onFileSelect={(files) =>
                  createSessionMutation.mutateAsync({ documents: files })
                }
              />
            </div>
          }
        >
          <div class="flex-1 overflow-y-auto p-6">
            <div class="mb-4">
              <h2 class="text-xl font-semibold text-gray-800">
                Your Documents
              </h2>
              <p class="text-sm text-gray-500 mt-1">
                {getDocumentUrlsQuery.data?.data.documentUrls.length}{" "}
                document(s) uploaded
              </p>
            </div>
            <div class="space-y-3">
              {getDocumentUrlsQuery.data?.data.documentUrls.map(
                (url, index) => (
                  <DocumentCard
                    url={url}
                    index={index}
                    baseUrl={import.meta.env.VITE_DOXTOK_SERVER_BASE_URL}
                  />
                )
              )}
            </div>
          </div>
        </Show>
      )}
    </div>
  );
}
