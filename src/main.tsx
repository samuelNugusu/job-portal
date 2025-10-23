import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";

// ✅ Make sure you have this key in your .env file
// VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXX
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error("❌ Missing Clerk publishable key! Add VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("404")) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
              <Toaster position="top-right" richColors />
            </BrowserRouter>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
