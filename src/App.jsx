import { useState, useEffect } from 'react';
import { Square } from './components/Square';
import { WinnerModal } from './components/WinnerModal';
import { TURNS } from './constants';
import { checkWinner } from './logic/board';
import { saveGameToStorage, resetGameStorage } from './storage';
import confetti from 'canvas-confetti';
import Board from './components/Board';

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board');
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  // Efecto para guardar el estado del juego
  useEffect(() => {
    saveGameToStorage({
      board,
      turn,
    });
  }, [board, turn]);

  // Efecto para verificar el ganador
  useEffect(() => {
    const newWinner = checkWinner(board);
    if (newWinner) {
      setWinner(newWinner);
      confetti();
    } else if (board.every((square) => square !== null)) {
      setWinner(false); // Empate
    }
  }, [board]);

  const updateBoard = (index) => {
    // Si ya hay valor en esa posición o hay un ganador, no hacemos nada
    if (board[index] || winner) return;

    // Actualizamos el tablero
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[index] = turn;
      return newBoard;
    });

    // Actualizamos el turno
    setTurn((currentTurn) => (currentTurn === TURNS.X ? TURNS.O : TURNS.X));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    resetGameStorage();
  };

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset game</button>
      <Board board={board} updateBoard={updateBoard} />
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
