import Answers from "./Answers";
import Prompt from "./Prompt";
import { useContext } from "react";
import { QuizContext } from "./QuizContext";

function Game() {
  const { resetQuiz, handleGuess, quizData, guessHistory, questionIndex } =
    useContext(QuizContext);
  const score = guessHistory.score;
  const category = quizData.category;

  return (
    <div className="text-white flex flex-col w-[700px] border-4 border-[#EAE0D5] rounded-xl p-5 bg-[#22333B]">
      <div className="flex justify-between pb-3">
        <div>
          <div className="font-bold">Xxquiz.it</div>
          <span className="font-bold">Category: </span>
          <span>{category}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold">Question {questionIndex + 1}</div>
          <div className="font-bold">
            Score: {score}/{quizData.questions.length}
          </div>
        </div>
      </div>
      <div className="flex justify-center font-bold pb-3">
        Name the following language:
      </div>
      <div className="pb-3">
        <Prompt />
      </div>
      <div>
        <Answers
          question={quizData.questions[questionIndex]}
          answerGuessed={guessHistory.guesses[questionIndex]}
          handleGuess={handleGuess}
        />
      </div>
      <button
        className="pt-4"
        onClick={() => {
          resetQuiz();
          window.location.reload();
        }}
      >
        RESET QUIZ
      </button>
    </div>
  );
}

export default Game;
