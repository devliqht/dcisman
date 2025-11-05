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
  private mouthAngle = 0;

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
      this.animationFrame = (this.animationFrame + 1) % 3;
      this.animationTimer = 0;
    }

    this.mouthAngle = this.animationFrame * 15;

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

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
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
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      22,
      (this.mouthAngle * Math.PI) / 180,
      ((360 - this.mouthAngle) * Math.PI) / 180
    );
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.restore();
  }

  public respawn(): void {
    this.x = this.startX;
    this.y = this.startY;
    this.pixelX = this.x * 48 + 24;
    this.pixelY = this.y * 48 + 24;
    this.direction = null;
    this.nextDirection = null;
  }
}
