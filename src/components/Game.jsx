import Answers from "./Answers";
import Prompt from "./Prompt";
import { useContext, useState, useEffect } from "react";
import { QuizContext } from "./QuizContext";

function Game() {
  const [timer, setTimer] = useState();
  const [timeUp, setTimeUp] = useState(false);
  const { resetQuiz, handleGuess, quizData, guessHistory, questionIndex } =
    useContext(QuizContext);
  const score = guessHistory.score;
  const category = quizData.category;

  useEffect(() => {
    // Reset timer when questionIndex changes
    setTimer(5);
    setTimeUp(false);
  }, [questionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setTimeUp(true);
          handleGuess(-1); // Auto-submit with no selection
          return 0;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount or question change
  }, [questionIndex]);

  return (
    <div className="text-white flex flex-col w-[700px] border-4 border-[#EAE0D5] rounded-xl p-5 bg-[#22333B]">
      <div className="flex justify-between pb-3">
        <div className="font-bold">Xxquiz.it</div>
        <div className="font-bold">{timer}</div>
        <div className="font-bold">Question {questionIndex + 1}</div>
      </div>

      <div className="flex justify-between">
        <div>
          <span className="font-bold">Category: </span>
          <span>{quizData.category}</span>
        </div>
        <div className="font-bold">
          Score: {score}/{quizData.questions.length}
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
          timeUp={timeUp}
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
