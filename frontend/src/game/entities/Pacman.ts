import { Maze } from '@/game/Maze';
import type { Direction } from '@/game/InputManager';

export class Pacman {
  public x: number;
  public y: number;
  private pixelX: number;
  private pixelY: number;

  private direction: Direction = null;
  private nextDirection: Direction = null;
  private speed = 6; // tiles per second

  private animationFrame = 0;
  private animationTimer = 0;

  private isMelting = false;
  private meltProgress = 0;

  private readonly startX: number;
  private readonly startY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.pixelX = x * 48 + 24;
    this.pixelY = y * 48 + 24;
    this.startX = x;
    this.startY = y;
  }

  public update(
    deltaTime: number,
    inputDirection: Direction,
    maze: Maze
  ): void {
    this.animationTimer += deltaTime;
    if (this.animationTimer > 0.1) {
      this.animationFrame = (this.animationFrame + 1) % 2;
      this.animationTimer = 0;
    }

    if (inputDirection !== null) {
      this.nextDirection = inputDirection;
    }

    const currentTileX = Math.floor(this.pixelX / 48);
    const currentTileY = Math.floor(this.pixelY / 48);

    const centerX = currentTileX * 48 + 24;
    const centerY = currentTileY * 48 + 24;
    const threshold = 6;
    const atCenter =
      Math.abs(this.pixelX - centerX) < threshold &&
      Math.abs(this.pixelY - centerY) < threshold;

    if (atCenter && this.nextDirection !== null) {
      if (this.canMove(this.nextDirection, maze)) {
        this.direction = this.nextDirection;
        this.nextDirection = null;
        this.pixelX = centerX;
        this.pixelY = centerY;
      }
    }

    if (this.direction !== null) {
      const moveDistance = this.speed * 48 * deltaTime;
      let newPixelX = this.pixelX;
      let newPixelY = this.pixelY;

      switch (this.direction) {
        case 'up':
          newPixelY -= moveDistance;
          break;
        case 'down':
          newPixelY += moveDistance;
          break;
        case 'left':
          newPixelX -= moveDistance;
          break;
        case 'right':
          newPixelX += moveDistance;
          break;
      }

      const nextTileX = Math.floor(newPixelX / 48);
      const nextTileY = Math.floor(newPixelY / 48);

      if (nextTileX !== currentTileX || nextTileY !== currentTileY) {
        if (maze.isWall(nextTileX, nextTileY)) {
          this.pixelX = centerX;
          this.pixelY = centerY;
          this.direction = null;
        } else {
          this.pixelX = newPixelX;
          this.pixelY = newPixelY;
        }
      } else {
        this.pixelX = newPixelX;
        this.pixelY = newPixelY;
      }

      this.x = Math.floor(this.pixelX / 48);
      this.y = Math.floor(this.pixelY / 48);
    }

    if (this.x < 0) {
      this.x = 17;
      this.pixelX = this.x * 48 + 24;
    } else if (this.x >= 18) {
      this.x = 0;
      this.pixelX = this.x * 48 + 24;
    }
  }

  private canMove(direction: Direction, maze: Maze): boolean {
    if (!direction) return false;

    let nextX = this.x;
    let nextY = this.y;

    switch (direction) {
      case 'up':
        nextY--;
        break;
      case 'down':
        nextY++;
        break;
      case 'left':
        nextX--;
        break;
      case 'right':
        nextX++;
        break;
    }

    return !maze.isWall(nextX, nextY);
  }

  private getPacmanPixels(): number[][] {
    const mouthOpen = this.animationFrame === 1;

    if (mouthOpen) {
      return [
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      ];
    } else {
      return [
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      ];
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.isMelting) {
      this.renderMelting(ctx);
      return;
    }

    const pixels = this.getPacmanPixels();
    const pixelSize = 4;
    const spriteSize = 11;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(this.pixelX, this.pixelY);

    switch (this.direction) {
      case 'up':
        ctx.rotate(-Math.PI / 2);
        break;
      case 'down':
        ctx.rotate(Math.PI / 2);
        break;
      case 'left':
        ctx.rotate(Math.PI);
        break;
    }

    ctx.fillStyle = '#FFFF00';
    const offset = -(spriteSize * pixelSize) / 2;

    ctx.beginPath();
    for (let y = 0; y < spriteSize; y++) {
      for (let x = 0; x < spriteSize; x++) {
        if (pixels[y][x] === 1) {
          ctx.rect(
            offset + x * pixelSize,
            offset + y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
    ctx.fill();

    ctx.restore();
  }

  private renderMelting(ctx: CanvasRenderingContext2D): void {
    const pixels = this.getPacmanPixels();
    const pixelSize = 4;
    const spriteSize = 11;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(this.pixelX, this.pixelY);

    const offset = -(spriteSize * pixelSize) / 2;

    const rowsToRemove = Math.floor(this.meltProgress * spriteSize);

    ctx.fillStyle = '#FFFF00';

    ctx.beginPath();
    for (let y = rowsToRemove; y < spriteSize; y++) {
      for (let x = 0; x < spriteSize; x++) {
        if (pixels[y][x] === 1) {
          const dropOffset = y < rowsToRemove + 2 ? Math.random() * 2 : 0;

          ctx.rect(
            offset + x * pixelSize,
            offset + y * pixelSize + dropOffset,
            pixelSize,
            pixelSize
          );
        }
      }
    }
    ctx.fill();

    ctx.restore();
  }

  public startMelting(): void {
    this.isMelting = true;
    this.meltProgress = 0;
  }

  public updateMelting(deltaTime: number): void {
    if (this.isMelting) {
      this.meltProgress += deltaTime * 0.7;
      if (this.meltProgress > 1) {
        this.meltProgress = 1;
      }
    }
  }

  public respawn(): void {
    this.x = this.startX;
    this.y = this.startY;
    this.pixelX = this.x * 48 + 24;
    this.pixelY = this.y * 48 + 24;
    this.direction = null;
    this.nextDirection = null;
    this.isMelting = false;
    this.meltProgress = 0;
  }
}
