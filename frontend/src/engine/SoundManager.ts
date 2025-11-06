// Import audio files as modules so Vite bundles them correctly
import lobbyMusicUrl from './sfx/pacman_ringtone.mp3';
import beginningSoundUrl from './sfx/pacman_beginning.wav';
import chompSoundUrl from './sfx/pacman_chomp.wav';
import deathSoundUrl from './sfx/pacman_death.wav';
import eatGhostSoundUrl from './sfx/pacman_eatghost.wav';
import eatFruitSoundUrl from './sfx/pacman_eatfruit.wav';
import intermissionSoundUrl from './sfx/pacman_intermission.wav';

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
  private hasUserInteracted = false;

  constructor() {
    this.lobbyMusic = new Audio(lobbyMusicUrl);
    this.beginningSound = new Audio(beginningSoundUrl);
    this.chompSound = new Audio(chompSoundUrl);
    this.deathSound = new Audio(deathSoundUrl);
    this.eatGhostSound = new Audio(eatGhostSoundUrl);
    this.eatFruitSound = new Audio(eatFruitSoundUrl);
    this.intermissionSound = new Audio(intermissionSoundUrl);

    this.lobbyMusic.loop = true;
    this.lobbyMusic.volume = 0.5;

    this.chompSound.onended = () => {
      this.isChompPlaying = false;
    };
  }

  public markUserInteraction(): void {
    this.hasUserInteracted = true;
  }

  public playLobbyMusic(): void {
    if (!this.isMuted && this.hasUserInteracted) {
      this.lobbyMusic
        .play()
        .catch(err => console.warn('Lobby music play failed:', err));
    }
  }

  public stopLobbyMusic(): void {
    this.lobbyMusic.pause();
    this.lobbyMusic.currentTime = 0;
  }

  public async playBeginning(): Promise<void> {
    this.markUserInteraction();
    this.stopLobbyMusic();
    if (!this.isMuted) {
      this.currentlyPlaying = this.beginningSound;
      this.beginningSound
        .play()
        .catch(err => console.warn('Beginning sound play failed:', err));

      return new Promise(resolve => {
        const timeout = setTimeout(() => {
          this.currentlyPlaying = null;
          resolve();
        }, 5000);

        this.beginningSound.onended = () => {
          clearTimeout(timeout);
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
      this.eatFruitSound
        .play()
        .catch(err => console.warn('Power pellet sound play failed:', err));
    }
  }

  public playEatGhost(): void {
    if (!this.isMuted) {
      this.eatGhostSound.currentTime = 0;
      this.eatGhostSound
        .play()
        .catch(err => console.warn('Eat ghost sound play failed:', err));
    }
  }

  public async playDeath(): Promise<void> {
    if (!this.isMuted) {
      this.currentlyPlaying = this.deathSound;
      this.deathSound.currentTime = 0;
      await this.deathSound
        .play()
        .catch(err => console.warn('Death sound play failed:', err));

      return new Promise(resolve => {
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
      await this.intermissionSound
        .play()
        .catch(err => console.warn('Intermission sound play failed:', err));

      return new Promise(resolve => {
        this.intermissionSound.onended = () => {
          this.currentlyPlaying = null;
          resolve();
        };
      });
    }
    return Promise.resolve();
  }

  public playLevelComplete(): void {}

  public playGameOver(): void {}

  public pause(): void {
    this.currentlyPlaying?.pause();
  }

  public resume(): void {
    if (!this.isMuted && this.currentlyPlaying) {
      this.currentlyPlaying
        .play()
        .catch(err => console.warn('Resume play failed:', err));
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
