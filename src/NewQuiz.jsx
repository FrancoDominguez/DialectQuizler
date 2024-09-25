// NewQuiz.jsx
import availableLanguages from "./Metadata.json";

function filterLanguagesByKey(languages, key, value) {
  return languages.filter((language) => {
    if (Array.isArray(language[key])) {
      return language[key].includes(value);
    } else {
      return language[key] === value;
    }
  });
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateWordString(words, wordsPerPrompt) {
  const shuffledWords = shuffleArray(words);
  return shuffledWords.slice(0, wordsPerPrompt).join(" ");
}

function pickRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// NewQuiz.jsx
async function extractText(languages) {
  const results = await Promise.all(
    languages.map(async (language) => {
      try {
        const response = await fetch(`/Languages/Cyrillic/${language.file}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        const wordsArray = content.split(/\s+/);
        return {
          ...language,
          text: wordsArray,
        };
      } catch (error) {
        console.error(
          `Error reading file for language ${language.name}:`,
          error
        );
        return null;
      }
    })
  );
  return results.filter((result) => result !== null);
}

export default async function generateQuiz(params) {
  const {
    numOfQuestions,
    wordsPerQuestion,
    choicesPerQuestion,
    filterKey,
    filterValue,
  } = params;

  const filteredLanguages = filterLanguagesByKey(
    availableLanguages,
    filterKey,
    filterValue
  );
  if (filteredLanguages.length === 0) {
    throw new Error(`No languages found for ${filterKey}: ${filterValue}`);
  }

  const languagesWithText = await extractText(filteredLanguages);
  if (languagesWithText.length === 0) {
    throw new Error(
      `No language texts could be loaded for ${filterKey}: ${filterValue}`
    );
  }

  const languageNames = languagesWithText.map((language) => language.name);

  const questions = [];
  for (let i = 0; i < numOfQuestions; i++) {
    const answer = pickRandomElement(languagesWithText);
    const MCQs = new Set([answer.name]);
    while (MCQs.size < choicesPerQuestion) {
      MCQs.add(pickRandomElement(languageNames));
    }
    const MCQArray = shuffleArray(Array.from(MCQs));
    const rightAnswerIndex = MCQArray.indexOf(answer.name);
    const prompt = generateWordString(answer.text, wordsPerQuestion);

    questions.push({
      prompt: prompt,
      rightAnswerIndex: rightAnswerIndex,
      answers: MCQArray,
    });
  }

  return {
    name: "Quiz",
    category: filterValue,
    questions: questions,
  };
}
