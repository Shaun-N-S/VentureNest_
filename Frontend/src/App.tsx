import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserRoutes from "./routes/UserRoutes"
import InvestorRoutes from "./routes/InvestorRoutes"
import { Toaster } from "react-hot-toast"
import AdminRoutes from "./routes/AdminRoutes"

function App() {
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
  )
}

export default App