import { createContext, useState, useEffect } from "react";
import buildQuiz from "../QuizBuilder";
// import data from "../../QuizData.json";

const params = {
  type: "Dialect Guesser",
  numOfQuestions: 20,
  wordsPerQuestion: 15,
  category: "arabic",
  choicesPerQuestion: 4,
};

// const data = buildQuiz(params);

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [quizData, setQuizData] = useState(buildQuiz(params));
  const [guessHistory, setGuessHistory] = useState({
    linkedTo: "insertquizidheremakingthislongsoitgoestonextline",
    guesses: Array.from({ length: quizData.questions.length }, () => -1),
    score: 0,
  });
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    // initializing questionIndex
    const savedQuestionIndex = localStorage.getItem("questionIndex");
    if (savedQuestionIndex === null)
      localStorage.setItem("questionIndex", questionIndex);
    else {
      setQuestionIndex(Number(savedQuestionIndex));
    }
    // initializing quizData
    const savedQuizData = localStorage.getItem("quizData");
    if (savedQuizData === null) {
      localStorage.setItem("quizData", JSON.stringify(quizData));
    } else {
      setQuizData(JSON.parse(savedQuizData));
    }
    // initializing guessHistory
    const savedGuessHistory = localStorage.getItem("guessHistory");
    if (savedGuessHistory === null)
      localStorage.setItem("guessHistory", JSON.stringify(guessHistory));
    else {
      setGuessHistory(JSON.parse(savedGuessHistory));
    }
  }, []);

  const resetQuiz = () => {
    localStorage.clear();

    localStorage.setItem("questionIndex", 0);
    localStorage.setItem(
      "guessHistory",
      JSON.stringify({
        linkedTo: "insertquizidheremakingthislongsoitgoestonextline",
        guesses: Array.from({ length: quizData.questions.length }, () => -1),
        score: 0,
      })
    );
    localStorage.setItem("quizData", JSON.stringify(buildQuiz(params)));
  };

  const handleGuess = (index) => {
    if (questionIndex < quizData.questions.length - 1) {
      const updatedGuessHistory = { ...guessHistory };
      updatedGuessHistory.guesses[questionIndex] = index; // updating guess history
      if (index === quizData.questions[questionIndex].rightAnswerIndex) {
        updatedGuessHistory.score = updatedGuessHistory.score + 1; // update score
      }

      setGuessHistory(updatedGuessHistory);
      localStorage.setItem("guessHistory", JSON.stringify(updatedGuessHistory));

      // updating quesiton index
      setTimeout(() => {
        const newIndex = questionIndex + 1;
        setQuestionIndex(newIndex);
        localStorage.setItem("questionIndex", newIndex);
      }, 500);
    } else {
      console.log("end of quiz");
    }
  };

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
