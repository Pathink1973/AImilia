import React, { useEffect, useRef } from 'react';

interface VoiceSphereProps {
  isActive: boolean;
  isSpeaking: boolean;
  amplitude?: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  angle: number;
  velocity: number;
  baseDistance: number;
  distanceOffset: number;
  color: { r: number; g: number; b: number };
  opacity: number;
  scale: number;
  energy: number;
  pulsePhase: number;
  originalRadius: number;
}

// Função auxiliar para converter hex para rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export default function VoiceSphere({ isActive, isSpeaking, amplitude = 0 }: VoiceSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastAmplitudeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Aumentando a resolução para efeitos mais detalhados
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = '200px';
    canvas.style.height = '200px';
    const centerX = size / 2;
    const centerY = size / 2;

    // Cores futuristas com tons de néon
    const colors = [
      '#A854F7', // Roxo principal
      '#7C3AED', // Roxo mais escuro
      '#C084FC', // Roxo mais claro
      '#F0ABFC', // Rosa neon
      '#818CF8', // Azul neon
      '#6EE7B7', // Verde neon (acento)
    ].map(hexToRgb);

    // Inicialização de partículas com características futuristas
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const radius = Math.random() * 3 + 1;
      return {
        x: centerX,
        y: centerY,
        radius: radius,
        originalRadius: radius,
        angle: Math.random() * Math.PI * 2,
        velocity: Math.random() * 0.02 + 0.01,
        baseDistance: Math.random() * 40 + 50,
        distanceOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.7 + 0.3,
        scale: Math.random() * 0.5 + 0.5,
        energy: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Suavização da amplitude com easing mais responsivo
      const targetAmplitude = Math.pow(amplitude, 1.5);
      const smoothAmplitude = targetAmplitude * 0.9 + lastAmplitudeRef.current * 0.1;
      lastAmplitudeRef.current = smoothAmplitude;

      // Efeito de campo de força externo
      const forceFieldGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size / 2
      );

      const { r, g, b } = hexToRgb(isActive ? '#A854F7' : '#E9D5FF');
      const forceFieldOpacity = 0.05 + smoothAmplitude * 0.1;

      forceFieldGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      forceFieldGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${forceFieldOpacity})`);
      forceFieldGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = forceFieldGradient;
      ctx.fillRect(0, 0, size, size);

      // Núcleo com efeito de plasma
      const baseRadius = 45 + (smoothAmplitude * 25);
      const time = Date.now() / 1000;

      // Múltiplas camadas de glow para efeito mais dramático
      [0.5, 0.3, 0.15].forEach((intensity, i) => {
        const glowRadius = baseRadius * (1.5 + i * 0.5);
        const glowGradient = ctx.createRadialGradient(
          centerX, centerY, glowRadius * 0.4,
          centerX, centerY, glowRadius
        );

        const glowOpacity = intensity * (0.3 + smoothAmplitude * 0.7);
        const glowColor = `rgba(${r}, ${g}, ${b}, ${glowOpacity})`;

        glowGradient.addColorStop(0, glowColor);
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      });

      // Núcleo principal com efeito de energia
      const coreGradient = ctx.createRadialGradient(
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        0,
        centerX,
        centerY,
        baseRadius
      );

      const energyPulse = Math.sin(time * 3) * 0.1 + 0.9;
      const primaryOpacity = energyPulse * (0.9 + smoothAmplitude * 0.1);
      const secondaryOpacity = energyPulse * (0.7 + smoothAmplitude * 0.3);

      coreGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${primaryOpacity})`);
      coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${secondaryOpacity})`);

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Partículas com comportamento mais dinâmico
      particlesRef.current.forEach((particle) => {
        particle.energy += (Math.random() - 0.5) * 0.1;
        particle.energy = Math.max(0.2, Math.min(1, particle.energy));

        const orbitSpeed = isSpeaking ? 1.5 + smoothAmplitude * 2 : 0.5;
        particle.angle += particle.velocity * orbitSpeed * particle.energy;

        particle.pulsePhase += 0.05;
        const pulseFactor = Math.sin(particle.pulsePhase) * 0.3 + 0.7;

        const amplitudeEffect = smoothAmplitude * 40 * particle.energy;
        const distance = particle.baseDistance + amplitudeEffect;
        const wobble = Math.sin(time * 2 + particle.distanceOffset) * 5;

        particle.x = centerX + Math.cos(particle.angle) * (distance + wobble);
        particle.y = centerY + Math.sin(particle.angle) * (distance + wobble);

        const sizeMultiplier = 1 + (smoothAmplitude * 2 * particle.energy);
        const currentRadius = particle.originalRadius * sizeMultiplier * pulseFactor;

        const particleGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          currentRadius * 2
        );

        const particleOpacity = particle.opacity * (0.5 + particle.energy * 0.5);
        const glowOpacity = particleOpacity * (0.3 + smoothAmplitude * 0.7);
        const { r, g, b } = particle.color;

        particleGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particleOpacity})`);
        particleGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${glowOpacity})`);
        particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          currentRadius * 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = particleGradient;
        ctx.fill();

        // Linhas de energia entre partículas próximas
        if (isSpeaking && particle.energy > 0.7) {
          particlesRef.current.forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) {
              const lineOpacity = (1 - distance / 50) * 0.2 * smoothAmplitude;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isSpeaking, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-full"
      style={{
        filter: 'blur(0.5px)',
        transform: 'translateZ(0)',
        willChange: 'transform',
        background: 'rgba(0, 0, 0, 0.03)'
      }}
    />
  );
}
