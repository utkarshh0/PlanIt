import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from './components/Auth'
import Calendar from "./components/Calendar"
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