import { useEffect, useState, useContext } from "react";
import { QuizContext } from "./QuizContext";

function Answers() {
  const { guessHistory, handleGuess, quizData, questionIndex } =
    useContext(QuizContext);
  const [clicked, setClicked] = useState(false);
  const [guessedIndex, setGuessedIndex] = useState(-1);
  const [rightAnswerIndex, setRightAnswerIndex] = useState(
    quizData.questions[questionIndex].rightAnswerIndex
  );
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setClicked(false);
    setRightAnswerIndex(quizData.questions[questionIndex].rightAnswerIndex);
    setShowAnswer(
      guessHistory.guesses[questionIndex] ===
        quizData.questions[questionIndex].rightAnswerIndex
    );
    setGuessedIndex(guessHistory.guesses[questionIndex]);
  }, [questionIndex]);

  const handleClick = (index) => {
    if (!clicked) {
      setClicked(!clicked);
      setShowAnswer(true);
      setGuessedIndex(index);
      handleGuess(index);
    }
  };

  const getButtonStyle = (index) => {
    if (showAnswer) {
      if (index === rightAnswerIndex && index === guessedIndex) {
        // if you guessed this and were right
        return "bg-green-500";
      }
      if (index === rightAnswerIndex && index !== guessedIndex) {
        // if you didn't guess this but it was right
        return "bg-blue-500";
      }
      if (index === guessedIndex && index !== rightAnswerIndex) {
        // if you guessed this but were wrong
        return "bg-red-500";
      }
    }
    return "bg-[#EAE0D5]";
  };

  return (
    <div className="text-black grid grid-cols-2 gap-4 w-full">
      {quizData.questions[questionIndex].answers.map((answerText, index) => (
        <button
          onClick={() => {
            handleClick(index);
          }}
          key={index}
          className={`p-5 rounded-xl ${getButtonStyle(index)}`}
        >
          {answerText}
        </button>
      ))}
    </div>
  );
}

export default Answers;
