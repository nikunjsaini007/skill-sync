import { useEffect, useRef } from "react";

interface GalaxyFieldProps {
  className?: string;
  density?: number;
  cometInterval?: number;
  mouseParallax?: boolean;
}

const STAR_COLORS = [
  "255,255,255",
  "226,232,240",
  "186,230,253",
  "125,211,252",
  "250,204,21",
  "253,224,71",
];

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  base: number;
  twinkle: number;
  phase: number;
  color: string;
  vx: number;
  vy: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
  color: string;
  size: number;
}

export default function GalaxyField({
  className = "",
  density = 0.7,
  cometInterval = 3000,
  mouseParallax = true,
}: GalaxyFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let comets: Comet[] = [];
    let lastCometAt = 0;
    let start = performance.now();
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const initStars = () => {
      const count = Math.max(20, Math.round(((width * height) / 9000) * density));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.35 + Math.random() * 0.65,
          r: 0.4 + Math.random() * 1.4,
          base: 0.35 + Math.random() * 0.6,
          twinkle: 1 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.04,
        });
      }
    };

    const spawnComet = () => {
      const fromTop = Math.random() > 0.5;
      const x = fromTop ? Math.random() * width : -40;
      const y = fromTop ? -40 : Math.random() * height * 0.6;
      const angle = Math.PI / 4 + (Math.random() * Math.PI) / 6;
      const speed = 2.5 + Math.random() * 3;
      const color = Math.random() > 0.4 ? "185,236,255" : "250,215,120";
      comets.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 120 + Math.random() * 80,
        trail: [],
        color,
        size: 1.6 + Math.random() * 1.2,
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    const step = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = (now - start) / 1000;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const px = mouseParallax ? mouse.x : 0;
      const py = mouseParallax ? mouse.y : 0;

      for (const s of stars) {
        s.x += s.vx * s.z + px * 0.18 * s.z;
        s.y += s.vy * s.z + py * 0.12 * s.z;
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        const alpha = s.base * (0.55 + 0.45 * Math.sin(t * s.twinkle + s.phase));
        if (alpha <= 0.03) continue;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.4) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${s.color},${alpha * 0.18})`;
          ctx.arc(s.x, s.y, s.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (cometInterval > 0 && now - lastCometAt > cometInterval + Math.random() * 1600) {
        spawnComet();
        lastCometAt = now;
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx;
        c.y += c.vy;
        c.life += 1;
        c.trail.push({ x: c.x, y: c.y });
        if (c.trail.length > 20) c.trail.shift();

        const alpha = Math.sin(Math.min(c.life / c.maxLife, 1) * Math.PI);

        if (c.trail.length > 1) {
          const grad = ctx.createLinearGradient(c.trail[0].x, c.trail[0].y, c.x, c.y);
          grad.addColorStop(0, `rgba(${c.color},0)`);
          grad.addColorStop(1, `rgba(${c.color},${0.8 * alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = c.size;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(c.trail[0].x, c.trail[0].y);
          for (let k = 1; k < c.trail.length; k++) ctx.lineTo(c.trail[k].x, c.trail[k].y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${c.color},${alpha})`;
        ctx.arc(c.x, c.y, c.size * 2, 0, Math.PI * 2);
        ctx.fill();

        if (c.life > c.maxLife || c.x > width + 120 || c.y > height + 120) {
          comets.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(step);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          lastCometAt = performance.now();
          start = performance.now();
          raf = requestAnimationFrame(step);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    resize();
    window.addEventListener("resize", resize);
    if (mouseParallax) window.addEventListener("mousemove", onMouse);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf);
    };
  }, [density, cometInterval, mouseParallax]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
