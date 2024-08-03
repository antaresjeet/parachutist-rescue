import { Parachutist } from './Parachutist.js';

class Boat {
  x: number; // * X position of the boat
  y: number; // * Y position of the boat
  width: number;
  height: number;
  speed: number;
  maxSpeed: number;
  speedIncrement: number;
  image: HTMLImageElement;
  canvasWidth: number;

  constructor(x: number, y: number, imagePath: string, canvasWidth: number) {
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 60;
    this.speed = 2;
    this.maxSpeed = 10;
    this.speedIncrement = 0.1;
    this.image = new Image();
    this.image.src = imagePath;
    this.canvasWidth = canvasWidth;
  }

  moveLeft() {
    if (this.speed < this.maxSpeed) { // * increase the speed if it's below the max speed
      this.speed += this.speedIncrement;
    }
    this.x -= this.speed;
    if (this.x < 0) { // * ensure the boat doesn't move off the left edge of the canvas
      this.x = 0;
    }
  }

  moveRight() {
    if (this.speed < this.maxSpeed) { // * increase the speed if it's below the max speed
      this.speed += this.speedIncrement;
    }
    this.x += this.speed;
    if (this.x + this.width > this.canvasWidth) { // * ensure the boat doesn't move off the right edge of the canvas
      this.x = this.canvasWidth - this.width;
    }
  }

  resetSpeed() { // * reset the boat speed to its initial value
    this.speed = 2;
  }

  draw(ctx: CanvasRenderingContext2D) { // * draw the boat on the canvas
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  catches(parachutist: Parachutist): boolean { // * check if the boat catches the parachutist
    return parachutist.x > this.x && parachutist.x < this.x + this.width &&
      parachutist.y + parachutist.height > this.y && parachutist.y < this.y + this.height;
  }

  updateBoatCanvasSize(width: number, height: number) { // * resize boat top and left on window resize
    this.canvasWidth = width;
    this.x = width;
    this.y = height;
  }
}

export { Boat };
