import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./components/QuizContext";
import Game from "./components/Game";
import GameSetup from "./components/GameSetup";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0908]">
        <QuizProvider>
          <Routes>
            <Route path="/setup" element={<GameSetup />}></Route>
            <Route path="/" element={<Game />} />
          </Routes>
        </QuizProvider>
      </div>
    </Router>
  );
}

export default App;
