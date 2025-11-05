export interface Tile {
  type: 'wall' | 'path' | 'pellet' | 'power-pellet' | 'ghost-house';
  collected?: boolean;
}

export class Maze {
  public readonly width = 18;
  public readonly height = 20;
  public readonly tileSize = 48;

  private tiles: Tile[][] = [];
  private pelletsRemaining = 0;
  private flashPellets = false;
  private flashTimer = 0;

  constructor() {
    this.generateMaze();
  }

  private generateMaze(): void {
    // 1 = wall, 0 = path, 2 = pellet, 3 = power pellet, 4 = ghost house
    const layout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1],
      [1, 3, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 3, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1],
      [0, 0, 0, 0, 2, 0, 0, 0, 4, 4, 0, 0, 0, 2, 0, 0, 0, 0],
      [1, 1, 1, 1, 2, 1, 1, 0, 4, 4, 0, 1, 1, 2, 1, 1, 1, 1],
      [1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
      [1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1],
      [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
      [1, 2, 2, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.tiles = layout.map(row =>
      row.map(cell => {
        let type: Tile['type'];
        switch (cell) {
          case 1:
            type = 'wall';
            break;
          case 2:
            type = 'pellet';
            this.pelletsRemaining++;
            break;
          case 3:
            type = 'power-pellet';
            this.pelletsRemaining++;
            break;
          case 4:
            type = 'ghost-house';
            break;
          default:
            type = 'path';
        }
        return { type, collected: false };
      })
    );
  }

  public isWall(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true;
    }
    const tile = this.tiles[y][x];
    return tile.type === 'wall';
  }

  public getTileAt(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.tiles[y][x];
  }

  public collectPellet(
    x: number,
    y: number
  ): { points: number; isPowerPellet: boolean } | null {
    const tile = this.tiles[y]?.[x];
    if (!tile || tile.collected) return null;

    if (tile.type === 'pellet') {
      tile.collected = true;
      this.pelletsRemaining--;
      return { points: 10, isPowerPellet: false };
    }

    if (tile.type === 'power-pellet') {
      tile.collected = true;
      this.pelletsRemaining--;
      return { points: 50, isPowerPellet: true };
    }

    return null;
  }

  public isComplete(): boolean {
    return this.pelletsRemaining === 0;
  }

  public reset(): void {
    this.pelletsRemaining = 0;
    this.tiles.forEach(row => {
      row.forEach(tile => {
        if (tile.type === 'pellet' || tile.type === 'power-pellet') {
          tile.collected = false;
          this.pelletsRemaining++;
        }
      });
    });
    this.flashPellets = false;
    this.flashTimer = 0;
  }

  public startFlashing(): void {
    this.flashPellets = true;
    this.flashTimer = 0;
  }

  public updateFlash(deltaTime: number): void {
    if (this.flashPellets) {
      this.flashTimer += deltaTime;
    }
  }

  private isWallTile(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true;
    }
    return this.tiles[y][x].type === 'wall';
  }

  public render(ctx: CanvasRenderingContext2D): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        const px = x * this.tileSize;
        const py = y * this.tileSize;

