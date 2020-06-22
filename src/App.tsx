import * as React from "react";
import "./styles.css";

type GameState = "Initial" | "Is Playing" | "End";

type TriviaResult = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type APIResponse = {
  response_code: number;
  results: TriviaResult[];
};

export default function App() {
  const [state, setState] = React.useState<GameState>("Initial");
  const [questions, setQuestions] = React.useState<TriviaResult[]>([]);
  const [answers, setAnswers] = React.useState<boolean[]>([]);

  console.log(questions);
  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&type=boolean")
      .then(r => r.json())
      .then((jsonResponse: APIResponse) => {
        setQuestions(jsonResponse.results);
        setAnswers(jsonResponse.results.map(() => false));
      });
  }, []);

  if (state === "Initial") {
    return (
      <div className="App">
        <h1>Trivia Game</h1>
        <h2>Click start to begin the game!</h2>
        <button onClick={() => setState("Is Playing")}>Start Game</button>
      </div>
    );
  }

  if (state === "Is Playing") {
    return (
      <div>
        <h1>Here are your questions!</h1>
        <ul>
          {questions.map((q, index) => (
            <li
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: "max-content auto"
              }}
              key={q.question}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: "2px solid #666",
                  borderRadius: "50%",
                  backgroundColor: answers[index] ? "green" : "red"
                }}
                onClick={() => {
                  const clonedAnswers = [...answers];
                  clonedAnswers[index] = !answers[index];
                  setAnswers(clonedAnswers);
                }}
              />
              {q.question} {q.correct_answer}
            </li>
          ))}
        </ul>
        <button onClick={() => setState("End")}>Show me my score</button>
      </div>
    );
  }

  if (state === "End") {
    return (
      <>
        <h1>
          Here is your score:{" "}
          {
            questions.filter(
              (q, index) =>
                JSON.parse(
                  q.correct_answer.toLowerCase()
                ) /* "True" | "False" */ === answers[index]
            ).length
          }
          /{questions.length}
        </h1>
        <button onClick={() => setState("Initial")}>Play again!</button>
      </>
    );
  }
}
