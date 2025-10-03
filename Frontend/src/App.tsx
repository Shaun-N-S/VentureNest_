import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserRoutes from "./routes/UserRoutes"
import InvestorRoutes from "./routes/InvestorRoutes"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/investors/*" element={<InvestorRoutes />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App