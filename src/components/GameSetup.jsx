import { useState, useEffect } from "react";
import availableLanguages from "../Metadata.json";
import Dropdown from "./ui-components/Dropdown";
import TextInput from "./ui-components/TextInput";
import Button from "./ui-components/Button";

function GameSetup() {
  const [alphabet, setAlphabet] = useState(null);
  const [alphabetOptions, setAlphabetOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(null);

  useEffect(() => {
    const options = Array.from(
      new Set(availableLanguages.map((language) => language.type).sort())
    );
    setAlphabetOptions(options);
  }, []);

  useEffect(() => {
    console.log(alphabet);
    console.log(timeLimit);
  }, [alphabet, timeLimit]);

  return (
    <div className="text-white">
      <div className="flex flex-col gap-3">
        <Dropdown
          title="Alphabet"
          placeholder="Select an alphabet"
          values={alphabetOptions}
          handleSelection={setAlphabet}
        />
        <Dropdown
          title="Time limit"
          placeholder="Choose a time limit"
          values={["Fast", "Normal", "Slow"]}
          handleSelection={setTimeLimit}
        />
        <Button title="Confirm" />
      </div>
    </div>
  );
}

export default GameSetup;
