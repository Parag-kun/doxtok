import { QueryClientProvider } from "@tanstack/solid-query";
import Page from "./pages";
import { QueryClient } from "@tanstack/query-core";
import { Toaster } from "solid-toast";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Page />
    </QueryClientProvider>
  );
}

export default App;
