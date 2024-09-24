import { useContext } from "react";
import { QuizContext } from "./QuizContext";

function Prompt() {
  const { quizData, questionIndex } = useContext(QuizContext);
  return (
    <div className="text-black text-center rounded-xl bg-[#EAE0D5] p-7">
      {quizData.questions[questionIndex].prompt}
    </div>
  );
}

export default Prompt;
