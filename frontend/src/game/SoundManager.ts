export class SoundManager {
  private isMuted = false;

  private lobbyMusic: HTMLAudioElement;
  private beginningSound: HTMLAudioElement;
  private chompSound: HTMLAudioElement;
  private deathSound: HTMLAudioElement;
  private eatGhostSound: HTMLAudioElement;
  private eatFruitSound: HTMLAudioElement;
  private intermissionSound: HTMLAudioElement;

  private currentlyPlaying: HTMLAudioElement | null = null;
  private isChompPlaying = false;

  constructor() {
    this.lobbyMusic = new Audio('/src/game/sfx/pacman_ringtone.mp3');
    this.beginningSound = new Audio('/src/game/sfx/pacman_beginning.wav');
    this.chompSound = new Audio('/src/game/sfx/pacman_chomp.wav');
    this.deathSound = new Audio('/src/game/sfx/pacman_death.wav');
    this.eatGhostSound = new Audio('/src/game/sfx/pacman_eatghost.wav');
    this.eatFruitSound = new Audio('/src/game/sfx/pacman_eatfruit.wav');
    this.intermissionSound = new Audio('/src/game/sfx/pacman_intermission.wav');

    this.lobbyMusic.loop = true;
    this.lobbyMusic.volume = 0.5;

    this.chompSound.onended = () => {
      this.isChompPlaying = false;
    };
  }

  public playLobbyMusic(): void {
    if (!this.isMuted) {
      this.lobbyMusic.play().catch(err => console.warn('Lobby music play failed:', err));
    }
  }

  public stopLobbyMusic(): void {
    this.lobbyMusic.pause();
    this.lobbyMusic.currentTime = 0;
  }

  public async playBeginning(): Promise<void> {
    this.stopLobbyMusic();
    if (!this.isMuted) {
      this.currentlyPlaying = this.beginningSound;
      await this.beginningSound.play().catch(err => console.warn('Beginning sound play failed:', err));

      return new Promise((resolve) => {
        this.beginningSound.onended = () => {
          this.currentlyPlaying = null;
          resolve();
        };
      });
    }
    return Promise.resolve();
  }

  public playChomp(): void {
    if (!this.isMuted && !this.isChompPlaying) {
      this.isChompPlaying = true;
      this.chompSound.currentTime = 0;
      this.chompSound.play().catch(err => {
        console.warn('Chomp sound play failed:', err);
        this.isChompPlaying = false;
      });
    }
  }

  public playPowerPellet(): void {
    if (!this.isMuted) {
      this.eatFruitSound.currentTime = 0;
      this.eatFruitSound.play().catch(err => console.warn('Power pellet sound play failed:', err));
    }
  }

  public playEatGhost(): void {
    if (!this.isMuted) {
      this.eatGhostSound.currentTime = 0;
      this.eatGhostSound.play().catch(err => console.warn('Eat ghost sound play failed:', err));
    }
  }

  public async playDeath(): Promise<void> {
    if (!this.isMuted) {
      this.currentlyPlaying = this.deathSound;
      this.deathSound.currentTime = 0;
      await this.deathSound.play().catch(err => console.warn('Death sound play failed:', err));

      return new Promise((resolve) => {
        this.deathSound.onended = () => {
          this.currentlyPlaying = null;
          resolve();
        };
      });
    }
    return Promise.resolve();
  }

  public async playIntermission(): Promise<void> {
    if (!this.isMuted) {
      this.currentlyPlaying = this.intermissionSound;
      await this.intermissionSound.play().catch(err => console.warn('Intermission sound play failed:', err));

      return new Promise((resolve) => {
        this.intermissionSound.onended = () => {
          this.currentlyPlaying = null;
          resolve();
        };
      });
    }
    return Promise.resolve();
  }

  public playLevelComplete(): void {
  }

  public playGameOver(): void {
  }

  public pause(): void {
    this.currentlyPlaying?.pause();
  }

  public resume(): void {
    if (!this.isMuted && this.currentlyPlaying) {
      this.currentlyPlaying.play().catch(err => console.warn('Resume play failed:', err));
    }
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopLobbyMusic();
      this.currentlyPlaying?.pause();
    }
  }

  public destroy(): void {
    this.stopLobbyMusic();
    this.currentlyPlaying?.pause();
  }
}
