type ParticleType = 'pixel' | 'respawn';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: ParticleType;
  rotation?: number;
  rotationSpeed?: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  public update(deltaTime: number): void {
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      if (particle.life <= 0) return false;

      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.vy += 200 * deltaTime; // gravity

      if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
        particle.rotation += particle.rotationSpeed * deltaTime;
      }

      return true;
    });
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.imageSmoothingEnabled = false;

    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;

      if (particle.type === 'pixel') {
        ctx.fillRect(
          Math.floor(particle.x),
          Math.floor(particle.y),
          particle.size,
          particle.size
        );
      } else if (particle.type === 'respawn') {
        const size = Math.floor(particle.size);
        const cx = Math.floor(particle.x);
        const cy = Math.floor(particle.y);

        for (let i = -size; i <= size; i += 2) {
          ctx.fillRect(cx + i, cy, 2, 2);
          ctx.fillRect(cx, cy + i, 2, 2);
        }
      }

      ctx.restore();
    });

    ctx.imageSmoothingEnabled = true;
  }

  public createDisintegrationFromCanvas(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const pixelSize = 2;
    const centerX = x * 48 + 24;
    const centerY = y * 48 + 24;

    const imageData = ctx.getImageData(
      x * 48,
      y * 48,
      width,
      height
    );

    for (let py = 0; py < height; py += pixelSize) {
      for (let px = 0; px < width; px += pixelSize) {
        const i = (py * width + px) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];

        if (a > 50) {
          const color = `rgb(${r}, ${g}, ${b})`;
          const particleX = x * 48 + px;
          const particleY = y * 48 + py;

          const dx = particleX - centerX;
          const dy = particleY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          const speed = 50 + Math.random() * 100;
          const spreadFactor = distance / 20 + 1;

          this.particles.push({
            x: particleX,
            y: particleY,
            vx: Math.cos(angle) * speed * spreadFactor,
            vy: Math.sin(angle) * speed * spreadFactor - 50,
            life: 1.2 + Math.random() * 0.5,
            maxLife: 1.7,
            color: color,
            size: pixelSize,
            type: 'pixel'
          });
        }
      }
    }
  }

  public createRespawnParticles(x: number, y: number, color: string): void {
    const centerX = x * 48 + 24;
    const centerY = y * 48 + 24;
    const numSparkles = 16;

    for (let i = 0; i < numSparkles; i++) {
      const angle = (i / numSparkles) * Math.PI * 2;
      const distance = 20 + Math.random() * 15;
      const speed = 40 + Math.random() * 40;

      this.particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6,
        maxLife: 0.6,
        color: color,
        size: 4,
        type: 'respawn'
      });
    }
  }

  public clear(): void {
    this.particles = [];
  }

  public hasParticles(): boolean {
    return this.particles.length > 0;
  }
}
