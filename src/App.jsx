import data from "../Languages/Arabic/Arabic.json";
import Game from "./components/Game";
import { QuizProvider } from "./components/QuizContext";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0908]">
      <QuizProvider>
        <Game />
      </QuizProvider>
    </div>
  );
}

export default App;
