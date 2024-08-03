class Parachutist {
  x: number; // * X position of the parachutist
  y: number; // * Y position of the parachutist
  width: number;
  height: number;
  fallingSpeed: number;
  image: HTMLImageElement;

  constructor(x: number, y: number, imagePath: string) {
    // * initialize all the properties for the parachutist
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.fallingSpeed = 2;
    this.image = new Image();
    this.image.src = imagePath;
  }

  update() { // * update the Y position of the parachutist so it falls
    this.y += this.fallingSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) { // * draw the parachutist on the canvas
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

export { Parachutist };
