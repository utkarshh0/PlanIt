import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthPage from './pages/AuthPage'
import EventPage from "./pages/EventPage"
// import { ModeToggle } from "./components/ThemeToggle"
const App : React.FC = () => {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/events" element={<EventPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App