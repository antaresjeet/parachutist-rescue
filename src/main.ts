import { Game } from './Game.js';

window.onload = () => {
  // * set canvas width and height to window size
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gamePopup = document.querySelector('.game-popup') as HTMLDivElement;
  const startButton = document.querySelector('.start-game') as HTMLButtonElement;

  const onGameOver = (score: number) => { // * on game over show game over popup
    gamePopup.querySelector('p')!.innerHTML = `Game over <br> You scored: ${score}`;
    startButton.textContent = 'Play Again';
    gamePopup.style.display = '';
  };

  const game: Game = new Game(canvas, onGameOver);
  const startGame = () => {
    gamePopup.style.display = 'none';
    startButton.textContent === 'Play Again' ? game.resetGame() : game.init();
  };

  startButton.addEventListener('click', startGame);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game?.resizeBoatCanvas();
  });
};
