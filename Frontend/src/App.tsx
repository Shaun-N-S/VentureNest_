import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserRoutes from "./routes/UserRoutes"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App