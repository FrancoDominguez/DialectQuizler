import allLanguages from "../Languages/Arabic";

console.log(allLanguages);

function getRandomWords(stringOfWords, numOfWords) {
  const words = stringOfWords.split(" ");
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.slice(0, numOfWords).join(" ");
}

function getLanguagesByCategory(languages, filter) {
  const filteredLanguages = languages.filter(
    (item) => item["category"] && item["category"].includes(filter)
  );
  return filteredLanguages;
}

export default function buildQuiz(params) {
  const filteredLanguages = getLanguagesByCategory(
    allLanguages,
    params.category
  );
  const languageNames = filteredLanguages.map((language) => language.language);
  console.log(languageNames);
  let quiz = {};
  let questions = [];

  for (let i = 0; i < params.numOfQuestions; i++) {
    const language =
      filteredLanguages[Math.floor(Math.random() * filteredLanguages.length)];
    const answer = language.language;
    const prompt = getRandomWords(language.string, params.wordsPerQuestion);

    let answerChoices = [answer];
    while (answerChoices.length < params.choicesPerQuestion) {
      const randomChoice =
        languageNames[Math.floor(Math.random() * languageNames.length)];
      if (!answerChoices.includes(randomChoice)) {
        answerChoices.push(randomChoice);
      }
    }
    answerChoices = answerChoices.sort(() => Math.random() - 0.5);
    const answerIndex = answerChoices.indexOf(answer);
    const question = {
      prompt: prompt,
      rightAnswerIndex: answerIndex,
      answers: answerChoices,
    };
    questions.push(question);
  }
  quiz["name"] = "First Quiz";
  quiz["category"] = params.category;
  quiz["questions"] = questions;

  return quiz;
}
