/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array or string
 */
function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }
  if (typeof src === 'string') {
    return copy.join('');
  }
  return copy;
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const wordsList = [
  'banana',
  'window',
  'planet',
  'bottle',
  'coffee',
  'orange',
  'school',
  'garden',
  'button',
  'kitten'
];

function App() {
  const [words, setWords] = React.useState(() => {
    const saved = localStorage.getItem('scrambleWords');
    return saved ? JSON.parse(saved) : shuffle(wordsList);
  });

  const [currentWord, setCurrentWord] = React.useState('');
  const [scrambledWord, setScrambledWord] = React.useState('');
  const [guess, setGuess] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [points, setPoints] = React.useState(() => {
    const saved = localStorage.getItem('scramblePoints');
    return saved ? parseInt(saved) : 0;
  });
  const [strikes, setStrikes] = React.useState(() => {
    const saved = localStorage.getItem('scrambleStrikes');
    return saved ? parseInt(saved) : 0;
  });
  const [passes, setPasses] = React.useState(() => {
    const saved = localStorage.getItem('scramblePasses');
    return saved ? parseInt(saved) : 3;
  });
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    if (words.length > 0 && currentWord === '') {
      const next = words[0];
      setCurrentWord(next);
      setScrambledWord(shuffle(next));
    }
  }, [words, currentWord]);

  React.useEffect(() => {
    localStorage.setItem('scrambleWords', JSON.stringify(words));
    localStorage.setItem('scramblePoints', points);
    localStorage.setItem('scrambleStrikes', strikes);
    localStorage.setItem('scramblePasses', passes);
  }, [words, points, strikes, passes]);

  function handleChange(e) {
    setGuess(e.target.value);
  }

  function handleGuess(e) {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setMessage('✅ Correct!');
      moveToNextWord();
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setMessage('❌ Incorrect!');
      if (newStrikes >= 3) {
        setGameOver(true);
      }
    }
    setGuess('');
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      setMessage('⏭ Word passed.');
      moveToNextWord();
    } else {
      setMessage('No passes left!');
    }
  }

  function moveToNextWord() {
    const newWords = words.slice(1);
    setWords(newWords);
    if (newWords.length === 0) {
      setGameOver(true);
      setScrambledWord('');
      setCurrentWord('');
    } else {
      const next = newWords[0];
      setCurrentWord(next);
      setScrambledWord(shuffle(next));
    }
  }

  function handleRestart() {
    const newWords = shuffle(wordsList);
    setWords(newWords);
    setCurrentWord('');
    setScrambledWord('');
    setGuess('');
    setMessage('');
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
    localStorage.clear();
  }

  return (
    <div className="game">
      <h1> Scramble Game</h1>

      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>Points: {points}</p>
          <p>Strikes: {strikes}</p>
          <button onClick={handleRestart}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>Scrambled Word:</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{scrambledWord}</p>

          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={handleChange}
              placeholder="Type your guess"
              autoFocus
            />
          </form>

          <button onClick={handlePass}>Pass ({passes} left)</button>

          <p>{message}</p>
          <p>Points: {points}</p>
          <p>Strikes: {strikes} / 3</p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
