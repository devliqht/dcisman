import { Maze } from '@/game/Maze';
import { Pacman } from '@/game/entities/Pacman';
import type { Direction } from '@/game/InputManager';

type GhostMode = 'chase' | 'scatter' | 'frightened' | 'dead';
type GhostName = 'blinky' | 'pinky' | 'inky' | 'clyde';

export class Ghost {
  public x: number;
  public y: number;
  private pixelX: number;
  private pixelY: number;

  private name: GhostName;
  private color: string;
  private mode: GhostMode = 'scatter';
  private direction: Direction = 'up';
  private lastDirection: Direction = 'up';
  private speed = 3;
  private frightenedSpeed = 1.5; // slower when frightened
  private eatenSpeed = 6; // faster when returning to ghost house
  private lastDecisionX = -1;
  private lastDecisionY = -1;
  private inGhostHouse = true;
  private stuckCounter = 0;

  private frightenedTimer = 0;
  private frightenedDuration = 8;
  private eaten = false;
  private respawnDelay = 0;
  private flickerTimer = 0;

  private modeTimer = 0;
  private modeDurations = [7, 20, 7, 20, 5, 20, 5]; // Scatter/Chase pattern
  private modeIndex = 0;

  private readonly startX: number;
  private readonly startY: number;
  private readonly scatterTarget: { x: number; y: number };

  constructor(name: GhostName, x: number, y: number, color: string) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.pixelX = x * 48 + 24;
    this.pixelY = y * 48 + 24;
    this.startX = x;
    this.startY = y;
    this.color = color;

    this.scatterTarget = this.getScatterTarget(name);

