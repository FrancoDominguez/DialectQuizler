import availableLanguages from "../Languages/Cyrillic/Metadata.json";
import path from "path";
import fs from "fs";

console.log(availableLanguages);

function filterLanguagesByType(languages, type) {
  return languages.filter((item) => item.type && item.type === type);
}

function generateWordString(words, wordsPerPrompt) {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.slice(0, wordsPerPrompt).join(" ");
}

function pickRandomLanguage(arrayOfLangauges) {
  return arrayOfLangauges[Math.floor(Math.random() * arrayOfLangauges.length)];
}

async function extractText(languagesUsed) {
  return Promise.all(
    languagesUsed.map(async (language) => {
      const module = await import(`../Languages/Cyrillic/${language.file}`);
      const arrayOfWords = module.default.split(" ");
      return {
        ...language,
        text: arrayOfWords,
      };
    })
  );
}

export default async function generateQuiz(params) {
  const { wordsPerPrompt, numOfQuestions, numOfMCQs, type, timeLimit } = params;

  const filteredLanguages = filterLanguagesByType(availableLanguages, type);
  const languagesJSON = await extractText(filteredLanguages);
  console.log(`languages JSON: ${languagesJSON}`);
  const filteredLanguagesArray = languagesJSON.map((language) => {
    language.name;
  });

  const questions = [];
  for (let i = 0; i < numOfQuestions; i++) {
    // pick answer and generate MCQs
    const answer = pickRandomLanguage(filteredLanguagesArray);
    let MCQs = [answer];
    while (MCQs.length < numOfMCQs) {
      const randomFillerLanguage =
        filteredLanguagesArray[
          Math.floor(Math.random() * filteredLanguagesArray.length)
        ];
      if (!MCQs.includes(randomFillerLanguage)) {
        MCQs.push(randomFillerLanguage);
      }
    }
    MCQs = MCQs.sort(() => Math.random() - 0.5);
    const rightAnswerIndex = MCQs.indexOf(answer);
    const languageText = languagesJSON.filter((language) => {
      language.name === answer;
    });
    const prompt = generateWordString(languageText, wordsPerPrompt);

    questions.push({
      prompt: prompt,
      rightAnswerIndex: rightAnswerIndex,
      answers: MCQs,
    });
  }
  return {
    name: "Second Quiz",
    category: "In this case, cyrillic",
    questions: questions,
  };
}
