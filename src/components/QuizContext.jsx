// QuizProvider.jsx
import { createContext, useState, useEffect } from "react";
import generateQuiz from "../NewQuiz";

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [quizData, setQuizData] = useState(null);
  const [guessHistory, setGuessHistory] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [error, setError] = useState(null);

  const params = {
    numOfQuestions: 20,
    wordsPerQuestion: 15,
    choicesPerQuestion: 4,
    filterKey: "type",
    filterValue: "cyrillic",
  };

  useEffect(() => {
    const initializeState = async () => {
      try {
        let savedQuizData = localStorage.getItem("quizData");
        let quiz;
        if (savedQuizData === null) {
          quiz = await generateQuiz(params);
          localStorage.setItem("quizData", JSON.stringify(quiz));
        } else {
          quiz = JSON.parse(savedQuizData);
        }
        setQuizData(quiz);

        let savedGuessHistory = localStorage.getItem("guessHistory");
        let initialGuessHistory;
        if (savedGuessHistory === null) {
          initialGuessHistory = {
            linkedTo: quiz.name,
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

        let savedQuestionIndex = localStorage.getItem("questionIndex");
        if (savedQuestionIndex === null) {
          localStorage.setItem("questionIndex", "0");
          setQuestionIndex(0);
        } else {
          setQuestionIndex(Number(savedQuestionIndex));
        }
      } catch (err) {
        console.error("Error initializing quiz:", err);
        setError(err.message);
      }
    };

    initializeState();
  }, []);

  const resetQuiz = async () => {
    localStorage.removeItem("quizData");
    localStorage.removeItem("guessHistory");
    localStorage.removeItem("questionIndex");

    try {
      const quiz = await generateQuiz(params);
      localStorage.setItem("quizData", JSON.stringify(quiz));
      setQuizData(quiz);

      const initialGuessHistory = {
        linkedTo: quiz.name,
        guesses: Array.from({ length: quiz.questions.length }, () => -1),
        score: 0,
      };
      localStorage.setItem("guessHistory", JSON.stringify(initialGuessHistory));
      setGuessHistory(initialGuessHistory);

      localStorage.setItem("questionIndex", "0");
      setQuestionIndex(0);
      setIsQuizCompleted(false);
    } catch (err) {
      console.error("Error resetting quiz:", err);
      setError(err.message);
    }
  };

  const handleGuess = (index) => {
    if (!quizData || !guessHistory || isQuizCompleted) {
      return;
    }

    const updatedGuessHistory = { ...guessHistory };
    updatedGuessHistory.guesses[questionIndex] = index;

    if (index === quizData.questions[questionIndex].rightAnswerIndex) {
      updatedGuessHistory.score += 1;
    }

    setGuessHistory(updatedGuessHistory);
    localStorage.setItem("guessHistory", JSON.stringify(updatedGuessHistory));

    if (questionIndex < quizData.questions.length - 1) {
      setTimeout(() => {
        const newIndex = questionIndex + 1;
        setQuestionIndex(newIndex);
        localStorage.setItem("questionIndex", newIndex.toString());
      }, 1000);
    } else {
      setIsQuizCompleted(true);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        isQuizCompleted,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export { QuizContext, QuizProvider };