    const ghostDelays: Record<GhostName, number> = {
      blinky: 0,
      pinky: 1,
      inky: 2,
      clyde: 3,
    };
    this.modeTimer = ghostDelays[name];
  }

  private getScatterTarget(name: GhostName): { x: number; y: number } {
    switch (name) {
      case 'blinky':
        return { x: 17, y: 0 }; 
      case 'pinky':
        return { x: 0, y: 0 }; 
      case 'inky':
        return { x: 17, y: 19 }; 
      case 'clyde':
        return { x: 0, y: 19 };
    }
  }

  public update(deltaTime: number, maze: Maze, pacman: Pacman): void {
    if (this.respawnDelay > 0) {
      this.respawnDelay -= deltaTime;
      if (this.respawnDelay <= 0) {
        this.eaten = false;
        this.mode = 'scatter';
        this.flickerTimer = 0;
      }
      return; 
    }

    if (this.inGhostHouse) {
      const currentTile = maze.getTileAt(this.x, this.y);
      if (currentTile && currentTile.type !== 'ghost-house') {
        this.inGhostHouse = false;
      }
    }

    if (!this.eaten) {
      if (this.mode === 'frightened') {
        this.frightenedTimer -= deltaTime;
        this.flickerTimer += deltaTime;

        if (this.frightenedTimer <= 0) {
          this.mode = 'chase';
          this.flickerTimer = 0;
        }
      } else {
        this.flickerTimer = 0;

        this.modeTimer += deltaTime;
        if (this.modeTimer >= this.modeDurations[this.modeIndex]) {
          this.modeTimer = 0;
          this.modeIndex = (this.modeIndex + 1) % this.modeDurations.length;
          this.mode = this.modeIndex % 2 === 0 ? 'scatter' : 'chase';
        }
      }
    }

    if (!this.eaten) {
      const target = this.inGhostHouse
        ? { x: 9, y: 7 } 
        : this.getTargetTile(pacman);
      this.moveTowardsTarget(target, maze, deltaTime);
    }
  }

  private getTargetTile(pacman: Pacman): { x: number; y: number } {
    if (this.mode === 'frightened') {
      return {
        x: Math.floor(Math.random() * 28),
        y: Math.floor(Math.random() * 31),
      };
    }

    if (this.mode === 'scatter') {
      return this.scatterTarget;
    }

    switch (this.name) {
      case 'blinky':
        return { x: pacman.x, y: pacman.y };

      case 'pinky':
        return this.getTargetAhead(pacman, 3);

      case 'inky': {
        const ahead = this.getTargetAhead(pacman, 2);
        return {
          x: ahead.x * 2 - this.x,
          y: ahead.y * 2 - this.y,
        };
      }

      case 'clyde': {
        const distance = Math.sqrt(
          Math.pow(this.x - pacman.x, 2) + Math.pow(this.y - pacman.y, 2)
        );
        return distance > 6 ? { x: pacman.x, y: pacman.y } : this.scatterTarget;
      }
    }
  }

  private getTargetAhead(
    pacman: Pacman,
    tiles: number
  ): { x: number; y: number } {
    let targetX = pacman.x;
    const targetY = pacman.y;
    targetX += tiles;
    return { x: targetX, y: targetY };
  }

  private moveTowardsTarget(
    target: { x: number; y: number },
    maze: Maze,
    deltaTime: number
  ): void {
    const currentTileX = Math.floor(this.pixelX / 48);
    const currentTileY = Math.floor(this.pixelY / 48);

    const centerX = currentTileX * 48 + 24;
    const centerY = currentTileY * 48 + 24;
    const threshold = 6; // fixed threshold
    const atCenter =
      Math.abs(this.pixelX - centerX) < threshold &&
      Math.abs(this.pixelY - centerY) < threshold;

    const atNewTile =
      currentTileX !== this.lastDecisionX ||
      currentTileY !== this.lastDecisionY;

    if (atCenter && atNewTile) {
      this.lastDecisionX = currentTileX;
      this.lastDecisionY = currentTileY;
      const possibleDirections: Direction[] = ['up', 'down', 'left', 'right'];
      let bestDirection: Direction | null = null;
      let bestDistance = Infinity;
      let validDirectionsFound = 0;

      for (const dir of possibleDirections) {
        const isReverse = this.isOppositeDirection(dir);

        const next = this.getNextPosition(dir, currentTileX, currentTileY);
        const nextTile = maze.getTileAt(next.x, next.y);
        const isWall = maze.isWall(next.x, next.y);
        const isGhostHouse = nextTile?.type === 'ghost-house';

        const isValid = !isWall && !(isGhostHouse && !this.inGhostHouse);

        if (!isValid) continue;

        validDirectionsFound++;

        if (isReverse && validDirectionsFound > 1) continue;

        const dist = Math.sqrt(
          Math.pow(next.x - target.x, 2) + Math.pow(next.y - target.y, 2)
        );

        if (dist < bestDistance) {
          bestDistance = dist;
          bestDirection = dir;
        }
      }

      if (bestDirection === null) {
        for (const dir of possibleDirections) {
          const next = this.getNextPosition(dir, currentTileX, currentTileY);
          const nextTile = maze.getTileAt(next.x, next.y);
          const isWall = maze.isWall(next.x, next.y);
          const isGhostHouse = nextTile?.type === 'ghost-house';

          if (!isWall && !(isGhostHouse && !this.inGhostHouse)) {
            bestDirection = dir;
            break;
          }
        }
      }

      if (bestDirection !== null) {
        if (this.isOppositeDirection(bestDirection)) {
          this.stuckCounter++;

          if (this.stuckCounter > 2 && validDirectionsFound > 1) {
            const perpendicularDirections = this.getPerpendicularDirections(this.direction);

            for (const dir of perpendicularDirections) {
              const next = this.getNextPosition(dir, currentTileX, currentTileY);
              const nextTile = maze.getTileAt(next.x, next.y);
              const isWall = maze.isWall(next.x, next.y);
              const isGhostHouse = nextTile?.type === 'ghost-house';

              if (!isWall && !(isGhostHouse && !this.inGhostHouse)) {
                bestDirection = dir;
                this.stuckCounter = 0;
                break;
              }
            }
          }
        } else {
          this.stuckCounter = 0;
        }

        this.lastDirection = this.direction;
        this.direction = bestDirection;
      }

      this.pixelX = centerX;
      this.pixelY = centerY;
    }

    const currentSpeed = this.eaten
      ? this.eatenSpeed
      : this.mode === 'frightened'
        ? this.frightenedSpeed
        : this.speed;
    const moveDistance = currentSpeed * 48 * deltaTime;

    if (this.direction === 'up') {
      this.pixelY -= moveDistance;
    } else if (this.direction === 'down') {
      this.pixelY += moveDistance;
    } else if (this.direction === 'left') {
      this.pixelX -= moveDistance;
    } else if (this.direction === 'right') {
      this.pixelX += moveDistance;
    }

    this.x = Math.floor(this.pixelX / 48);
    this.y = Math.floor(this.pixelY / 48);

    if (this.x < 0) {
      this.x = 17;
      this.pixelX = 17 * 48 + 24;
    } else if (this.x >= 18) {
      this.x = 0;
      this.pixelX = 24;
    }
  }

  private getNextPosition(
    dir: Direction,
    fromX?: number,
    fromY?: number
  ): { x: number; y: number } {
    let nextX = fromX !== undefined ? fromX : this.x;
    let nextY = fromY !== undefined ? fromY : this.y;

    switch (dir) {
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

    if (nextX < 0) nextX = 27;
    if (nextX >= 28) nextX = 0;

    return { x: nextX, y: nextY };
  }

  private isOppositeDirection(dir: Direction): boolean {
    const opposites: Record<string, string> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    return opposites[this.direction as string] === dir;
  }

  private getPerpendicularDirections(dir: Direction): Direction[] {
    if (dir === 'up' || dir === 'down') {
      return ['left', 'right'];
    } else {
      return ['up', 'down'];
    }
  }

  public setFrightened(frightened: boolean): void {
    if (frightened && !this.eaten) {
      this.mode = 'frightened';
      this.frightenedTimer = this.frightenedDuration;
      this.flickerTimer = 0;
    }
  }

  public setEaten(eaten: boolean): void {
    if (eaten) {
      this.eaten = true;
      this.mode = 'dead';
      this.x = this.startX;
      this.y = this.startY;
      this.pixelX = this.startX * 48 + 24;
      this.pixelY = this.startY * 48 + 24;
      this.respawnDelay = 3;
      this.inGhostHouse = true;
    }
  }

  public get isFrightened(): boolean {
    return this.mode === 'frightened';
  }

  public get isEaten(): boolean {
    return this.eaten;
  }

  public collidesWith(pacman: Pacman): boolean {
    const distance = Math.sqrt(
      Math.pow(this.x - pacman.x, 2) + Math.pow(this.y - pacman.y, 2)
    );
    return distance < 0.5;
  }

  public respawn(): void {
    this.x = this.startX;
    this.y = this.startY;
    this.pixelX = this.x * 48 + 24;
    this.pixelY = this.y * 48 + 24;
    this.mode = 'scatter';
    this.inGhostHouse = true;
    this.direction = 'up';
    this.eaten = false;
    this.respawnDelay = 0;
    this.flickerTimer = 0;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.respawnDelay > 0) return;

    ctx.save();
    ctx.translate(this.pixelX, this.pixelY);

    if (this.eaten) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-7, -5, 6, 0, Math.PI * 2);
      ctx.arc(7, -5, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-7, -5, 3, 0, Math.PI * 2);
      ctx.arc(7, -5, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      return;
    }

    const shouldFlicker = this.mode === 'frightened' && this.frightenedTimer < 2;
    const flickerVisible = !shouldFlicker || Math.floor(this.flickerTimer * 10) % 2 === 0;

    if (!flickerVisible) {
      ctx.restore();
      return;
    }

    let bodyColor = this.mode === 'frightened' ? '#2121FF' : this.color;
    if (shouldFlicker && Math.floor(this.flickerTimer * 10) % 4 < 2) {
      bodyColor = '#FFFFFF';
    }

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(0, 0, 22, Math.PI, 0, false);
    ctx.lineTo(22, 24);
    ctx.lineTo(16, 17);
    ctx.lineTo(8, 24);
    ctx.lineTo(0, 17);
    ctx.lineTo(-8, 24);
    ctx.lineTo(-16, 17);
    ctx.lineTo(-22, 24);
    ctx.closePath();
    ctx.fill();

    if (this.mode !== 'frightened') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-7, -5, 6, 0, Math.PI * 2);
      ctx.arc(7, -5, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-7, -5, 3, 0, Math.PI * 2);
      ctx.arc(7, -5, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
