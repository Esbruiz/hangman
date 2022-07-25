import React, {useEffect} from 'react';
import './App.css';

const Hangman = () => {
    const [word, setWord] = React.useState('');
    // set the guesses state as array of empty strings
    const [guesses, setGuesses] = React.useState(Array(''));
    const [guess, setGuess] = React.useState('');
    const [guessCount, setGuessCount] = React.useState(0);
    const [rightGuessCount, setRightGuessCount] = React.useState(0);
    const [gameOver, setGameOver] = React.useState(false);
    const [gameWon, setGameWon] = React.useState(false);
    // on the first render fetch a random word from an API
    // and set it to the state

    const getRandomWord = async () => {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        setWord(data[0]);
        setGuesses(Array(data[0].length).fill('_'));
    }
    useEffect(() => {
        getRandomWord();
        setGuessCount(0);
        setRightGuessCount(0);
    }, []);

    // after fetching the word, we need to create an array of underscores and draw them to the dom
    useEffect(() => {
        if(word.length > 0) {
            const wordArray = word.split('');
            const wordArrayWithUnderscores = wordArray.map(() => '_');
            setGuesses(wordArrayWithUnderscores);
        }
    }, [word]);

    // after each guess, we need to check if the guess is in the word and update the guesses array
    useEffect(() => {
        const wordArray = word.split('');
        const wordArrayWithGuesses = wordArray.map(letter => {
            if (guesses.includes(letter)) {
                return letter;
            } else {
                return '_';
            }
        }
        );
        setGuesses(wordArrayWithGuesses);
    }, [guess]);

    // if the guesses array is equal to the word array, the game is won
    useEffect(() => {
        drawHangman();
        if (guesses.join('') === word) {
            setGameWon(true);
        } else {
            setGameWon(false);
            if (guessCount - rightGuessCount === 6) {
                setGameOver(true);
                dropBody();
                const rEyes = document.getElementById('rEyes');
                const xEyes = document.getElementById('xEyes');
                // @ts-ignore
                rEyes.classList.add("hide");
                // @ts-ignore
                xEyes.classList.remove("hide");
            } else {
                setGameOver(false);
            }
        }
    })

    const renderConditionally = () => {
        const bodyParts = [
            ``,
            `<g id="head">
    <circle cx="200" cy="80" r="20" stroke="black" stroke-width="4" fill="white"/>
      <g id="rEyes" class="null">
      <circle cx="193" cy="80" r="4"/>
      <circle cx="207" cy="80" r="4"/>
      </g>
      <g id="xEyes" class="hide">
        <line x1="190" y1="78" x2="196" y2="84"/>
        <line x1="204" y1="78" x2="210" y2="84"/>
        <line x1="190" y1="84" x2="196" y2="78"/>
        <line x1="204" y1="84" x2="210" y2="78"/>
      </g>
    </g>`,
            `<line x1="200" y1="100" x2="200" y2="150" />`,
            `<line id="armL" x1="200" y1="120" x2="170" y2="140" />`,
            `<line id="armR" x1="200" y1="120" x2="230" y2="140" />`,
            `<line id="legL" x1="200" y1="150" x2="180" y2="190" />`,
            `<line id="legR" x1="200" y1="150" x2="220" y2="190" />`,
        ];
        for (let i = 0; i <= guessCount - rightGuessCount; i++) {
            // @ts-ignore
            document.querySelector('g#body')?.insertAdjacentHTML( 'beforeend', bodyParts[i] );
        }
    }

    // draw a hangman to the dom using svg elements
    const drawHangman = () => {
        const hangman = document.getElementById('hangman');
        // @ts-ignore
        hangman.innerHTML = '';
            // @ts-ignore
            hangman.innerHTML = `<svg height="400" width="400">
  <g id="body"></g>
    <line x1="10" y1="250" x2="150" y2="250" />
    <line id="door1" x1="150" y1="250" x2="200" y2="250" />
    <line  id="door2" x1="200" y1="250" x2="250" y2="250" />
    <line x1="250" y1="250" x2="390" y2="250" />
    <line x1="100" y1="250" x2="100" y2="20" />
    <line x1="100" y1="20" x2="200" y2="20" />
    <line id="rope" x1="200" y1="20" x2="200" y2="60" />
  </svg>
`;
        renderConditionally();
    };

    const dropBody = () => {
        const door1 = document.getElementById('door1');
        const door2 = document.getElementById('door2');
        // @ts-ignore
        door1.animate([
            {transform: 'translateY(0px)'},
            {
                opacity: 0,
                color: "#fff"
            },
            {transform: 'rotate(90deg)'},
            {transform: 'translateY(90px)'},
            {
                opacity: 0,
                color: "#fff"
            },
        ], {
            duration: 1000,
            iterations: 1,
            fill: 'forwards',
        });
        // @ts-ignore
        door2.animate([
            {transform: 'translateY(0px)'},
            {
                opacity: 0,
                color: "#fff"
            },
            {transform: 'rotate(-90deg)'},
            {transform: 'translateY(-90px)'},
            {
                opacity: 0,
                color: "#fff"
            },
        ], {
            duration: 1000,
            iterations: 1,
            fill: 'forwards',
        });

       fall();
    }

    function fall() {
        let dur = 500;
        let del = 1000;
        const body = document.getElementById('body');
        const armL = document.getElementById('armL');
        const armR = document.getElementById('armR');
        const rope = document.getElementById('rope');
        // @ts-ignore
        body.animate([
            {transform: 'translateY(0px)'},
            {
                transform: 'translateY(200px)',
            },
            ], {
            duration: dur,
            iterations: 1,
            fill: 'forwards',
            delay: del,
        });

        let currentRope = 60;
        let armCurrent = 140;
            (function myLoop(i) {
                setTimeout(() => {
                    // @ts-ignore
                    rope.setAttribute('y2', currentRope);
                    // @ts-ignore
                    armL.setAttribute('y2', armCurrent);
                    // @ts-ignore
                    armR.setAttribute('y2', armCurrent);
                    armCurrent -= 6;
                    currentRope += 22;
                    if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
                }, i === 10 ? 950 : 50)
            })(10);
    }




    return (<>
        <h1>Hangman</h1>
        <div className="game-container">
            <div className="game-info">
                <div className="word-container">
                    {guesses.map((guess, index) => {
                        return <span key={index}>{guess}</span>;
                    }
                    )}
                </div>
                <div className="guess-container">
                    <input type="text" disabled={gameOver || gameWon} value={guess} onChange={e => setGuess(e.target.value)}/>
                    <button disabled={gameOver || gameWon} onClick={() => {
                        if (guess.length > 0) {
                            const guessArray = guesses.slice();
                            const guessIndex = word.indexOf(guess);
                            if (guessIndex > -1) {
                                guessArray[guessIndex] = guess;
                                setGuesses(guessArray);
                                setRightGuessCount(rightGuessCount + 1);
                            }
                            setGuessCount(guessCount + 1);
                            setGuess('');
                        }
                    }
                    }>Guess</button>
                </div>
                <div className="guess-count">
                    <p>Guesses: {guessCount}</p>
                    <p>Remaining Guesses: {6 - (guessCount - rightGuessCount)}</p>
                    <p>Right Guesses: {rightGuessCount}</p>
                    <p>Wrong Guesses: {guessCount - rightGuessCount}</p>
                </div>
                <div className="game-status">
                    {gameOver ? <div className={"result"}>
                        <p className={"game-over"}>Game Over</p>
                        <p className={"secret-word"}>the word was: {word}</p>
                        <button onClick={() => {
                            setGuessCount(0);
                            setRightGuessCount(0);
                            setGameOver(false);
                            // @ts-ignore
                            setWord(getRandomWord());
                            drawHangman();
                        }}>Play Again</button>

                    </div> : gameWon ? <div className={"result"}>
                        <p className={"game-won"}>Game Won!</p>
                        <button onClick={() => {
                            setGuessCount(0);
                            setRightGuessCount(0);
                            setGameOver(false);
                            // @ts-ignore
                            setWord(getRandomWord());
                            drawHangman();
                        }}>Play Again</button>
                    </div> : ''}
                </div>
            </div>
            <div id="hangman"></div>
        </div>
    </>);
};

export default Hangman;
