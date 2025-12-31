import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import InvestorRoutes from "./routes/InvestorRoutes";
import { Toaster } from "react-hot-toast";
import AdminRoutes from "./routes/AdminRoutes";
import { useSelector } from "react-redux";
import type { Rootstate } from "./store/store";
import { useEffect } from "react";
import { disconnectSocket, initSocket } from "./lib/socket";

function App() {
  const token = useSelector((state: Rootstate) => state.token.token);
  const userId = useSelector((state: Rootstate) => state.authData.id);

  useEffect(() => {
    if (!token || !userId) return;

    console.log("🚀 Initializing socket from App");
    initSocket(token);

    return () => {
      disconnectSocket();
    };
  }, [token, userId]);
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
