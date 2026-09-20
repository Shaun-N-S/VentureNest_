import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store.ts'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import 'react-advanced-cropper/dist/style.css';
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query error:', error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.error('Mutation error:', error)

      if (!mutation.options.onError) {
        toast.error('Something went wrong. Please try again.')
      }
    },
  }),
})

createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              < App />
              <ReactQueryDevtools />
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
)
