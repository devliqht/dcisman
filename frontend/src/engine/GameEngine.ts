import { Maze } from './Maze';
import { Pacman } from './entities/Pacman';
import { Ghost } from './entities/Ghost';
import { InputManager } from './InputManager';
import { SoundManager } from './SoundManager';
import { ParticleSystem } from './ParticleSystem';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private maze: Maze;
  private pacman: Pacman;
  private ghosts: Ghost[];
  private input: InputManager;
  private sound: SoundManager;
  private particles: ParticleSystem;
  private onGameOverCallback?: () => void;

  private gameLoop: number | null = null;
  private lastTime: number = 0;
  private isPaused: boolean = false;
  private isStarting: boolean = false;
  private isIntermission: boolean = false;
  private isDying: boolean = false;
  private deathTimer: number = 0;
  private isRespawning: boolean = false;
  private respawnTimer: number = 0;
  private isEatingGhost: boolean = false;
  private eatingGhostTimer: number = 0;

  private score: number = 0;
  private level: number = 1;
  private lives: number = 3;
  private gameTime: number = 0;
  private ghostsEaten: number = 0;
  private powerUpsUsed: number = 0;

  private floatingTexts: Array<{
    text: string;
    x: number;
    y: number;
    timer: number;
  }> = [];

  constructor(canvas: HTMLCanvasElement, onGameOver?: () => void) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
    this.onGameOverCallback = onGameOver;

    this.maze = new Maze();
    this.pacman = new Pacman(9, 17);
    this.ghosts = [
      new Ghost('blinky', 8, 8, '#FF0000'), // Red - top left of ghost box
      new Ghost('pinky', 9, 9, '#FFB8FF'), // Pink - bottom right of ghost box
      new Ghost('inky', 8, 9, '#00FFFF'), // Cyan - bottom left of ghost box
      new Ghost('clyde', 9, 8, '#FFB851'), // Orange - top right of ghost box
    ];

    this.input = new InputManager();
    this.sound = new SoundManager();
    this.particles = new ParticleSystem();

    this.renderInitialState();
  }

  private renderInitialState(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.maze.render(this.ctx);
    this.pacman.render(this.ctx);
    this.ghosts.forEach(ghost => ghost.render(this.ctx));
  }

  public async start(): Promise<void> {
    if (this.gameLoop || this.isStarting) return;

    this.isStarting = true;
    await this.sound.playBeginning();
    this.isStarting = false;

    this.lastTime = performance.now();
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }

  public pause(): void {
    this.isPaused = true;
    this.sound.pause();
  }

  public resume(): void {
    this.isPaused = false;
    this.lastTime = performance.now();
    this.sound.resume();
  }

  public reset(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }

    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.gameTime = 0;
    this.ghostsEaten = 0;
    this.powerUpsUsed = 0;

    this.isPaused = false;
    this.isStarting = false;
    this.isIntermission = false;
    this.isDying = false;
    this.deathTimer = 0;
    this.isRespawning = false;
    this.respawnTimer = 0;
    this.isEatingGhost = false;
    this.eatingGhostTimer = 0;

    this.floatingTexts = [];

    this.maze = new Maze();

    this.pacman = new Pacman(9, 17);

    this.ghosts = [
      new Ghost('blinky', 8, 8, '#FF0000'),
      new Ghost('pinky', 9, 9, '#FFB8FF'),
      new Ghost('inky', 8, 9, '#00FFFF'),
      new Ghost('clyde', 9, 8, '#FFB851'),
    ];

    this.particles = new ParticleSystem();

    this.renderInitialState();

    this.updateUI();
  }

  public destroy(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
    }
    this.input.destroy();
    this.sound.destroy();
  }

  private update(currentTime: number): void {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (!this.isPaused) {
      if (this.isIntermission) {
        this.maze.updateFlash(deltaTime);
        this.render();
      } else {
        this.updateGame(deltaTime);
        this.render();
      }
    }

    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }

  private updateGame(deltaTime: number): void {
    this.gameTime += deltaTime;

    this.particles.update(deltaTime);

    if (this.isDying) {
      this.deathTimer -= deltaTime;
      this.pacman.updateMelting(deltaTime);
      if (this.deathTimer <= 0) {
        this.isDying = false;
        this.respawnAll();
        this.isRespawning = true;
        this.respawnTimer = 0.8;
        this.particles.createRespawnParticles(
          this.pacman.x,
          this.pacman.y,
          '#FFD700'
        );
        this.ghosts.forEach(ghost => {
          this.particles.createRespawnParticles(ghost.x, ghost.y, ghost.color);
        });
      }
      this.updateUI();
      return;
    }

    if (this.isEatingGhost) {
      this.eatingGhostTimer -= deltaTime;
      this.floatingTexts = this.floatingTexts.filter(text => {
        text.timer -= deltaTime;
        return text.timer > 0;
      });
      if (this.eatingGhostTimer <= 0) {
        this.isEatingGhost = false;
      }
      this.updateUI();
      return;
    }

    if (this.isRespawning) {
      this.respawnTimer -= deltaTime;
      if (this.respawnTimer <= 0) {
        this.isRespawning = false;
      }
      this.updateUI();
      return;
    }

    const direction = this.input.getDirection();
    this.pacman.update(deltaTime, direction, this.maze);

    this.ghosts.forEach(ghost => {
      ghost.update(deltaTime, this.maze, this.pacman);
    });

    this.checkCollisions();

    this.floatingTexts = this.floatingTexts.filter(text => {
      text.timer -= deltaTime;
      return text.timer > 0;
    });

    this.updateUI();
  }

  private render(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.maze.render(this.ctx);

    if (!this.isIntermission) {
      if (this.isDying) {
        this.pacman.render(this.ctx);
      } else if (this.isRespawning) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.5 + (this.respawnTimer / 0.8) * 0.5;
        this.pacman.render(this.ctx);
        this.ctx.restore();
      } else {
        this.pacman.render(this.ctx);
      }

      if (this.isRespawning) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.5 + (this.respawnTimer / 0.8) * 0.5;
        this.ghosts.forEach(ghost => ghost.render(this.ctx));
        this.ctx.restore();
      } else {
        this.ghosts.forEach(ghost => ghost.render(this.ctx));
      }
    }

    this.particles.render(this.ctx);

    this.floatingTexts.forEach(text => {
      this.ctx.save();
      this.ctx.fillStyle = '#FFFF00';
      this.ctx.font = 'bold 16px VT323, monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(text.text, text.x, text.y);
      this.ctx.restore();
    });
  }

  private checkCollisions(): void {
    const pellet = this.maze.collectPellet(this.pacman.x, this.pacman.y);
    if (pellet) {
      this.score += pellet.points;
      this.sound.playChomp();

      if (pellet.isPowerPellet) {
        this.powerUpsUsed++;
        this.ghosts.forEach(g => g.setFrightened(true));
        this.sound.playPowerPellet();
      }
    }

    this.ghosts.forEach(ghost => {
      if (ghost.collidesWith(this.pacman)) {
        if (ghost.isFrightened) {
          const points = 200;
          this.score += points;
          this.ghostsEaten++;

          this.floatingTexts.push({
            text: `+${points}`,
            x: ghost.x * 48 + 24,
            y: ghost.y * 48 + 24,
            timer: 1.5,
          });

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 48;
          tempCanvas.height = 48;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            ghost.render(tempCtx);
            this.particles.createDisintegrationFromCanvas(
              tempCtx,
              ghost.x,
              ghost.y,
              48,
              48
            );
          }

          ghost.setEaten(true);
          this.sound.playEatGhost();

          this.isEatingGhost = true;
          this.eatingGhostTimer = 1.0;
        } else if (!ghost.isEaten) {
          this.handleDeath();
        }
      }
    });

    if (this.maze.isComplete()) {
      this.levelComplete();
    }
  }

  private updateUI(): void {
    const scoreEl = document.getElementById('game-score');
    const levelEl = document.getElementById('game-level');
    const livesEl = document.getElementById('game-lives');
    const timeEl = document.getElementById('game-time');

    if (scoreEl) scoreEl.textContent = this.score.toString();
    if (levelEl) levelEl.textContent = this.level.toString();
    if (livesEl) livesEl.textContent = this.lives.toString();
    if (timeEl) {
      const totalSeconds = Math.floor(this.gameTime);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }

  private handleDeath(): void {
    if (this.isDying) return; 

    this.lives--;
    this.isDying = true;
    this.deathTimer = 1.5; 

    this.pacman.startMelting();

    this.sound.playDeath();

    if (this.lives === 0) {
      setTimeout(() => {
        this.gameOver();
      }, 2000);
    }
  }

  private respawnAll(): void {
    this.pacman.respawn();
    this.ghosts.forEach(g => g.respawn());
  }

  private async levelComplete(): Promise<void> {
    this.isIntermission = true;
    this.maze.startFlashing();

    await this.sound.playIntermission();

    this.level++;
    this.maze.reset();
    this.respawnAll();

    this.isIntermission = false;
    this.lastTime = performance.now();
  }

  private gameOver(): void {
    this.pause();
    this.sound.playGameOver();

    if (this.onGameOverCallback) {
      this.onGameOverCallback();
    }
  }

  public getScore(): number {
    return this.score;
  }

  public getLevel(): number {
    return this.level;
  }

  public getLives(): number {
    return this.lives;
  }

  public getGameTime(): number {
    return Math.floor(this.gameTime);
  }

  public getGhostsEaten(): number {
    return this.ghostsEaten;
  }

  public getPowerUpsUsed(): number {
    return this.powerUpsUsed;
  }
}
