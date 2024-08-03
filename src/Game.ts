import { Boat } from './Boat.js';
import { Parachutist } from './Parachutist.js';

const MAX_PARACHUTIST = 3;
class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  boat: Boat;
  parachutists: Parachutist[];
  score: number;
  lives: number;
  seaImage: HTMLImageElement;
  planeImage: HTMLImageElement;
  backgroundImage: HTMLImageElement;
  isLeftKeyDown: boolean;
  isRightKeyDown: boolean;
  planeX: number;
  planeY: number;
  planeSpeed: number;
  planeSpeedIncrement: number;
  planeMaxSpeed: number;
  parachutistIntervalId: NodeJS.Timeout | undefined;
  parachutistTimeoutId: NodeJS.Timeout | undefined;
  onGameOverCallback: (score: number) => void;

  constructor(canvas: HTMLCanvasElement, onGameOverCallback: (score: number) => void) {
    // * initialize all the properties for the game
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.boat = new Boat(this.canvas.width / 2, this.canvas.height - 80, 'assets/boat.png', this.canvas.width);
    this.parachutists = [];
    this.score = 0; // * initial score set to 0
    this.lives = 3; // * initial score set to 3 (also max)
    this.seaImage = new Image();
    this.seaImage.src = 'assets/sea.png';
    this.planeImage = new Image();
    this.planeImage.src = 'assets/plane.png';
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'assets/background.png';
    this.isLeftKeyDown = false;
    this.isRightKeyDown = false;
    this.planeX = this.canvas.width;
    this.planeY = 50;
    this.planeSpeed = 2;
    this.planeSpeedIncrement = 0.1; // * this is to make the plane speed faster every time it appears, just to make the game more challenging
    this.planeMaxSpeed = 5; // * max speed limit
    this.parachutistIntervalId = undefined;
    this.onGameOverCallback = onGameOverCallback;

    // this.init();
  }

  init() {
    this.bindEvents();
    this.spawnParachutist();
    this.gameLoop();
  }

  bindEvents() {
    // * for boat movement, using arrow keys is better because it provides better control
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.isLeftKeyDown = true;
    } else if (e.key === 'ArrowRight') {
      this.isRightKeyDown = true;
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.isLeftKeyDown = false;
    } else if (e.key === 'ArrowRight') {
      this.isRightKeyDown = false;
    }
  }

  spawnParachutist() {
    // * parachutists will be spawn every 2 seconds 
    this.parachutistIntervalId = setInterval(() => {
      const parachutists = Math.floor(Math.random() * MAX_PARACHUTIST) + 1;
      for (let i = 0; i < parachutists; i++) {
        this.parachutistTimeoutId = setTimeout(() => {
          if (this.planeX > 0 && this.planeX < this.canvas.width - 100) {
            const parachutist = new Parachutist(this.planeX, this.planeY + 50, 'assets/parachutist.png');
            this.parachutists.push(parachutist);
          }
          /* to drop multiple parachutists, the timeout duration is adjusted based on the plane's speed. 
            the faster the plane moves, the shorter the timeout interval must be to ensure parachutists 
            drop while the plane is still within the canvas. this prevents the plane from exiting the 
            screen before all parachutists have been released, which could otherwise result in only 
            one parachutist being dropped at higher plane speeds. */
        }, i * (2000 / this.planeSpeed));
      }
    }, 2000);
  }

  gameLoop() {
    this.update();
    this.render();
    if (this.lives > 0) {
      requestAnimationFrame(() => this.gameLoop());
    } else {
      this.onGameOverCallback(this.score);
    }
  }

  update() {

    // * update boat position based on key presses
    if (this.isLeftKeyDown) {
      this.boat.moveLeft();
    } else if (this.isRightKeyDown) {
      this.boat.moveRight();
    } else {
      this.boat.resetSpeed();
    }

    // * move the plane from right to left
    this.planeX -= this.planeSpeed;
    if (this.planeX < -100) { // * reset its position when it goes off screen
      this.planeX = this.canvas.width;
      if (this.planeSpeed < this.planeMaxSpeed) { // * increase plane speed gradually, but cap it at the max speed
        this.planeSpeed += this.planeSpeedIncrement;
      }
    }

    // * update the position of each parachutist and check for collisions or out of bounds
    this.parachutists.forEach((parachutist, index) => {
      parachutist.update();
      if (parachutist.y > this.canvas.height) {  // * if it goes off the bottom of the screen, remove parachutist and decrease lives 
        this.parachutists.splice(index, 1);
        this.lives--;
      } else if (this.boat.catches(parachutist)) { // * if caught by the boat, remove parachutist and increase score 
        this.parachutists.splice(index, 1);
        this.score += 10;
      }
    });
  }

  render() { // * clear the canvas and draw everything
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawSea();
    this.drawPlane();
    this.boat.draw(this.ctx);
    this.parachutists.forEach(parachutist => parachutist.draw(this.ctx));
    this.drawHUD(); // * heads-up display for displaying lives and score
  }

  drawBackground() { // * draw the background image to cover the entire canvas
    this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
  }

  drawSea() { // * draw the sea image at the bottom of the canvas
    this.ctx.drawImage(this.seaImage, 0, this.canvas.height - 40, this.canvas.width, 40);
  }

  drawPlane() { // * draw the plane image at its current position
    this.ctx.drawImage(this.planeImage, this.planeX, this.planeY, 100, 50);
  }

  drawHUD() { // * draw the score and lives HUD
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, 20);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 50);
  }

  resizeBoatCanvas() { // * resize boat top and left on window resize
    this.boat.updateBoatCanvasSize(this.canvas.width / 2, this.canvas.height - 80);
  }

  resetGame() {  // * Reset the game state and start over
    // * clear interval and timeout from previous game  
    this.parachutistIntervalId && clearInterval(this.parachutistIntervalId);
    this.parachutistTimeoutId && clearTimeout(this.parachutistTimeoutId);
    this.score = 0;
    this.lives = 3;
    this.parachutists = [];
    this.boat.x = this.canvas.width / 2;
    this.planeX = this.canvas.width;
    this.planeSpeed = 2;
    this.isLeftKeyDown = false;
    this.isRightKeyDown = false;
    this.spawnParachutist();
    this.gameLoop();
  }
}

export { Game };
