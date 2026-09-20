import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import InvestorRoutes from "./routes/InvestorRoutes";
import { Toaster } from "react-hot-toast";
import { useSocketInit } from "./hooks/Socket/useSocketInit";

const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

const AdminRoutesFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

function App() {
  useSocketInit();
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/investor/*" element={<InvestorRoutes />} />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminRoutesFallback />}>
                <AdminRoutes />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
