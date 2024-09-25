import { useEffect, useState, useContext } from "react";
import { QuizContext } from "./QuizContext";

function Answers({ question, answerGuessed, handleGuess, timeUp }) {
  const { guessHistory, quizData, questionIndex } = useContext(QuizContext);
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

  useEffect(() => {
    if (timeUp) {
      setClicked(true);
      setShowAnswer(true);
      setGuessedIndex(-1); // No guess
    }
  }, [timeUp]);

  const handleClick = (index) => {
    if (!clicked && !timeUp) {
      setClicked(true);
      setShowAnswer(true);
      setGuessedIndex(index);
      handleGuess(index);
    }
  };

  const getButtonStyle = (index) => {
    if (showAnswer) {
      if (index === rightAnswerIndex && index === guessedIndex) {
        return "bg-green-500";
      }
      if (index === rightAnswerIndex && index !== guessedIndex) {
        return "bg-blue-500";
      }
      if (index === guessedIndex && index !== rightAnswerIndex) {
        return "bg-red-500";
      }
      if (guessedIndex === -1 && index === rightAnswerIndex) {
        return "bg-blue-500";
      }
    }
    return "bg-[#EAE0D5]";
  };

  return (
    <div className="text-black grid grid-cols-2 gap-4 w-full">
      {question.answers.map((answerText, index) => (
        <button
          onClick={() => {
            handleClick(index);
          }}
          key={index}
          className={`p-5 rounded-xl ${getButtonStyle(index)}`}
          disabled={clicked || timeUp}
        >
          {answerText}
        </button>
      ))}
    </div>
  );
}

export default Answers;
