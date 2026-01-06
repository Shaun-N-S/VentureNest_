import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import InvestorRoutes from "./routes/InvestorRoutes";
import { Toaster } from "react-hot-toast";
import AdminRoutes from "./routes/AdminRoutes";
import { useSelector } from "react-redux";
import type { Rootstate } from "./store/store";
import { useSocketInit } from "./hooks/Socket/useSocketInit";

function App() {
  const isAuthenticated = useSelector(
    (state: Rootstate) => !!state.authData.id
  );

  useSocketInit(isAuthenticated);
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/investor/*" element={<InvestorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
