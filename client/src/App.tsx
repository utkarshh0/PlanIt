import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Auth from './pages/AuthPage'
import Calendar from "./pages/EventPage"
// import { ModeToggle } from "./components/ThemeToggle"
const App : React.FC = () => {
  return(
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Auth />} /> */}
          <Route path="/" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App