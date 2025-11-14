export type Direction = 'up' | 'down' | 'left' | 'right' | null;

export class InputManager {
  private currentDirection: Direction = null;
  private keysPressed: Set<string> = new Set();
  private keyDownHandler: (e: KeyboardEvent) => void;
  private keyUpHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.keyDownHandler, true);
    window.addEventListener('keyup', this.keyUpHandler, true);
    document.addEventListener('keydown', this.keyDownHandler, true);
    document.addEventListener('keyup', this.keyUpHandler, true);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const key = e.key;

    if (
      [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'w',
        'W',
        'a',
        'A',
        's',
        'S',
        'd',
        'D',
      ].includes(key)
    ) {
      e.preventDefault();
    }

    this.keysPressed.add(key);

    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.currentDirection = 'up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.currentDirection = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.currentDirection = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.currentDirection = 'right';
        break;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keysPressed.delete(e.key);

    const hasMovementKey = Array.from(this.keysPressed).some(k =>
      [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'w',
        'W',
        'a',
        'A',
        's',
        'S',
        'd',
        'D',
      ].includes(k)
    );

    if (!hasMovementKey) {
      this.currentDirection = null;
    }
  }

  public getDirection(): Direction {
    return this.currentDirection;
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.keyDownHandler, true);
    window.removeEventListener('keyup', this.keyUpHandler, true);
    document.removeEventListener('keydown', this.keyDownHandler, true);
    document.removeEventListener('keyup', this.keyUpHandler, true);
  }
}
