import { createContext, useState, useEffect } from "react";
import buildQuiz from "../QuizBuilder";

const params = {
  type: "Dialect Guesser",
  numOfQuestions: 20,
  wordsPerQuestion: 15,
  category: "arabic",
  choicesPerQuestion: 4,
};

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [quizData, setQuizData] = useState(null);
  const [guessHistory, setGuessHistory] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(null);

  useEffect(() => {
    const initializeState = async () => {
      // Initialize quizData
      let savedQuizData = localStorage.getItem("quizData");
      let quiz;
      if (savedQuizData === null) {
        quiz = await buildQuiz(params);
        localStorage.setItem("quizData", JSON.stringify(quiz));
      } else {
        quiz = JSON.parse(savedQuizData);
      }
      setQuizData(quiz);

      // Initialize guessHistory
      let savedGuessHistory = localStorage.getItem("guessHistory");
      let initialGuessHistory;
      if (savedGuessHistory === null) {
        initialGuessHistory = {
          linkedTo: "insertquizidheremakingthislongsoitgoestonextline",
          guesses: Array.from({ length: quiz.questions.length }, () => -1),
          score: 0,
        };
        localStorage.setItem(
          "guessHistory",
          JSON.stringify(initialGuessHistory)
        );
      } else {
        initialGuessHistory = JSON.parse(savedGuessHistory);
      }
      setGuessHistory(initialGuessHistory);

      // Initialize questionIndex
      let savedQuestionIndex = localStorage.getItem("questionIndex");
      if (savedQuestionIndex === null) {
        localStorage.setItem("questionIndex", 0);
        setQuestionIndex(0);
      } else {
        setQuestionIndex(Number(savedQuestionIndex));
      }
    };

    initializeState();
  }, []);

  const resetQuiz = async () => {
    localStorage.clear();

    // Reset quizData
    const quiz = await buildQuiz(params);
    localStorage.setItem("quizData", JSON.stringify(quiz));
    setQuizData(quiz);

    // Reset guessHistory
    const initialGuessHistory = {
      linkedTo: "insertquizidheremakingthislongsoitgoestonextline",
      guesses: Array.from({ length: quiz.questions.length }, () => -1),
      score: 0,
    };
    localStorage.setItem("guessHistory", JSON.stringify(initialGuessHistory));
    setGuessHistory(initialGuessHistory);

    // Reset questionIndex
    localStorage.setItem("questionIndex", 0);
    setQuestionIndex(0);
  };

  const handleGuess = (index) => {
    if (
      quizData &&
      guessHistory &&
      questionIndex < quizData.questions.length - 1
    ) {
      const updatedGuessHistory = { ...guessHistory };
      updatedGuessHistory.guesses[questionIndex] = index; // Update guess history
      if (index === quizData.questions[questionIndex].rightAnswerIndex) {
        updatedGuessHistory.score += 1; // Update score
      }

      setGuessHistory(updatedGuessHistory);
      localStorage.setItem("guessHistory", JSON.stringify(updatedGuessHistory));

      // Update question index
      setTimeout(() => {
        const newIndex = questionIndex + 1;
        setQuestionIndex(newIndex);
        localStorage.setItem("questionIndex", newIndex);
      }, 500);
    } else {
      console.log("End of quiz");
    }
  };

  if (!quizData || !guessHistory || questionIndex === null) {
    return <div>Loading...</div>;
  }

  return (
    <QuizContext.Provider
      value={{
        handleGuess,
        resetQuiz,
        quizData,
        guessHistory,
        questionIndex,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export { QuizContext, QuizProvider };