        switch (tile.type) {
          case 'pellet':
            if (!tile.collected) {
              const shouldShow = !this.flashPellets || Math.floor(this.flashTimer * 6) % 2 === 0;
              if (shouldShow) {
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(
                  px + this.tileSize / 2,
                  py + this.tileSize / 2,
                  5,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            }
            break;
          case 'power-pellet':
            if (!tile.collected) {
              const shouldShow = !this.flashPellets || Math.floor(this.flashTimer * 6) % 2 === 0;
              if (shouldShow) {
                ctx.fillStyle = '#FFF380';
                ctx.beginPath();
                ctx.arc(
                  px + this.tileSize / 2,
                  py + this.tileSize / 2,
                  12,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            }
            break;
          case 'ghost-house':
            ctx.fillStyle = '#FFB8FF';
            ctx.fillRect(px, py, this.tileSize, this.tileSize);
            break;
        }
      }
    }

    ctx.strokeStyle = '#2121DE';
    ctx.lineWidth = 8;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        if (tile.type !== 'wall') continue;

        const px = x * this.tileSize;
        const py = y * this.tileSize;
        const cornerRadius = 8;
        const offset = 2;

        const hasWallUp = this.isWallTile(x, y - 1);
        const hasWallDown = this.isWallTile(x, y + 1);
        const hasWallLeft = this.isWallTile(x - 1, y);
        const hasWallRight = this.isWallTile(x + 1, y);
        const hasWallUpLeft = this.isWallTile(x - 1, y - 1);
        const hasWallUpRight = this.isWallTile(x + 1, y - 1);
        const hasWallDownLeft = this.isWallTile(x - 1, y + 1);
        const hasWallDownRight = this.isWallTile(x + 1, y + 1);

        if (!hasWallUp && !hasWallLeft) {
          ctx.beginPath();
          ctx.moveTo(px + cornerRadius, py + offset);
          ctx.arcTo(
            px + offset,
            py + offset,
            px + offset,
            py + cornerRadius,
            cornerRadius
          );
          ctx.stroke();
        }

        if (!hasWallUp && !hasWallRight) {
          ctx.beginPath();
          ctx.moveTo(px + this.tileSize - cornerRadius, py + offset);
          ctx.arcTo(
            px + this.tileSize - offset,
            py + offset,
            px + this.tileSize - offset,
            py + cornerRadius,
            cornerRadius
          );
          ctx.stroke();
        }

        if (!hasWallDown && !hasWallLeft) {
          ctx.beginPath();
          ctx.moveTo(px + offset, py + this.tileSize - cornerRadius);
          ctx.arcTo(
            px + offset,
            py + this.tileSize - offset,
            px + cornerRadius,
            py + this.tileSize - offset,
            cornerRadius
          );
          ctx.stroke();
        }

        if (!hasWallDown && !hasWallRight) {
          ctx.beginPath();
          ctx.moveTo(
            px + this.tileSize - offset,
            py + this.tileSize - cornerRadius
          );
          ctx.arcTo(
            px + this.tileSize - offset,
            py + this.tileSize - offset,
            px + this.tileSize - cornerRadius,
            py + this.tileSize - offset,
            cornerRadius
          );
          ctx.stroke();
        }

        ctx.beginPath();

        if (!hasWallUp) {
          const startX = !hasWallLeft ? px + cornerRadius : px;
          const endX = !hasWallRight
            ? px + this.tileSize - cornerRadius
            : px + this.tileSize;
          if (endX > startX) {
            ctx.moveTo(startX, py + offset);
            ctx.lineTo(endX, py + offset);
          }
        }

        if (!hasWallDown) {
          const startX = !hasWallLeft ? px + cornerRadius : px;
          const endX = !hasWallRight
            ? px + this.tileSize - cornerRadius
            : px + this.tileSize;
          if (endX > startX) {
            ctx.moveTo(startX, py + this.tileSize - offset);
            ctx.lineTo(endX, py + this.tileSize - offset);
          }
        }

        if (!hasWallLeft) {
          const startY = !hasWallUp ? py + cornerRadius : py;
          const endY = !hasWallDown
            ? py + this.tileSize - cornerRadius
            : py + this.tileSize;
          if (endY > startY) {
            ctx.moveTo(px + offset, startY);
            ctx.lineTo(px + offset, endY);
          }
        }

        if (!hasWallRight) {
          const startY = !hasWallUp ? py + cornerRadius : py;
          const endY = !hasWallDown
            ? py + this.tileSize - cornerRadius
            : py + this.tileSize;
          if (endY > startY) {
            ctx.moveTo(px + this.tileSize - offset, startY);
            ctx.lineTo(px + this.tileSize - offset, endY);
          }
        }

        ctx.stroke();

        if (hasWallUp && hasWallLeft && !hasWallUpLeft) {
          ctx.beginPath();
          ctx.arc(px, py, offset, 0, 0.5 * Math.PI);
          ctx.stroke();
        }

        if (hasWallUp && hasWallRight && !hasWallUpRight) {
          ctx.beginPath();
          ctx.arc(px + this.tileSize, py, offset, 0.5 * Math.PI, Math.PI);
          ctx.stroke();
        }

        if (hasWallDown && hasWallLeft && !hasWallDownLeft) {
          ctx.beginPath();
          ctx.arc(px, py + this.tileSize, offset, 1.5 * Math.PI, 2 * Math.PI);
          ctx.stroke();
        }

        if (hasWallDown && hasWallRight && !hasWallDownRight) {
          ctx.beginPath();
          ctx.arc(
            px + this.tileSize,
            py + this.tileSize,
            offset,
            Math.PI,
            1.5 * Math.PI
          );
          ctx.stroke();
        }
      }
    }
  }
}
